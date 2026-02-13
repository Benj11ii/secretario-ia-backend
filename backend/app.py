import threading
import requests
import csv
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
load_dotenv()

@app.route('/')
def index():
    return app.send_static_file('index.html')

# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
GOOGLE_SHEETS_URL = os.getenv("GOOGLE_SHEETS_URL")

def tarea_fondo_ia(datos):
    # 1. Recolección de datos (mapeo de nombres)
    nombre = datos.get('nombre', 'Sin nombre')
    telefono = datos.get('telefono', 'Sin tel')
    correo = datos.get('correo', 'Sin correo')
    # Capturamos como se llame en el HTML y lo guardamos en una variable interna
    texto_cliente = datos.get('texto_original') or datos.get('solicitud') or "Sin mensaje"
    
    archivo_csv = "/home/bcarmona/secretario-ia-backend/backend/Solicitudes.csv"
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        # --- PASO 1: RESPALDO INICIAL EN CSV ---
        with open(archivo_csv, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([fecha_actual, nombre, telefono, correo, texto_cliente, "PROCESANDO..."])

        # --- PASO 2: LÓGICA DE IA (Ollama con Qwen) ---
        print(f"🤖 Procesando con Qwen2.5 para: {nombre}")
        resumen_ia = "Procesando..." # Valor por defecto
        servicios_permitidos = (
            "Maquetación HTML, Google Apps Script (GAS), automatización en Spreadsheets/Excel, "
            "ordenamiento de Bases de Datos,lógica en Python, configuración de Host y plataformas de Mailing "
            "(Zenvia, Mailerlite, Mailrelay)."
        )
        prompt_espiritu = (
            f"IMPORTANTE: RESPONDE SIEMPRE EN ESPAÑOL.\n"
            f"Actúa como un Analista de Sistemas experto y consultor tecnológico.\n"
            f"El cliente envió esta solicitud: '{texto_cliente}'.\n\n"
            f"TU TAREA es entregar una resumen sobre lo que pide cliente, siendo flexible con el siguiente esquema sugerido :\n"
            f"1. Usted quiere: Debes definir brevemente el tipo de proyecto (ej: 'Un Desarrollo de interfaz web', 'Una Automatización de procesos', 'Una Integración de sistemas').\n"
            f"2. Resumen técnico sencillo: Resume lo que comprendes de su idea, detalla técnicamente aspectos que empaticen y atraigan al cliente, por ejemplo comentar sobre como el problema se puede solucionar el cliente iente o como el sistema que se lograría optimizar, empatiza con cliente al abordar su solicitud.\n"
            f"3. Cierre de Factibilidad: Explica que nuestro equipo realizará un análisis a profundidad y le enviará un plan con una propuesta a su correo.\n\n"
            f"REGLAS:\n"
            f"- Tono: Serio, amable y profesional.\n"
            f"- Máximo 9 líneas. Sé directo y evita siempre el portugués."
        )
 
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "qwen2.5:3b",
                    "prompt": prompt_espiritu,
                    "stream": False,
                    "options": {
                      "temperature": 0.7 #Toque humano
                    }
                },
                timeout=500
            )
            if response.status_code == 200:
                resumen_ia = response.json().get('response','El modelo IA no generó el resumen')
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
        with open(archivo_csv, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([fecha_actual, nombre, telefono, correo, texto_cliente, resumen_ia])

        # --- PASO 4: NOTIFICAR A TELEGRAM ---
        msg = (f"🚀 *Nueva Solicitud*\n\n"
               f"*Cliente:* {nombre}\n\n"
               f"*Texto Original:* {texto_cliente}\n\n"
               f"*Resumen IA:* {resumen_ia}")
        
        try:
            requests.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage", 
                          json={"chat_id": CHAT_ID, "text": msg, "parse_mode": "Markdown"}, 
                          timeout=10)
            print("✅ Telegram enviado")
        except Exception as e:
            print(f"⚠️ Telegram falló: {e}")

        # --- PASO 5: ENVIAR A GOOGLE SHEETS ---
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "correo": correo,
            "solicitud": texto_cliente,  # Enviamos el texto largo aquí
            "resumen": resumen_ia       # Enviamos el resumen aquí
        }
        
        try:
            resp = requests.post(GOOGLE_SHEETS_URL, json=payload, timeout=30)
            print(f"🚩 Respuesta Google Sheets: {resp.status_code}")
        except Exception as e:
            print(f"⚠️ Google Sheets falló: {e}")

    except Exception as e:
        print(f"❌ ERROR CRÍTICO EN EL PROCESO: {str(e)}")

@app.route('/secretario/guardar', methods=['POST'])
def guardar_solicitud():
    datos = request.get_json()
    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    # Iniciamos el proceso pesado en segundo plano
    hilo = threading.Thread(target=tarea_fondo_ia, args=(datos,))
    hilo.start()

    return jsonify({"status": "ok", "message": "Datos recibidos correctamente"}), 200

if __name__ == '__main__':
    # Importante: host 0.0.0.0 para que Nginx lo vea
    app.run(host='0.0.0.0', port=5000, debug=False)

