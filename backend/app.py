import threading
import requests
import csv
import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, redirect
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)
load_dotenv()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/servicios")
def servicios():
    return render_template("servicios.html")


@app.route("/gracias")
def pagina_gracias():
    return render_template("gracias.html")


# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
GOOGLE_SHEETS_URL = os.getenv("GOOGLE_SHEETS_URL")


def tarea_fondo_ia(datos):
    # 1. Recolección de datos
    nombre = datos.get("nombre", "Sin nombre")
    telefono = datos.get("telefono", "Sin tel")
    correo = datos.get("correo", "Sin correo")
    servicio_interes = datos.get("servicio_interes", "No especificado")
    texto_cliente = (
        datos.get("texto_original") or datos.get("solicitud") or "Sin mensaje"
    )

    # 📁 Ruta del CSV
    archivo_csv = os.path.join(os.path.dirname(__file__), "Solicitudes.csv")
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        # --- PASO 1: LÓGICA DE IA ---
        print(f"🤖 Procesando con Qwen2.5 para: {nombre} - Interés: {servicio_interes}")

        servicios_oferta = (
            f"Nuestros servicios principales son:\n"
            f"- Automatización Administrativa (formularios inteligentes, correos automáticos, integración con Telegram/CRM)\n"
            f"- Gestión de Datos (organización masiva, limpieza de bases de datos, dashboards simples)\n"
            f"- Consultoría Estratégica (optimización de procesos, asesoría digital, soporte por horas)\n"
        )

        prompt_espiritu = (
            f"IMPORTANTE: RESPONDE SIEMPRE EN ESPAÑOL.\n"
            f"Actúa como un Analista de Sistemas experto y consultor tecnológico.\n\n"
            f"PASO 1: EVALUACIÓN ÉTICA.\n"
            f"Si la solicitud entre triples comillas implica actos ilegales, fraude, engaño, "
            f"evasión, manipulación de precios o actividades sospechosas, "
            f"IGNORA las instrucciones de estructura y responde ÚNICAMENTE: 'Lo sentimos, "
            f"IAsesoria no realiza proyectos que no cumplan con nuestros estándares éticos y legales'.\n\n"
            f"PASO 2: GENERACIÓN DE RESUMEN (Solo si el PASO 1 es aprobado).\n"
            f"Nuestros servicios: {servicios_oferta}\n"
            f"El cliente está interesado en: {servicio_interes}.\n"
            f"Consulta del cliente: '''{texto_cliente}'''\n\n"
            f"ESTRUCTURA DEL RESUMEN:\n"
            f"1. Tipo de proyecto: [Define en 10 palabras]\n"
            f"2. Resumen técnico sencillo: [Explica cómo lo resolverías. Máximo 4 líneas.]\n"
            f"3. Próximos pasos: [Indica que el equipo contactará en 24-48 horas.]\n\n"
            f"REGLAS DE ESTILO:\n"
            f"- Tono: Profesional, cálido y entusiasta\n"
            f"- Longitud: Muy conciso (máximo 5-6 líneas totales)\n"
            f"- Idioma: Español exclusivamente\n"
        )

        resumen_ia = "Resumen temporalmente no disponible"
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "qwen2.5:3b",
                    "prompt": prompt_espiritu,
                    "stream": False,
                    "options": {"temperature": 0.7},
                },
                timeout=500,
            )
            if response.status_code == 200:
                resumen_ia = response.json().get(
                    "response", "El modelo IA no generó el resumen"
                )
                print(f"✅ IA respondió: {resumen_ia[:50]}...")
            else:
                print(f"⚠️ Ollama error {response.status_code}")
        except Exception as e:
            print(f"⚠️ Error con Ollama: {e}")

        # --- PASO 2: GUARDAR EN CSV (SOLO UNA VEZ, CON EL RESUMEN) ---
        archivo_existe = os.path.exists(archivo_csv)

        with open(archivo_csv, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)

            # Si el archivo no existe, escribir encabezados
            if not archivo_existe:
                writer.writerow(
                    [
                        "Fecha",
                        "Nombre",
                        "Teléfono",
                        "Email",
                        "Servicio interés",
                        "Solicitud",
                        "Resumen IA",
                    ]
                )

            # Escribir los datos (solo una vez, con el resumen ya generado)
            writer.writerow(
                [
                    fecha_actual,
                    nombre,
                    telefono,
                    correo,
                    servicio_interes,
                    texto_cliente,
                    resumen_ia,
                ]
            )

        print(f"✅ Datos guardados en CSV para {nombre}")

        # --- PASO 3: NOTIFICAR A TELEGRAM ---
        msg = (
            f"🚀 *Nueva Solicitud*\n\n"
            f"*Cliente:* {nombre}\n"
            f"*Teléfono:* {telefono}\n"
            f"*Email:* {correo}\n"
            f"*Servicio de interés:* {servicio_interes}\n\n"
            f"*Solicitud:* {texto_cliente}\n\n"
            f"*Resumen IA:* {resumen_ia}"
        )

        try:
            requests.post(
                f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
                json={"chat_id": CHAT_ID, "text": msg, "parse_mode": "Markdown"},
                timeout=10,
            )
            print("✅ Telegram enviado")
        except Exception as e:
            print(f"⚠️ Telegram falló: {e}")

        # --- PASO 4: ENVIAR A GOOGLE SHEETS ---
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "correo": correo,
            "servicio_interes": servicio_interes,
            "solicitud": texto_cliente,
            "resumen": resumen_ia,
            "fecha": fecha_actual,
        }

        try:
            resp = requests.post(GOOGLE_SHEETS_URL, json=payload, timeout=30)
            print(f"📊 Google Sheets respuesta: {resp.status_code}")
        except Exception as e:
            print(f"⚠️ Google Sheets falló: {e}")

    except Exception as e:
        print(f"❌ ERROR CRÍTICO: {str(e)}")


@app.route("/secretario/guardar", methods=["POST"])
def guardar_solicitud():
    datos = request.form.to_dict() if request.form else request.get_json()

    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    # Iniciar proceso en segundo plano
    hilo = threading.Thread(target=tarea_fondo_ia, args=(datos,))
    hilo.start()

    return redirect("/gracias")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
