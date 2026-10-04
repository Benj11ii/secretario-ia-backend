# IAsesoria Backend & Lead Engine

> **Motor de Captación, Automatización y Orquestación de Inteligencia Artificial Híbrida** para [iasesoria.cl](https://www.iasesoria.cl).  
> Desarrollado por **Benjamín Alonso Carmona Vega** — Consultor Tecnológico & Desarrollador Full Stack.

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Framework](https://img.shields.io/badge/Framework-Flask_3.1-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![Cloudflare](https://img.shields.io/badge/Security-Cloudflare_Tunnels-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Ollama](https://img.shields.io/badge/AI-Ollama_Local_LLMs-white?style=flat-square&logo=ollama&logoColor=black)](https://ollama.ai)
[![Architecture](https://img.shields.io/badge/Architecture-Edge_to_Local-green?style=flat-square)](#-arquitectura-del-sistema)

---

## 📌 Descripción del Proyecto

**IAsesoria Backend** es una solución de arquitectura híbrida diseñada para resolver la captación, evaluación técnica preliminar automatizada y conversión comercial de clientes para servicios de ingeniería y software en Chile.

El sistema desacopla la navegación del usuario en internet respecto al procesamiento pesado de IA, logrando privacidad total de datos, cero costo de tokens y una experiencia de usuario de estándar profesional.

---

## 🏗 Arquitectura del Sistema

[ Visitante Web / Móvil ]
│ (HTTPS)
▼
[ Cloudflare Zero Trust Tunnel ] <-- Sin puertos expuestos al router
│
▼
[ Servidor Celeron Ubuntu (Edge Host) ]
├── Nginx + Flask (Rutas y Control de Abuso)
├── Filtro de Sanitización (Anti-CSV Injection, Max Content Length: 32 KB)
├── Clasificador Ético Fail-Closed (Anti-Jailbreak con Delimitadores)
└── Proxy Seguro /api/demo-lead
│
├── (LAN Segura / mTLS) ──▶ [ Mac Worker (Apple Silicon) ]
│ └── Ollama (Qwen-Instruct / LLMs Locales)
│
└── (Async Multicanal)
├── Bot de Notificaciones Telegram (Alertas al Consultor)
├── Google Workspace / Sheets (Auditoría y Gestión)
└── Servidor SMTP (Informe Preliminar Automatizado)
code Code

---

## ⚡ Capacidades Principales

### 1. Interfaz Dark Glassmorphism (Mobile-First)
* Landing Page One-Page inspirada en estándares visuales modernos (SaasOne/Linear), con microinteracciones de relieve progresivo, desenfoque de cristal líquido (*liquid glass*) y cero dependencias pesadas.
* Navegación por anclas calibrada con márgenes limpios y menú móvil en píldoras flotantes.

### 2. Embudo Conversacional Acotado (Widget de Asistente)
* Asistente en vivo integrado con límite estricto de **3 turnos de consulta** para evitar saturación de memoria en modelos locales.
* *System Prompt* comercial inyectado en el proxy que orienta al usuario y deriva automáticamente a los canales de contacto ante consultas de tarifas o plazos.
* Bloqueo automático del chat tras la tercera pregunta con botón de acción directa al formulario de diagnóstico.

### 3. Simulador de Checkout Transaccional (3 Ecosistemas)
* Demos funcionales para **Gastronomía (Sakura Sushi)**, **Comercio (Ferretería Industrial)** y **Turismo (SurMágico)**.
* Carrito lateral interactivo en CLP ($), validación estricta de datos de entrega y selección de pasarela simulada (Webpay Plus / Mercado Pago).
* Generación de comprobante digital con folio único y botón de cierre comercial directo al WhatsApp del consultor.

### 4. Pipeline de Viabilidad Técnica & Evaluación Ética
* Al enviar una solicitud, el sistema ejecuta un clasificador ético que analiza la viabilidad técnica y legal del requerimiento.
* Si la solicitud es válida, genera y envía en minutos un informe estructurado por correo al cliente (*Entendemos su necesidad $\rightarrow$ Propuesta personalizada $\rightarrow$ Beneficios esperados*).
* Si detecta intentos de fraude, vulneración de sistemas o evasión tributaria, el sistema rechaza automáticamente la propuesta y emite una respuesta protocolar de cortesía.

---

## 🛡️ Seguridad Defensiva y Blindaje (AppSec)

* **Clasificador Ético Fail-Closed:** Ante errores de red, respuestas ambiguas o caídas de Ollama, el sistema rechaza por defecto. La entrada del usuario se aísla con delimitadores `<<<SOLICITUD_CLIENTE>>>` para neutralizar ataques de *Prompt Injection*.
* **Protección contra Inyección de Fórmulas CSV:** Sanitización de celdas en el almacenamiento local para prevenir la ejecución de comandos (`=`, `+`, `-`, `@`) en planillas de cálculo.
* **Control de Abuso & DoS:**
  * Restricción estricta de **CORS** a los orígenes autorizados de `iasesoria.cl`.
  * Límite de tamaño de payload (`MAX_CONTENT_LENGTH = 32 KB`).
  * Timeouts acotados en llamadas HTTP para evitar retención y agotamiento de hilos (*thread exhaustion*).
* **Proxy de Webhooks:** Eliminación total de endpoints externos de Google Apps Script en el frontend; todas las llamadas de leads se canalizan por `/api/demo-lead` en el backend.
* **Depuración Segura:** Servidores en producción con `debug=False` y permisos de archivos restringidos (`chmod 600`) para variables de entorno y logs.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Backend & APIs** | Python 3.12, Flask 3.1, Werkzeug, Requests, python-dotenv |
| **Frontend & UI** | Vanilla JavaScript (ES6+), HTML5 Semántico, CSS Moderno (Glassmorphism, Flexbox, Grid) |
| **Inteligencia Artificial** | Ollama, Qwen-Instruct, Prompts de Clasificación Delimitados |
| **Infraestructura & Red** | Ubuntu Server LTS, Cloudflare Tunnels (Zero Trust), systemd Daemons |
| **Integraciones** | Telegram Bot API, Google Apps Script, Webpay Plus / Mercado Pago (Simulados), WhatsApp Business |

---

## 🚀 Despliegue Local & Desarrollo

```bash
# 1. Clonar el repositorio
git clone https://github.com/Benj11ii/secretario-ia-backend.git
cd secretario-ia-backend

# 2. Configurar entorno virtual
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Configurar variables de entorno (.env)
chmod 600 backend/.env

# 4. Iniciar servicio principal
python backend/app.py

👨‍💻 Autor

Benjamín Alonso Carmona Vega
Consultor Tecnológico & Desarrollador Full Stack

    Villarrica, Región de La Araucanía, Chile

    Sitio Web: iasesoria.cl

    LinkedIn: linkedin.com/in/benjamin-carmona-69aa44223

    GitHub: @Benj11ii

    Email: soporte@iasesoria.cl
