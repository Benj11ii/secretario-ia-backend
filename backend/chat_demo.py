from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://www.iasesoria.cl", "http://localhost:5003", "http://127.0.0.1:5003"]}})

MAC_URL = "http://192.168.1.100:5004"
FORMULARIO_URL = "https://www.iasesoria.cl/#five"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def mac_disponible():
    try:
        r = requests.get(f"{MAC_URL}/health", timeout=2)
        return r.status_code == 200
    except:
        return False

@app.route("/chat", methods=["POST"])
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        mensaje_usuario = data.get("message", "")
        historial = data.get("history", [])
        numero_consulta = data.get("consulta_num", 1)

        logging.info(f"📨 Usuario: {mensaje_usuario[:50]}")

        if mac_disponible():
            logging.info("🍎 Usando Mac")
            response = requests.post(f"{MAC_URL}/chat", json={
                "message": mensaje_usuario,
                "history": historial,
                "consulta_num": numero_consulta
            }, timeout=30)
            return jsonify(response.json())
        else:
            logging.warning("⚠️ Mac no disponible")
            return jsonify({
                "success": True,
                "response": f"Nuestros servidores están en mantenimiento. Por favor usa nuestro formulario: {FORMULARIO_URL}",
                "show_form_redirect": True
            })

    except Exception as e:
        logging.exception("❌ Error")
        return jsonify({"success": False, "response": "Error interno."}), 500

@app.route("/health", methods=["GET"])
def health():
    mac = mac_disponible()
    return jsonify({"status": "online", "mac_disponible": mac})

if __name__ == "__main__":
    print("-" * 30)
    print("🚀 SERVIDOR IASESORIA ACTIVO")
    print(f"📍 Escuchando en http://0.0.0.0:5003")
    print(f"🍎 Mac: {MAC_URL}")
    print("-" * 30)
    app.run(host="0.0.0.0", port=5003, debug=True)