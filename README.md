# 🤖 Sistema de Asesoría Inteligente con IA Local

Este backend gestiona solicitudes de clientes desde un formulario web, las procesa mediante una IA local para generar respuestas motivadoras y las distribuye en múltiples plataformas en tiempo real.

## 🚀 Funcionalidades
- **IA Local (Ollama):** Utiliza el modelo `Qwen2.5-3B` para resumir y responder con tono empático y profesional.
- **Multicanal:** - 📊 Registro automático en **Google Sheets**.
  - 📁 Respaldo local en archivo **CSV**.
  - 📱 Notificaciones instantáneas vía **Telegram Bot**.
- **Asíncrono:** Procesamiento en hilos (`threading`) para no hacer esperar al usuario en la web.

## 🛠️ Tecnologías
- **Backend:** Python + Flask.
- **IA:** Ollama (Modelo Qwen 2.5 3B).
- **Integraciones:** Google Apps Script API, Telegram API.
- **Servidor:** Linux (Ubuntu/Debian) con Nginx y Systemd.

## 📋 Requisitos
- Ollama instalado y corriendo.
- Modelo descargado: `ollama pull qwen2.5:3b`.
- Dependencias de Python: `pip install flask requests`.

## ⚙️ Configuración del Backend
El servicio corre bajo `systemd` para asegurar alta disponibilidad:
- **Unidad:** `asesoria-backend.service`
- **Puerto:** 5000 (Proxy pass con Nginx).