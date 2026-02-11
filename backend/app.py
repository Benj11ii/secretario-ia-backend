import threading
import requests
import csv
import os
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# --- CONFIGURACIÓN (Reemplaza con tus datos reales) ---
TELEGRAM_TOKEN = "7832767566:AAEa3mbtsP_0HmY-Z37Dyc8VneMHEUHpDmw"
CHAT_ID = "8538712379"
# Esta es la URL de tu Google Apps Script que enviará el correo
GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzY7NXEc-XcaOzgoBDGyLAQdKYb6lUX-iIrFDZqiXC2dFdvqUNlsgcaC6Namu5pXdX8gg/exec" 

def tarea_fondo_ia(datos):
    """
    TRABAJADOR DE FONDO:
    Aquí el Celeron N95 hace el trabajo pesado sin bloquear al cliente.
    """
    try:
        nombre = datos.get('nombre')
        telefono = datos.get('telefono')
        correo = datos.get('correo')
        texto_original = datos.get('texto_original')

        # 1. LLAMADA A OLLAMA (IA Local)
        # Usamos un timeout largo porque Ollama puede tardar en el Celeron
        print(f"🤖 Procesando IA para {nombre}...")
        response_ia = requests.post('http://127.0.0.1:11434/api/generate', 
            json={
                "model": "llama3", 
                "prompt": f"Analiza esta solicitud de asesoría y genera un resumen técnico de viabilidad: {texto_original}",
                "stream": False
            }, timeout=300)
        
        resumen = response_ia.json().get('response', 'Resumen no disponible')

        # 2. GUARDAR EN CSV (Tu base de datos local)
        archivo_csv = '/home/bcarmona/backend/Solicitudes.csv'
        fila = [datetime.now().strftime("%Y-%m-%d %H:%M:%S"), nombre, telefono, correo, resumen]
        
        # Nos aseguramos de que el directorio exista
        os.makedirs(os.path.dirname(archivo_csv), exist_ok=True)
        
        with open(archivo_csv, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(fila)

        # 3. NOTIFICAR A TELEGRAM
        msg = f"🚀 *Nueva Solicitud V2*\n\n*Cliente:* {nombre}\n*Email:* {correo}\n*Resumen IA:* {resumen}"
        requests.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage", 
                      json={"chat_id": CHAT_ID, "text": msg, "parse_mode": "Markdown"})

        # 4. ENVIAR A GOOGLE SHEETS / APPS SCRIPT
        # Esto disparará el correo automático desde Google
        requests.post(GOOGLE_SHEETS_URL, json={
            "nombre": nombre,
            "correo": correo,
            "resumen": resumen,
            "telefono": telefono
        })

        print(f"✅ Todo listo. Cliente {nombre} procesado.")

    except Exception as e:
        print(f"❌ Error en el hilo de fondo: {e}")

@app.route('/secretario/guardar', methods=['POST'])
def guardar_solicitud():
    datos = request.json
    
    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    # LANZAR EL HILO (Threading)
    # Aquí está el secreto: el programa sigue sin esperar a la IA
    hilo = threading.Thread(target=tarea_fondo_ia, args=(datos,))
    hilo.start()

    # RESPUESTA INMEDIATA AL CELULAR
    return jsonify({
        "status": "ok",
        "message": "Solicitud recibida. Recibirás un correo en 15 min."
    }), 200

if __name__ == '__main__':
    # Mantenemos el puerto 5000 para tu Nginx
    app.run(host='0.0.0.0', port=5000)