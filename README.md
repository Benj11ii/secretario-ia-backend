# Secretario Técnico con IA (V1.0)

Sistema de gestión de asesorías técnicas que utiliza **Ollama** para resumir requerimientos de clientes y enviarlos automáticamente a **Telegram** y **Google Sheets**.

## Tecnologías utilizadas
- **Backend:** Python (Flask)
- **IA:** Ollama (Llama 3 / Mistral)
- **Infraestructura:** Servidor Linux (Ubuntu), Nginx como Reverse Proxy.
- **Base de Datos:** CSV local y sincronización con Google Sheets.

## Características de la V1.0
- Interfaz web responsiva con animación de carga.
- Resumen automático de solicitudes mediante IA local.
- Registro local en CSV para respaldo inmediato.
- Notificaciones en tiempo real vía Telegram.

## Notas de Optimización
Proyecto optimizado para hardware modesto (Celeron N95).
Trabajando con offloading en Mac M1.

## Despligue y pruebas en vivo
Puedes ver el funcionamiento general directamente en iasesoria.cl.
