from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import urllib.parse

app = Flask(__name__)

# Mantenemos los mismos orígenes que su chat para evitar problemas de CORS
CORS(app, resources={r"/*": {"origins": [
    "https://www.iasesoria.cl", 
    "http://localhost:5010", 
    "http://127.0.0.1:5010",
    "http://localhost:5500" # Importante para sus pruebas con LiveServer
]}})

# Configuración de Logs igual a su chat
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

LOG_FILE = "leads_demos.txt"

@app.route("/api/v1/tienda-contacto", methods=["POST"])
def registrar_interes():
    try:
        data = request.json
        producto = data.get("producto", "Sin producto")
        telefono = data.get("telefono", "Sin teléfono")
        tipo_demo = data.get("tipo_demo", "Tienda General")
        
        logging.info(f"🛒 Pedido recibido: {producto} | Tel: {telefono}")

        # Guardar en archivo local del Celeron
        fecha_hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        registro = f"[{fecha_hora}] | Demo: {tipo_demo} | Prod: {producto} | Tel: {telefono}\n"
        
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(registro)

        # Generar el mensaje para WhatsApp
        mensaje_texto = f"Hola IAsesoria, estoy interesado en '{producto}' de la demo de {tipo_demo}. Mi contacto es {telefono}."
        whatsapp_url = f"https://wa.me/56926870966?text={urllib.parse.quote(mensaje_texto)}"
        
        return jsonify({
            "success": True,
            "whatsapp_url": whatsapp_url,
            "message": "Lead registrado correctamente"
        })

    except Exception as e:
        logging.exception("❌ Error en servicio de tienda")
        return jsonify({"success": False, "response": "Error interno al procesar pedido."}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "online", "service": "tiendas_ia"})

if __name__ == "__main__":
    print("-" * 30)
    print("🚀 SERVIDOR TIENDAS IA ACTIVO")
    print(f"📍 Escuchando en http://0.0.0.0:5010")
    print(f"📄 Archivo de leads: {LOG_FILE}")
    print("-" * 30)
    # Al igual que su chat, activamos debug=True para desarrollo
    app.run(host="0.0.0.0", port=5010, debug=True)