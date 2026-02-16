import threading
import requests
import csv
import os
from dotenv import load_dotenv # type: ignore
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)  # Permitir CORS para todas las rutas
load_dotenv()


@app.route("/")
def index():
    return app.send_static_file("index.html")


# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
GOOGLE_SHEETS_URL = os.getenv("GOOGLE_SHEETS_URL")


def tarea_fondo_ia(datos):
    # 1. Recolección de datos (mapeo de nombres)
    nombre = datos.get("nombre", "Sin nombre")
    telefono = datos.get("telefono", "Sin tel")
    correo = datos.get("correo", "Sin correo")
    # Capturamos como se llame en el HTML y lo guardamos en una variable interna
    texto_cliente = (
        datos.get("texto_original") or datos.get("solicitud") or "Sin mensaje"
    )

    archivo_csv = "/home/bcarmona/secretario-ia-backend/backend/Solicitudes.csv"
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        # --- PASO 1: RESPALDO INICIAL EN CSV ---
        with open(archivo_csv, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(
                [fecha_actual, nombre, telefono, correo, texto_cliente, "PROCESANDO..."]
            )

        # --- PASO 2: LÓGICA DE IA (Ollama con Qwen) ---
        print(f"🤖 Procesando con Qwen2.5 para: {nombre}")
        resumen_ia = "Procesando..."  # Valor por defecto
        servicios_permitidos = (
            "Maquetación HTML, Google Apps Script (GAS), automatización en Spreadsheets/Excel, "
            "ordenamiento de Bases de Datos,lógica en Python, configuración de Host y plataformas de Mailing "
            "(Zenvia, Mailerlite, Mailrelay)."
        )
        prompt_espiritu = (
            f"IMPORTANTE: RESPONDE SIEMPRE EN ESPAÑOL.\n"
            f"Actúa como un Analista de Sistemas experto y consultor tecnológico.\n\n"
            f"SOLICITUD DEL CLIENTE: {texto_cliente}\n\n"
            f"GENERA UN RESUMEN PROFESIONAL CON ESTA ESTRUCTURA:\n\n"
            f"1. Tipo de proyecto: [Define en 10 palabras: web, automatización, integración, datos, etc.]\n\n"
            f"2. Resumen técnico sencillo: [Explica qué entendiste y cómo lo resolverías. Usa lenguaje claro pero técnico. Menciona 1-2 beneficios clave para el cliente. Máximo 4 líneas.]\n\n"
            f"3. Próximos pasos: [Nuestro equipo analizará en detalle su caso y le enviaremos una propuesta personalizada por correo en 24-48 horas.]\n\n"
            f"REGLAS:\n"
            f"- Tono: Profesional, cálido y entusiasta (como un experto que ama lo que hace)\n"
            f"- Longitud: Máximo 9 líneas en total\n"
            f"- Idioma: Español exclusivamente\n"
            f"- Beneficio: Siempre incluir cómo tu solución ayudará al negocio del cliente\n"
            f"- Empatía: Demuestra que entiendes su necesidad específica\n\n"
            f"EJEMPLO DE RESPUESTA:\n"
            f"1. Tipo de proyecto: Desarrollo de página web con galería de fotos.\n"
            f"2. Resumen técnico: Entendemos que necesitas mostrar tus productos artesanales. Crearemos una web responsive con galería interactiva y carga optimizada, para que tus clientes vean las fotos rápido desde cualquier dispositivo.\n"
            f"3. Próximos pasos: Analizaremos tu caso a fondo y te enviaremos una propuesta con diseño, funcionalidades y presupuesto en máximo 48 horas."
        )

        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "qwen2.5:3b",
                    "prompt": prompt_espiritu,
                    "stream": False,
                    "options": {"temperature": 0.7},  # Toque humano
                },
                timeout=500,
            )
            if response.status_code == 200:
                resumen_ia = response.json().get(
                    "response", "El modelo IA no generó el resumen"
                )
                print(f"✅ IA respondió: {resumen_ia[:30]}...")
            else:
                print(f"⚠️ Ollama error {response.status_code}")
                resumen_ia = "Resumen temporalmente no disponible"
        except requests.exceptions.Timeout:
            print("⚠️ La IA tardó demasiado tiempo (Timeout)")
            resumen_ia = "La IA está procesando una solicitud larga..."
        except Exception as e:
            print(f"⚠️ Error de conexión con Ollama: {e}")

        # --- PASO 3: REGISTRO FINAL EN CSV LOCAL ---
        with open(archivo_csv, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(
                [fecha_actual, nombre, telefono, correo, texto_cliente, resumen_ia]
            )

        # --- PASO 4: NOTIFICAR A TELEGRAM ---
        msg = (
            f"🚀 *Nueva Solicitud*\n\n"
            f"*Cliente:* {nombre}\n\n"
            f"*Texto Original:* {texto_cliente}\n\n"
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

        # --- PASO 5: ENVIAR A GOOGLE SHEETS ---
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "correo": correo,
            "solicitud": texto_cliente,  # Enviamos el texto largo aquí
            "resumen": resumen_ia,  # Enviamos el resumen aquí
        }

        try:
            resp = requests.post(GOOGLE_SHEETS_URL, json=payload, timeout=30)
            print(f"🚩 Respuesta Google Sheets: {resp.status_code}")
        except Exception as e:
            print(f"⚠️ Google Sheets falló: {e}")

    except Exception as e:
        print(f"❌ ERROR CRÍTICO EN EL PROCESO: {str(e)}")


@app.route("/secretario/guardar", methods=["POST"])
def guardar_solicitud():
    # Esto permite recibir datos tanto de formularios web como de JSON
    datos = request.form.to_dict() if request.form else request.get_json()

    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    hilo = threading.Thread(target=tarea_fondo_ia, args=(datos,))
    hilo.start()

    # Redirigir a una página de "Gracias" o simplemente avisar éxito
    return redirect('/gracias.html')


if __name__ == "__main__":
    # Importante: host 0.0.0.0 para que Nginx lo vea
    app.run(host="0.0.0.0", port=5000, debug=False)
