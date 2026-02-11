
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import csv
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = "TELEGRAMTOKEN"
TELEGRAM_CHAT_ID = "CHATID"
CSV_FILE = "/home/bcarmona/solicitudes.csv"
# URL de Google Sheets
GOOGLE_URL = "URLGOOGLE"

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": mensaje}
    try:
        # Guardamos la respuesta en una variable 'r'
        r = requests.post(url, json=payload)
        # Imprimimos lo que dijo Telegram (Sea bueno o malo)
        print(f"TELEGRAM DICE: {r.status_code} - {r.text}")
    except Exception as e:
        print(f"Error CONEXION Telegram: {e}")

@app.route('/guardar', methods=['POST'])
def guardar():
    # 1. Intentar capturar datos incluso si la conexión se corta
    try:
        data = request.get_json(force=True) or {}
    except Exception as e:
        print(f"Error recibiendo JSON (posible cierre de navegador): {e}")
        data = {}

    ahora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    nombre = data.get('nombre', 'Usuario desconectado')
    telefono = data.get('telefono', 'N/A')
    correo = data.get('correo', 'N/A')
    resumen = data.get('resumen', 'Sin resumen (navegador cerrado)')
    texto_original = data.get('texto_original', 'N/A')

    # 2. ESCRIBIR EN CSV (Prioridad: local, no depende de internet)
    try:
        with open('/home/bcarmona/solicitudes.csv', mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([ahora, nombre, telefono, correo, resumen, texto_original])
        print("✅ CSV guardado")
    except Exception as e:
        print(f"❌ Error CSV: {e}")

    # 3. ENVIAR A TELEGRAM (Con try-except por si falla la red)
    try:
        mensaje_bot = (
            f"🔔 NUEVA SOLICITUD\n"
            f"👤 Nombre: {nombre}\n"
            f"📞 Tel: {telefono}\n"
            f"📧 Email: {correo}\n"
            f"🤖 Resumen IA: {resumen}\n"
            f"📝 Original: {texto_original}"
        )
        enviar_telegram(mensaje_bot)

    except Exception as e:
        print(f"⚠️ Telegram no pudo enviarse: {e}")

    # 4. ENVIAR A GOOGLE SHEETS (Con TIMEOUT de 5 segundos)
    # Esto evita que Flask se quede "colgado" si Google no responde rápido
    try:
        requests.post(GOOGLE_URL, json=data, timeout=5)
        print("📊 Datos enviados a Google")
    except requests.exceptions.Timeout:
        print("❌ Google Sheets dio Timeout (Red lenta), pero el proceso sigue.")
    except Exception as e:
        print(f"❌ Error Google Sheets: {e}")

    # 5. Responder al cliente (aunque ya se haya ido, Flask termina el ciclo)
    return jsonify({"status": "received"}), 200

#if __name__ == '__main__':
app.run(host='0.0.0.0', port=5000)

