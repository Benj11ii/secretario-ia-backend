# chat_demo_ollama.py - Chat con IA usando Qwen (Ollama) para IAsesoria
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

app = Flask(__name__)
# Se recomienda en producción: CORS(app, origins=["https://www.iasesoria.cl"])
CORS(app)

# Configuración de Ollama
OLLAMA_URL = "http://localhost:11434/api/generate"
MODELO = "qwen2.5:0.5b"  # Su modelo Qwen configurado
FORMULARIO_URL = "https://www.iasesoria.cl/#five"

# Configuración de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# ============================================
# PROMPT SISTEMA - CORREGIDO
# ============================================
PROMPT_SISTEMA = """Eres un asistente de IAsesoria. REGLAS ESTRICTAS:
1. RESPUESTAS MÁXIMO 5 PALABRAS.
2. Solo habla de: servicios (automatización, chatbots, ordenar datos)y precios (desde $30.000).
3. Si la pregunta no es sobre estos temas o es compleja: "Usa el formulario: {formulario_url}"

Ejemplos de respuesta corta:
Q: ¿Horario? → A: "Lunes a viernes 9-18 hrs"
Q: ¿Precios? → A: "Desde $50.000 mensuales"
Q: ¿Servicios? → A: "Automatización, chatbots, datos"
Q: ¿Cómo lo hacen? → A: "Usa el formulario: {formulario_url}"

Historial de conversación:
{historial_texto}

Usuario: {mensaje_usuario}
Asistente:"""


@app.route("/chat", methods=["POST"])
def chat():
    """Endpoint para el chat de la demo usando Qwen"""
    try:
        data = request.json
        mensaje_usuario = data.get("message", "")
        historial = data.get("history", [])

        # Formatear historial para el prompt (últimas 4 para ahorrar contexto en modelos pequeños)
        historial_texto = ""
        for msg in historial[-4:]:
            role = "Usuario" if msg["role"] == "user" else "Asistente"
            historial_texto += f"{role}: {msg['content']}\n"

        # Construcción del prompt con manejo de errores de formato
        try:
            prompt_completo = PROMPT_SISTEMA.format(
                formulario_url=FORMULARIO_URL,
                historial_texto=historial_texto,
                mensaje_usuario=mensaje_usuario,
            )
        except KeyError as e:
            logging.error(f"Error en llaves del prompt: {e}")
            return (
                jsonify(
                    {"success": False, "response": "Error interno de configuración."}
                ),
                500,
            )

        logging.info(f"📨 Usuario: {mensaje_usuario[:50]}")

        # Payload para Ollama
        payload = {
            "model": MODELO,
            "prompt": prompt_completo,
            "stream": False,
            "options": {
                "temperature": 0.0,  # determinista y rápido
                "num_predict": 18,  # suficiente para 5 palabras + URL
                "num_ctx": 256,  # MUY importante para Celeron
                "top_p": 0.9,
                "stop": ["\n", "Usuario:", "Asistente:", "Q:"],
            },
        }

        response = requests.post(OLLAMA_URL, json=payload, timeout=20)

        if response.status_code == 200:
            result = response.json()
            respuesta = result.get("response", "").strip()

            # Limpieza de seguridad por si el modelo repite el prefijo
            if "Asistente:" in respuesta:
                respuesta = respuesta.split("Asistente:")[-1].strip()

            logging.info(f"🤖 Qwen: {respuesta}")

            # Lógica para detectar si se envió al formulario (para la interfaz frontend)
            palabras_clave_redireccion = [
                "formulario",
                "iasesoria.cl",
                "contactar",
                "solicitud",
            ]
            contiene_redireccion = any(
                p in respuesta.lower() for p in palabras_clave_redireccion
            )

            return jsonify(
                {
                    "success": True,
                    "response": respuesta,
                    "show_form_redirect": True  # ← CORREGIDO (con T mayúscula)
                }
            )
        else:
            logging.error(f"Error Ollama: {response.status_code}")
            return (
                jsonify(
                    {
                        "success": False,
                        "response": "Servicio temporalmente fuera de línea. Por favor, use nuestro formulario.",
                    }
                ),
                500,
            )

    except requests.exceptions.Timeout:
        logging.error("Timeout al conectar con Ollama")
        return (
            jsonify(
                {
                    "success": False,
                    "response": "La IA está tardando en responder. Intente de nuevo.",
                }
            ),
            504,
        )

    except Exception as e:
        logging.exception("❌ Error crítico en el servidor")
        return (
            jsonify(
                {"success": False, "response": "Error interno. Contacte a soporte."}
            ),
            500,
        )


@app.route("/health", methods=["GET"])
def health():
    """Verificación de estado del servicio"""
    try:
        ollama_test = requests.get(
            f"{OLLAMA_URL.replace('/generate', '/tags')}", timeout=5
        )
        return jsonify(
            {
                "status": "online",
                "ollama_connected": ollama_test.status_code == 200,
                "model": MODELO,
            }
        )
    except:
        return jsonify({"status": "error", "ollama_connected": False}), 500


if __name__ == "__main__":
    print("-" * 30)
    print("🚀 SERVIDOR IASESORIA ACTIVO")
    print(f"📍 Escuchando en http://0.0.0.0:5003")
    print(f"🤖 Modelo: {MODELO}")
    print(f"🔗 Endpoint chat: http://0.0.0.0:5003/chat")
    print(f"🔗 Health check: http://0.0.0.0:5003/health")
    print("-" * 30)
    app.run(host="0.0.0.0", port=5003, debug=True)
