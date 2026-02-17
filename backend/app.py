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
        print(
            f"🤖 Procesando con Gemma3_4b para: {nombre} - Interés: {servicio_interes}"
        )

        clasificador_etico = (
            "Eres un asistente ético que clasifica solicitudes de clientes.\n\n"
            "Debes responder ÚNICAMENTE con una palabra: APROBAR o RECHAZAR.\n\n"
            "RECHAZAR solo si la solicitud EXPLÍCITAMENTE pide:\n"
            "- Actividades ilegales (hackear, interceptar comunicaciones, robar datos)\n"
            "- Fraude o evasión de impuestos\n"
            "- Dañar a terceros intencionalmente\n"
            "- Violar privacidad de personas sin su consentimiento\n\n"
            "APROBAR en todos los demás casos, incluyendo:\n"
            "- Automatización de marketing (mensajes, emails, recordatorios)\n"
            "- Gestión de clientes y ventas\n"
            "- Organización de datos y reportes\n"
            "- Cualquier proyecto legítimo de negocio\n\n"
            f"Solicitud: {texto_cliente}\n\n"
            "Respuesta (solo APROBAR o RECHAZAR):"
        )

        decision = "APROBAR"  # fallback seguro

        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "gemma3:4b",
                    "prompt": clasificador_etico,
                    "stream": False,
                    "options": {"temperature": 0.0},
                },
                timeout=300,
            )
            if response.status_code == 200:
                # Tu sugerencia: más robusto para detectar RECHAZAR
                decision_raw = response.json().get("response", "").upper()
                decision = "RECHAZAR" if "RECHAZAR" in decision_raw else "APROBAR"
                print(
                    f"🔍 Decisión IA (raw: '{decision_raw}' -> procesada: '{decision}')"
                )
        except Exception as e:
            print(f"⚠️ Error clasificador ético: {e}")

        # Estado para GAS/CSV (tu sugerencia)
        estado = "RECHAZADO" if decision == "RECHAZAR" else "APROBADO"

        # Evaluar la decisión
        if decision == "RECHAZAR":
            resumen_ia = "Solicitud rechazada por criterios éticos."
            print(f"⚠️ Solicitud rechazada por criterios éticos (estado: {estado})")
        else:
            servicios_oferta = (
                f"Nuestros servicios principales son:\n"
                f"- Automatización Administrativa (formularios inteligentes, correos automáticos, integración con Telegram/CRM)\n"
                f"- Gestión de Datos (organización masiva, limpieza de bases de datos, dashboards simples)\n"
                f"- Consultoría Estratégica (optimización de procesos, asesoría digital, soporte por horas)\n"
            )

            prompt_espiritu = (
                "Eres Analista de Sistemas de IAsesoría. Responde en español profesional pero cercano.\n\n"
                f"SERVICIOS DE LA EMPRESA:\n{servicios_oferta}\n\n"
                f"EL CLIENTE SOLICITA: {texto_cliente}\n"
                f"ÁREA DE INTERÉS: {servicio_interes}\n\n"
                "INSTRUCCIONES:\n"
                "Genera una respuesta con ESTA ESTRUCTURA EXACTA (3 puntos numerados):\n\n"
                "1. Entendemos su necesidad: [En 1-2 líneas, parafrasea lo que el cliente quiere lograr, mostrando comprensión]\n\n"
                "2. Propuesta personalizada: [Describe 2-3 ideas concretas de cómo podríamos abordar su proyecto, mencionando tecnologías o enfoques. Usa frases como 'Podríamos implementar...', 'Una opción sería...', 'Podemos explorar...' - sin comprometer que YA se hará]\n\n"
                "3. Beneficios esperados: [Menciona 2 beneficios clave que podría obtener con esta automatización]\n\n"
                "IMPORTANTE: Tu respuesta debe comenzar DIRECTAMENTE con '1. Entendemos su necesidad:' sin ningún texto antes."
            )

            resumen_ia = "Resumen temporalmente no disponible"
            try:
                response = requests.post(
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "gemma3:4b",
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

        # --- PASO 2: GUARDAR EN CSV (CON ESTADO INCLUIDO) ---
        archivo_existe = os.path.exists(archivo_csv)

        with open(archivo_csv, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)

            # Si el archivo no existe, escribir encabezados (ahora con Estado)
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
                        "Estado",  # ✅ NUEVO CAMPO
                    ]
                )

            # Escribir los datos (con estado incluido)
            writer.writerow(
                [
                    fecha_actual,
                    nombre,
                    telefono,
                    correo,
                    servicio_interes,
                    texto_cliente,
                    resumen_ia,
                    estado,  # ✅ VALOR DEL ESTADO
                ]
            )

        print(f"✅ Datos guardados en CSV para {nombre} (Estado: {estado})")

        # --- PASO 3: NOTIFICAR A TELEGRAM ---
        # Emoji diferente según el estado
        emoji = "✅" if estado == "APROBADO" else "⛔"
        msg = (
            f"{emoji} *Nueva Solicitud - {estado}*\n\n"
            f"*Cliente:* {nombre}\n"
            f"*Teléfono:* {telefono}\n"
            f"*Email:* {correo}\n"
            f"*Servicio de interés:* {servicio_interes}\n"
            f"*Estado:* {estado}\n\n"
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

        # --- PASO 4: ENVIAR A GOOGLE SHEETS (CON ESTADO INCLUIDO) ---
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "correo": correo,
            "servicio_interes": servicio_interes,
            "solicitud": texto_cliente,
            "resumen": resumen_ia,
            "fecha": fecha_actual,
            "estado": estado,  # ✅ NUEVO CAMPO PARA GAS
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
