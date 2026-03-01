import socket
import threading
import requests
import csv
import os
import time
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS
from datetime import datetime
import logging
import sys

# Configurar logging a archivo
logging.basicConfig(
    filename="/home/bcarmona/secretario-ia-backend/backend/debug.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


# Redirigir prints a logging
def print_to_log(*args, **kwargs):
    logging.info(" ".join(map(str, args)))


# Reemplazar print con nuestra función
print = print_to_log

app = Flask(__name__, static_folder="public/assets", template_folder="public")
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
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


@app.route("/demos.html")
def demos():
    return render_template("demos.html")

# Esta ruta capturará lo que intentas en la captura (demo-tienda.html)
@app.route("/demo-tienda.html")
def demo_legacy():
    tipo = request.args.get('tipo', 'sushi')
    if tipo == 'sushi':
        return render_template("demo-tiendas1.html")
    elif tipo == 'ferreteria':
        return render_template("demo-tiendas2.html")
    elif tipo == 'turismo' or tipo == 'pasteleria':
        return render_template("demo-tiendas3.html")
    return redirect(url_for('demos'))

# --- PUENTE PARA EL CHAT CON LA MAC ---
@app.route("/chat", methods=["POST"])
def chat_proxy():
    try:
        # 1. Recibimos la pregunta que viene de la web
        datos_usuario = request.json
        
        # 2. La enviamos a la Mac a través del túnel
        # Usamos /api/chat porque es la ruta que pusimos en el script de la Mac
        url_mac = "https://ia.iasesoria.cl/api/chat"
        
        print(f"🌉 Reenviando pregunta a la Mac: {url_mac}")
        
        # Hacemos la petición a la Mac
        respuesta_mac = requests.post(url_mac, json=datos_usuario, timeout=40)
        
        # 3. Devolvemos la respuesta de la Mac a la web
        return jsonify(respuesta_mac.json())

    except Exception as e:
        print(f"❌ Error en el puente de chat: {e}")
        return jsonify({
            "success": False, 
            "response": "El servicio de IA en la Mac no respondió a tiempo."
        }), 502

# Opcional: Ruta para que el diagnóstico del Celeron también salga en verde
@app.route("/api/chat", methods=["GET"])
def health_chat():
    return jsonify({"status": "proxy_active"})

# Rutas modernas y limpias (Recomendado)
@app.route("/sushi")
def sushi():
    return render_template("demo-tiendas1.html")

@app.route("/ferreteria")
def ferreteria():
    return render_template("demo-tiendas2.html")

@app.route("/turismo")
def turismo():
    return render_template("demo-tiendas3.html")


# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
GOOGLE_SHEETS_URL = os.getenv("GOOGLE_SHEETS_URL")

# --- CONFIGURACIÓN DEL WORKER EN MAC ---
# --- CONFIGURACIÓN DEL WORKER EN MAC ---
MAC_WORKER_URL = "https://192.168.1.100:5001"
TIMEOUT_WORKER = 180  # 3 minutos máximo esperando a la Mac


def mac_esta_viva(host="192.168.1.100", port=5001, timeout=2):
    """
    Verifica si la Mac está viva intentando una conexión HTTPS.
    Timeout de 2 segundos. Sin verificación de certificado (seguro en red local).
    """
    try:
        print(f"🔍 Verificando Mac en https://{host}:{port}/health...")
        response = requests.get(
            f"https://{host}:{port}/health",
            timeout=timeout,
            verify=False  # ← Seguro en red local
        )
        print(f"✅ Mac responde con código {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error verificando Mac: {e}")
        return False


def procesar_con_mac(consulta, servicio_interes=""):
    """Intenta procesar la consulta usando el worker de la Mac M1"""
    
    # ⚡ VERIFICACIÓN RÁPIDA: ¿La Mac está viva?
    if not mac_esta_viva():
        print("⏱️ Mac no responde a verificación rápida. Usando fallback inmediato.")
        return None

    try:
        import requests
        import json

        payload = {"consulta": consulta, "servicio_interes": servicio_interes}
        print(f"🔵 Mac viva, enviando solicitud (timeout 180s)...")

        # --- PETICIÓN SIN VERIFICAR CERTIFICADO (seguro en red local) ---
        response = requests.post(
            f"{MAC_WORKER_URL}/procesar_completo",
            json=payload,
            timeout=TIMEOUT_WORKER,
            verify=False  # ← Seguro en red local
        )

        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print(f"✅ Mac respondió en {result.get('tiempo_segundos', '?')}s")
                return result
            else:
                raise Exception(f"Worker devolvió error: {result.get('error')}")
        else:
            raise Exception(f"Worker respondió con código {response.status_code}")

    except requests.exceptions.Timeout:
        print("⏱️ Timeout esperando a Mac (3 minutos) - la Mac está viva pero lenta")
        return None
    except Exception as e:
        print(f"⚠️ Error conectando con Mac: {e}")
        return None
    
def tarea_fondo_ia(datos):
    logging.info(f"🔵 INICIO tarea_fondo_ia para {datos.get('nombre')}")
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
    hora_inicio = datetime.now()
    inicio_timestamp = hora_inicio.strftime("%Y-%m-%d %H:%M:%S")

    try:
        # --- PASO 1: LÓGICA DE IA ---
        print("🔵 Llamando a clasificador ético...")

        # ============================================
        # INTENTAR CON LA MAC PRIMERO
        # ============================================
        resultado_mac = procesar_con_mac(texto_cliente, servicio_interes)

        if resultado_mac and resultado_mac.get("success"):
            # ✅ LA MAC RESPONDIÓ - Usamos sus resultados
            print("✅ Mac M1 procesó la solicitud exitosamente")
            decision = resultado_mac.get("decision", "APROBAR")
            estado = resultado_mac.get("estado", "APROBADO")
            resumen_ia = resultado_mac.get("resumen", "")
            print(f"📊 Decisión Mac: {decision}")
            print(f"⏱️ Tiempo Mac: {resultado_mac.get('tiempo_segundos', '?')}s")

        else:
            # ⚠️ LA MAC NO RESPONDIÓ - Fallback a Gemma local
            print("⚠️ Mac no disponible, usando Gemma local...")

            # --- CLASIFICADOR ÉTICO LOCAL (código original) ---
            print("🔵 Llamando a clasificador ético local...")
            print(
                f"🤖 Procesando con Qwen 3 para: {nombre} - Interés: {servicio_interes}"
            )

            clasificador_etico = (
                "Eres un asistente ético. Responde SOLO con APROBAR o RECHAZAR.\n\n"
                "RECHAZAR EXPLÍCITAMENTE SOLO SI LA SOLICITUD:\n"
                "1️⃣ Pide acceder a datos de terceros SIN su consentimiento (hackear, espiar, robar)\n"
                "2️⃣ Propone actividades ilegales (fraude, evasión de impuestos)\n"
                "3️⃣ Busca dañar a terceros intencionalmente\n"
                "4️⃣ Viola la privacidad de personas SIN su consentimiento explícito\n\n"
                "APROBAR SIEMPRE EN ESTOS CASOS (aunque haya dudas):\n"
                "✅ Automatización de procesos internos del negocio\n"
                "✅ Gestión de clientes propios (citas, recordatorios, seguimiento)\n"
                "✅ Organización de datos de la propia empresa\n"
                "✅ Mejora de eficiencia operativa\n"
                "✅ Cualquier proyecto legítimo de negocio\n\n"
                "REGLAS DE ORO:\n"
                "- Si la solicitud es sobre el NEGOCIO DEL CLIENTE (sus clientes, sus citas, sus datos) → APROBAR\n"
                "- Si menciona 'competencia' o 'datos de otros' → RECHAZAR\n"
                "- Si hay DUDA, APROBAR (mejor falso positivo que falso negativo)\n\n"
                f"Solicitud: {texto_cliente}\n\n"
                "Respuesta (solo APROBAR o RECHAZAR):"
            )

            decision = "APROBAR"  # fallback seguro

            try:
                response = requests.post(
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "qwen3:4b-instruct",  # modelo rápido para clasificación local
                        "prompt": clasificador_etico,
                        "stream": False,
                        "options": {"temperature": 0.0},
                    },
                    timeout=300,
                )
                if response.status_code == 200:
                    decision_raw = response.json().get("response", "").upper()
                    decision = "RECHAZAR" if "RECHAZAR" in decision_raw else "APROBAR"
                    print(
                        f"🔍 Decisión IA local (raw: '{decision_raw}' -> procesada: '{decision}')"
                    )
            except Exception as e:
                print(f"⚠️ Error clasificador ético local: {e}")

            # Estado para GAS/CSV
            estado = "RECHAZADO" if decision == "RECHAZAR" else "APROBADO"

            # --- GENERAR RESUMEN LOCAL (solo si APROBADO) ---
            if decision == "RECHAZAR":
                print("🔵 Caso RECHAZADO (local), generando resumen...")
                resumen_ia = "Solicitud rechazada por criterios éticos."
                print(f"⚠️ Solicitud rechazada por criterios éticos (estado: {estado})")
            else:
                print("🔵 Caso APROBADO (local), generando resumen técnico...")
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
                            "model": "qwen3:4b-instruct",  # Modelo para resumen local
                            "prompt": prompt_espiritu,
                            "stream": False,
                            "options": {"temperature": 0.7},
                        },
                        timeout=990,
                    )
                    if response.status_code == 200:
                        resumen_ia = response.json().get(
                            "response", "El modelo IA no generó el resumen"
                        )
                        print(f"✅ IA local respondió: {resumen_ia[:50]}...")
                    else:
                        print(f"⚠️ Ollama error {response.status_code}")
                except Exception as e:
                    print(f"⚠️ Error con Ollama local: {e}")

        # ============================================
        # A PARTIR DE AQUÍ EL CÓDIGO SIGUE IGUAL
        # ============================================

        # --- PASO 2: GUARDAR EN CSV (CON ESTADO INCLUIDO) ---
        # ⏱️ Calcular duración total
        print("🔵 Guardando tiempo total en CSV...")
        hora_fin = datetime.now()
        duracion_segundos = (hora_fin - hora_inicio).total_seconds()
        procesado_por = (
            "Mac" if resultado_mac and resultado_mac.get("success") else "Celeron"
        )
        print("🔵 Guardando en CSV...")
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
                        "Inicio_timestamp",
                        "Duracion_segundos",
                        "procesado_por",
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
                    estado,
                    inicio_timestamp,  # ✅ String, no objeto datetime
                    duracion_segundos,
                    procesado_por,
                ]
            )

        print(f"✅ Datos guardados en CSV para {nombre} (Estado: {estado})")

        # --- PASO 3: NOTIFICAR A TELEGRAM ---
        print("🔵 Enviando a Telegram...")
        # Emoji diferente según el estado
        emoji = "✅" if estado == "APROBADO" else "⛔"
        servicio_mostrar = (
            servicio_interes
            if servicio_interes and servicio_interes != ""
            else "No especificado"
        )
        msg = (
            f"{emoji} *Nueva Solicitud - {estado}*\n\n"
            f"*Cliente:* {nombre}\n"
            f"*Teléfono:* {telefono}\n"
            f"*Email:* {correo}\n"
            f"*Servicio de interés:* {servicio_mostrar}\n"
            f"*Estado:* {estado}\n\n"
            f"*Procesado por:* {procesado_por}\n"
            f"*Duración:* {duracion_segundos:.1f}s\n\n"
            f"*Solicitud:* {texto_cliente}\n\n"
            f"*Resumen IA:* {resumen_ia}\n\n"
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
        print("🔵 Enviando a Google Sheets...")
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "correo": correo,
            "servicio_interes": servicio_interes,
            "solicitud": texto_cliente,
            "resumen": resumen_ia,
            "fecha": fecha_actual,
            "estado": estado,
            "inicio_timestamp": inicio_timestamp,  # ✅ Debe estar
            "duracion_segundos": duracion_segundos,  # ✅ Debe estar
            "procesado_por": procesado_por,  # ✅ Debe estar
        }

        try:
            resp = requests.post(GOOGLE_SHEETS_URL, json=payload, timeout=580)
            print(f"📊 Google Sheets respuesta: {resp.status_code}")
        except Exception as e:
            print(f"⚠️ Google Sheets falló: {e}")

    except Exception as e:
        print(f"❌ ERROR CRÍTICO: {str(e)}")


@app.before_request
def debug():
    print(request.method, request.path)


@app.route("/secretario/guardar", methods=["POST"])
def guardar_solicitud():
    datos = {}
    if request.is_json:
        datos = request.get_json(silent=True) or {}
    else:
        datos = request.form.to_dict()
    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    # Iniciar proceso en segundo plano
    hilo = threading.Thread(target=tarea_fondo_ia, args=(datos,))
    hilo.start()

    return redirect("/gracias")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
