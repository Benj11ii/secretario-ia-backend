from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Nombre del archivo donde se guardarán los leads
LOG_FILE = "leads_demos.txt"

@app.route("/api/v1/tienda-contacto", methods=["POST"])
def registrar_interes():
    try:
        data = request.json
        producto = data.get("producto")
        telefono = data.get("telefono")
        tipo_demo = data.get("tipo_demo", "Desconocido")
        
        # Obtenemos la hora actual
        fecha_hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Registramos en la consola del Celeron
        logging.info(f"📈 LEAD DETECTADO - {tipo_demo} | Producto: {producto} | Tel: {telefono}")

        # --- AQUÍ GUARDAMOS EL TEXTO ---
        # Formato: [Fecha] | Demo: X | Prod: Y | Tel: Z
        linea_registro = f"[{fecha_hora}] | Demo: {tipo_demo} | Prod: {producto} | Tel: {telefono}\n"
        
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(linea_registro)
        # -------------------------------

        # Preparamos el mensaje para WhatsApp
        mensaje_final = f"Hola IAsesoria, estoy en la demo de {tipo_demo}. Me interesa el producto '{producto}' y mi número es {telefono}."
        
        return jsonify({
            "success": True, 
            "whatsapp_url": f"https://wa.me/56926870966?text={encode_url(mensaje_final)}"
        })

    except Exception as e:
        logging.error(f"❌ Error en demo tienda: {str(e)}")
        return jsonify({"success": False, "error": "Error al procesar solicitud"}), 500

# Función auxiliar para codificar caracteres especiales en la URL
def encode_url(text):
    import urllib.parse
    return urllib.parse.quote(text)

if __name__ == "__main__":
    print("🚀 Servicio de Demos Tiendas (Celeron) activo en puerto 5010")
    app.run(host="0.0.0.0", port=5005)