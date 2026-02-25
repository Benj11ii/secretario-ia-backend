// assets/js/demos.js - VERSIÓN COMPLETA CON 4 DEMOS Y SISTEMA HÍBRIDO DE CHAT

// ============================================
// MANEJADOR DE CLICKS PARA DEMOS
// ============================================
function handleDemoClick(button, demoFunctionName) {
    // Encontrar la tarjeta contenedora
    const demoCard = button.closest('.demo-card');
    if (!demoCard) return;

    // Obtener la función por su nombre
    const demoFunction = window[demoFunctionName];
    if (typeof demoFunction !== 'function') return;

    // Activar modo focus y ejecutar demo
    focusOnDemo(demoCard, demoFunction);
}

// ============================================
// DEMO 1: DIAGNÓSTICO EXPRESS (VERSIÓN SIMPLE)
// ============================================
function runDataDemo() {
    console.log("✅ Demo 1 ejecutándose - Versión Simple");

    const demoDiv = document.getElementById('demo-data');
    demoDiv.addEventListener('click', e => e.stopPropagation());
    if (!demoDiv) return;

    let paso = 1;
    let respuestas = {};

    function renderPaso() {
        let html = '';

        if (paso === 1) {
            html = `
                <div style="text-align: center; padding: 15px;">
                    <h4 style="color: #f3a022; margin: 0 0 15px 0;">📋 PASO 1 DE 3</h4>
                    <p style="color: white; margin-bottom: 20px;">¿Cuál es tu principal desafío hoy?</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="responderDemo1('ventas')" class="btn-cotizar" style="width: 100%;">📉 Aumentar ventas</button>
                        <button onclick="responderDemo1('tiempo')" class="btn-cotizar" style="width: 100%;">⏰ Poco tiempo</button>
                        <button onclick="responderDemo1('clientes')" class="btn-cotizar" style="width: 100%;">👥 Gestionar clientes</button>
                        <button onclick="responderDemo1('inventario')" class="btn-cotizar" style="width: 100%;">📦 Controlar inventario</button>
                    </div>
                </div>
            `;
        } else if (paso === 2) {
            html = `
                <div style="text-align: center; padding: 15px;">
                    <h4 style="color: #f3a022; margin: 0 0 15px 0;">📋 PASO 2 DE 3</h4>
                    <p style="color: white; margin-bottom: 20px;">¿Cuánto tiempo dedicas a tareas manuales?</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="responderDemo1('poco')" class="btn-cotizar" style="width: 100%;">🕐 Menos de 1 hora/día</button>
                        <button onclick="responderDemo1('medio')" class="btn-cotizar" style="width: 100%;">⏳ Entre 1 y 3 horas/día</button>
                        <button onclick="responderDemo1('mucho')" class="btn-cotizar" style="width: 100%;">🔥 Más de 3 horas/día</button>
                        <button onclick="responderDemo1('muchisimo')" class="btn-cotizar" style="width: 100%;">⚡ No tengo control</button>
                    </div>
                </div>
            `;
        } else if (paso === 3) {
            html = `
                <div style="text-align: center; padding: 15px;">
                    <h4 style="color: #f3a022; margin: 0 0 15px 0;">📋 PASO 3 DE 3</h4>
                    <p style="color: white; margin-bottom: 20px;">¿Qué te gustaría lograr en 3 meses?</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="responderDemo1('crecer')" class="btn-cotizar" style="width: 100%;">🚀 Crecer sin contratar</button>
                        <button onclick="responderDemo1('organizar')" class="btn-cotizar" style="width: 100%;">📊 Organizar mi negocio</button>
                        <button onclick="responderDemo1('automatizar')" class="btn-cotizar" style="width: 100%;">🤖 Automatizar todo</button>
                        <button onclick="responderDemo1('clientes')" class="btn-cotizar" style="width: 100%;">💬 Fidelizar clientes</button>
                    </div>
                </div>
            `;
        }

        demoDiv.innerHTML = html;
    }

    window.responderDemo1 = function (respuesta) {
        if (paso === 1) respuestas.desafio = respuesta;
        if (paso === 2) respuestas.tiempo = respuesta;
        if (paso === 3) respuestas.meta = respuesta;

        if (paso < 3) {
            paso++;
            renderPaso();
        } else {
            // Diagnóstico final
            const diagnostico = {
                ventas: "🚀 Con IA podrías aumentar ventas 40%",
                tiempo: "⏰ Automatizar te ahorraría 15h/semana",
                inventario: "📦 Dashboard evitaría quiebres de stock",
                clientes: "💬 CRM automático fideliza clientes"
            };

            demoDiv.innerHTML = `
    <div style="text-align: center; padding: 20px;">
        <h3 style="color: #f3a022;">✨ Diagnóstico Express</h3>
        <p style="color: white; margin: 20px 0;">
            ${diagnostico[respuestas.desafio] || diagnostico.ventas}
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button onclick="reiniciarDemo1()" class="btn-cotizar">
                🔄 Probar otra vez
            </button>
            <a href="/#five" class="btn-cotizar" style="text-decoration:none;">
                📝 Solicitar asesoría</a>
            </a>
        </div>
    </div>
`;
        }
    };

    window.reiniciarDemo1 = function () {
        paso = 1;
        respuestas = {};
        renderPaso();
    };

    renderPaso();
}

// ============================================
// DEMO 2: AUTOMATIZACIÓN (VISUAL E INTERACTIVA)
// ============================================
function runAutoDemo() {
    console.log("✅ Demo 2 ejecutándose - Automatización Visual");

    const demoDiv = document.getElementById('demo-auto');
    if (!demoDiv) return;

    // Evitamos problemas de propagación de clics
    demoDiv.addEventListener('click', e => e.stopPropagation());

    // 1. Pantalla Inicial (Botón de acción)
    window.renderAutoInicial = function (e) {
        if (e) e.stopPropagation();

        demoDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #f3a022; margin: 0 0 15px 0;">⚙️ MAGIA EN UN CLIC</h4>
                <p style="color: white; margin-bottom: 25px; font-size: 0.95rem;">
                    Imagina que un cliente acaba de comprar. Haz clic para ver cómo la IA hace el trabajo administrativo por ti.
                </p>
                <button onclick="ejecutarAutoFlujo(event)" class="btn-cotizar" style="font-size: 1.1rem; padding: 15px 30px; display: inline-flex; align-items: center; gap: 8px;">
                    <span>🛒</span> Simular Nueva Venta
                </button>
            </div>
        `;
    };

    // 2. Ejecución del Flujo (Animación visual simulada)
    window.ejecutarAutoFlujo = function (e) {
        if (e) e.stopPropagation();

        // Estilos base para los pasos
        const stPending = "padding: 12px 15px; border-radius: 8px; background: rgba(255,255,255,0.05); border-left: 4px solid transparent; display: flex; justify-content: space-between; align-items: center; opacity: 0.5; transition: all 0.3s;";
        const stActive = "padding: 12px 15px; border-radius: 8px; background: rgba(243,160,34,0.15); border-left: 4px solid #f3a022; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s;";
        const stDone = "padding: 12px 15px; border-radius: 8px; background: rgba(76,175,80,0.15); border-left: 4px solid #4CAF50; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s;";

        // Renderizamos la estructura de los pasos
        demoDiv.innerHTML = `
            <div style="width:100%; padding: 10px;">
                <div style="text-align:center; margin-bottom: 20px;">
                    <span style="color: #f3a022; font-weight: bold; font-size: 0.9rem;">⚡ EJECUTANDO FLUJO AUTOMÁTICO...</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- Paso 1: Activo de inmediato -->
                    <div id="paso-auto-1" style="${stActive}">
                        <span style="color: white;">🗄️ Guardando cliente en CRM...</span>
                        <span style="color: #f3a022;" class="spin-icon">⏳</span>
                    </div>

                    <!-- Paso 2: Pendiente -->
                    <div id="paso-auto-2" style="${stPending}">
                        <span style="color: white;">📧 Generando y enviando factura</span>
                        <span>⌛</span>
                    </div>

                    <!-- Paso 3: Pendiente -->
                    <div id="paso-auto-3" style="${stPending}">
                        <span style="color: white;">📱 Notificando a Bodega (WhatsApp)</span>
                        <span>⌛</span>
                    </div>
                </div>

                <!-- Botones Finales (Ocultos inicialmente) -->
                <div id="auto-resultado" style="display: none; margin-top: 25px; text-align: center;">
                    <p style="color: #4CAF50; font-size: 0.95rem; font-weight: bold; margin-bottom: 15px;">
                        ✨ ¡3 tareas completadas en 2 segundos!
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="renderAutoInicial(event)" class="btn-cotizar" style="background: rgba(255,255,255,0.1); color: white;">🔄 Probar otra vez</button>
                        <a href="/#five" class="btn-cotizar" style="text-decoration:none;">📝 Solicitar asesoría</a>
                    </div>
                </div>
            </div>
        `;

        // Lógica de avance de los pasos con setTimeout
        const p1 = document.getElementById('paso-auto-1');
        const p2 = document.getElementById('paso-auto-2');
        const p3 = document.getElementById('paso-auto-3');
        const resultado = document.getElementById('auto-resultado');

        // A los 800ms: P1 termina, P2 empieza
        setTimeout(() => {
            p1.style.cssText = stDone;
            p1.innerHTML = `<span style="color: white; opacity:0.8;">🗄️ Cliente guardado en CRM</span><span style="color: #4CAF50;">✅</span>`;

            p2.style.cssText = stActive;
            p2.innerHTML = `<span style="color: white;">📧 Enviando factura...</span><span style="color: #f3a022;">⏳</span>`;
        }, 800);

        // A los 1600ms: P2 termina, P3 empieza
        setTimeout(() => {
            p2.style.cssText = stDone;
            p2.innerHTML = `<span style="color: white; opacity:0.8;">📧 Factura enviada al cliente</span><span style="color: #4CAF50;">✅</span>`;

            p3.style.cssText = stActive;
            p3.innerHTML = `<span style="color: white;">📱 Notificando a Bodega...</span><span style="color: #f3a022;">⏳</span>`;
        }, 1600);

        // A los 2400ms: P3 termina y muestra botones
        setTimeout(() => {
            p3.style.cssText = stDone;
            p3.innerHTML = `<span style="color: white; opacity:0.8;">📱 Bodega notificada</span><span style="color: #4CAF50;">✅</span>`;

            // Efecto "Fade In" para los botones finales
            resultado.style.display = 'block';
            resultado.animate([
                { opacity: 0, transform: 'translateY(10px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 400, fill: 'forwards' });

        }, 2400);
    };

    // Arrancamos mostrando la pantalla inicial
    renderAutoInicial();
}

// ============================================
// DEMO 3: CHAT CON LÍMITE DE 3 CONSULTAS
// ============================================
function runChatDemo() {
    console.log("✅ Demo 3 ejecutándose - Modo con límite");

    const demoDiv = document.getElementById('demo-chat');
    demoDiv.addEventListener('click', e => e.stopPropagation());
    if (!demoDiv) return;

    let consultasRestantes = sessionStorage.getItem('chatConsultas');

    if (consultasRestantes === null) {
        sessionStorage.setItem('chatConsultas', '3');
        consultasRestantes = 3;
    } else {
        consultasRestantes = parseInt(consultasRestantes);
    }

    let chatHistory = [];

    demoDiv.innerHTML = `
        <div style="width:100%; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #f3a022; font-size: 0.9rem;">🤖 Asistente IAsesoria (Demo)</span>
                <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem; background: rgba(243,160,34,0.2); padding: 3px 8px; border-radius: 12px;">
                    💬 ${consultasRestantes} de 3 consultas
                </span>
            </div>
            
            <div id="chat-messages" style="height: 200px; overflow-y: auto; margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.4); border-radius: 8px;">
                <p style="margin:5px 0; color:#f3a022;">🤖 Bot: ¡Hola! Soy el asistente de IAsesoria.</p>
            </div>
            
            <div style="display: flex; gap: 8px;">
                <input type="text" id="chat-input" placeholder="Escribe tu pregunta..." 
                    style="flex:1; padding: 10px; background: rgba(0,0,0,0.5); color: white; border: 1px solid #f3a02250; border-radius: 4px;">
                <button onclick="sendChatMessage()" style="padding: 10px 25px; background: #f3a022; color: #1a1a21; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Enviar</button>
            </div>
            
            <div id="chat-bloqueado" style="display: none; margin-top: 15px; padding: 15px; background: rgba(243, 160, 34, 0.15); border-radius: 8px; text-align: center;">
                <p style="color: #f3a022; font-weight: bold;">✨ Demo completada</p>
                <p style="color: white;">Gracias por probar la demo.</p>
                <a href="/#five" class="btn-cotizar" style="text-decoration: none; display: inline-block; margin-top: 10px;">Ir al formulario</a>
            </div>
        </div>
    `;

    if (consultasRestantes <= 0) {
        document.getElementById('chat-input').disabled = true;
        document.querySelector('button[onclick="sendChatMessage()"]').disabled = true;
        document.getElementById('chat-bloqueado').style.display = 'block';
        return;
    }

    window.sendChatMessage = async function () {
        const input = document.getElementById('chat-input');
        const msgDiv = document.getElementById('chat-messages');
        const contadorSpan = document.querySelector('span[style*="background: rgba(243,160,34,0.2)"]');

        if (input.value.trim() === '') return;
        const sendBtn = document.querySelector('button[onclick="sendChatMessage()"]');
        sendBtn.disabled = true;

        let restantes = parseInt(sessionStorage.getItem('chatConsultas'));
        if (restantes <= 0) {
            sendBtn.disabled = true;
            return;
        }

        const userMsg = input.value;

        msgDiv.innerHTML += `<p style="margin:5px 0; text-align: right;"><strong style="color:white;">👤 Tú:</strong> ${userMsg}</p>`;
        input.value = '';

        msgDiv.innerHTML += `<p id="typing-indicator" style="margin:5px 0; color:#f3a022;">🤖 Bot: <span style="opacity:0.7;">⚡ pensando...</span></p>`;
        msgDiv.scrollTop = msgDiv.scrollHeight;

        try {
            const response = await fetch('http://localhost:5003/chat', {//Cambiar hacia donde consulta chat_demo hacia mac o celeron
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: chatHistory }) // Linea cambiada
            });

            const data = await response.json();
            document.getElementById('typing-indicator')?.remove();

            if (data.success) {
                msgDiv.innerHTML += `<p style="margin:5px 0;"><strong style="color:#f3a022;">🤖 Asistente:</strong> ${data.response}</p>`;
                if (data.show_form_redirect) {
                    setTimeout(() => {
                        window.location.href = "/#five";
                    }, 1200);
                }

                restantes--;
                sessionStorage.setItem('chatConsultas', restantes.toString());

                if (contadorSpan) {
                    contadorSpan.innerHTML = `💬 ${restantes} de 3 consultas`;
                }

                chatHistory.push({ role: 'user', content: userMsg });
                chatHistory.push({ role: 'assistant', content: data.response });

                if (restantes <= 0) {
                    input.disabled = true;
                    sendBtn.disabled = true;
                    document.getElementById('chat-bloqueado').style.display = 'block';
                    return; // 👈 evita que se reactive
                }
            }
        } catch (error) {
            document.getElementById('typing-indicator')?.remove();
            msgDiv.innerHTML += `<p style="margin:5px 0; color:#ff6b6b;">❌ Error de conexión</p>`;
        }

        msgDiv.scrollTop = msgDiv.scrollHeight;
    };

}

// ============================================
// DEMO 4: DATOS QUE HABLAN (DASHBOARD INTELIGENTE)
// ============================================
function runDashDemo() {
    console.log("✅ Demo 4 ejecutándose - Dashboard Inteligente");

    const demoDiv = document.getElementById('demo-dash');
    if (!demoDiv) return;

    // 🟢 Evitar que se cierre el modal accidentalmente
    demoDiv.addEventListener('click', e => e.stopPropagation());

    // 1. Pantalla Inicial
    window.renderDashInicial = function (e) {
        if (e) e.stopPropagation();

        demoDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #f3a022; margin: 0 0 15px 0;">📊 DE NÚMEROS A DECISIONES</h4>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px; font-family: monospace; font-size: 0.8rem; color: rgba(255,255,255,0.5); text-align: left; overflow: hidden; height: 60px;">
                    10:05 | Venta #4021 | $4.500 | P_001<br>
                    10:08 | Venta #4022 | $1.200 | P_045<br>
                    10:12 | Venta #4023 | $8.900 | P_012<br>
                    10:15 | Venta #4024 | $3.500 | P_001
                </div>
                <p style="color: white; margin-bottom: 20px; font-size: 0.95rem;">
                    Tus datos crudos no dicen mucho. Deja que la IA los analice y te diga exactamente qué hacer hoy.
                </p>
                <button onclick="generarDashboard(event)" class="btn-cotizar" style="font-size: 1rem; padding: 12px 25px;">
                    🧠 Analizar con IA
                </button>
            </div>
        `;
    };

    // 2. Proceso de "Pensamiento" de la IA
    window.generarDashboard = function (e) {
        if (e) e.stopPropagation();

        demoDiv.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="color: #f3a022; font-size: 2rem; margin: 0; animation: spin 1s linear infinite;">⏳</p>
                <p id="dash-status" style="color: #f3a022; margin-top: 15px; font-weight: bold;">Conectando a la caja...</p>
                <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">Procesando más de 1.000 transacciones</p>
            </div>
        `;

        const statusText = document.getElementById('dash-status');

        // Simular las fases de análisis
        setTimeout(() => { if (statusText) statusText.innerText = "Cruzando ventas con inventario..."; }, 800);
        setTimeout(() => { if (statusText) statusText.innerText = "Generando recomendaciones..."; }, 1600);

        // 3. Mostrar el Dashboard Final
        setTimeout(() => {
            mostrarResultadosDashboard();
        }, 2400);
    };

    // 3. Renderizar Dashboard con Insights
    function mostrarResultadosDashboard() {
        // Generar datos aleatorios chilenizados
        const ventas = Math.floor(Math.random() * 250) + 120;
        const crecimiento = Math.floor(Math.random() * 25) + 10;

        // Diccionario de productos con sus "Insights" (Consejos de IA)
        const analisisProductos = [
            { nombre: "Marraqueta", insight: "Alta demanda inusual. Sugerencia: Hornear 50 unidades extra para evitar quiebre de stock a las 18:00." },
            { nombre: "Empanadas", insight: "El ticket promedio baja si se venden solas. Sugerencia: Activar en caja promoción 'Bebida + Empanada'." },
            { nombre: "Pan Molde", insight: "Poco movimiento hoy. Sugerencia: Ofrecer un 15% de descuento a los próximos 10 clientes." },
            { nombre: "Pasteles", insight: "Margen de ganancia alto. Sugerencia: Instruir a vendedores ofrecer como 'postre' en cada compra." }
        ];

        const productoEstrella = analisisProductos[Math.floor(Math.random() * analisisProductos.length)];

        demoDiv.innerHTML = `
            <div style="width:100%; padding: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="color: #4CAF50; font-weight: bold;">✅ Reporte Generado</span>
                    <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Actualizado justo ahora</span>
                </div>

                <!-- Tarjetas de Métricas -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="background: rgba(243,160,34,0.1); border: 1px solid rgba(243,160,34,0.3); padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="color:#aaa; font-size: 0.8rem; text-transform: uppercase;">Ventas Hoy</div>
                        <div style="font-size: 1.8rem; color:#f3a022; font-weight: bold;">$${ventas}k</div>
                        <div style="color:#4CAF50; font-size: 0.85rem;">⬆️ +${crecimiento}% vs ayer</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="color:#aaa; font-size: 0.8rem; text-transform: uppercase;">Top Producto</div>
                        <div style="font-size: 1.1rem; color:white; font-weight: bold; margin-top: 5px;">${productoEstrella.nombre}</div>
                        <div style="color:#f3a022; font-size: 0.85rem; margin-top: 5px;">🔥 En tendencia</div>
                    </div>
                </div>

                <!-- EL INSIGHT (La IA hablando) -->
                <div style="background: rgba(76,175,80,0.1); border-left: 4px solid #4CAF50; padding: 12px 15px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                        <span style="font-size: 1.2rem;">🤖</span>
                        <span style="color: #4CAF50; font-weight: bold; font-size: 0.9rem;">Insight del Asistente IA</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.9); font-size: 0.9rem; margin: 0; line-height: 1.4;">
                        ${productoEstrella.insight}
                    </p>
                </div>

                <!-- Botones Finales -->
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <button onclick="renderDashInicial(event)" class="btn-cotizar" style="background: rgba(255,255,255,0.1); color: white; padding: 10px 15px;">🔄 Probar otra vez</button>
                    <a href="/#five" class="btn-cotizar" style="text-decoration:none; padding: 10px 15px;">📝 Solicitar asesoría</a>
                </div>
            </div>
        `;
    }

    // Arrancamos mostrando la pantalla inicial
    renderDashInicial();
}

// ============================================
// DEMO 5: VISUAL SORT - ORDENAMIENTO ESPECTACULAR
// ============================================
function runSortDemo() {
    console.log("✅ Demo 5 ejecutándose - Visual Sort");

    const demoDiv = document.getElementById('demo-sort');
    if (!demoDiv) return;

    // 🟢 SOLUCIÓN 1: Evitar que los clics dentro de este contenedor se propaguen al body
    // (Esta línea la tenías en las otras demos pero faltaba aquí)
    demoDiv.addEventListener('click', e => e.stopPropagation());

    const productos = [
        'Marraqueta', 'Hallulla', 'Pan Molde', 'Dulce Leche', 'Alfajor',
        'Empanada', 'Sopaipilla', 'Pan Amasado', 'Berlines', 'Churro',
        'Pan de Huevo', 'Pan de Queso', 'Tortilla', 'Pan Integral', 'Bagel',
        'Croissant', 'Pan Ciabatta', 'Pan Baguette', 'Pan Pita', 'Pan de Centeno'
    ];

    const clientes = [
        'Juan Pérez', 'María González', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez',
        'Laura Rodríguez', 'Diego Fernández', 'Camila Torres', 'Andrés Silva', 'Valentina Castro',
        'Felipe Muñoz', 'Isabella Rojas', 'Matías Herrera', 'Florencia Díaz', 'Sebastián Soto',
        'Antonia Vargas', 'Joaquín Reyes', 'Emilia Guzmán', 'Benjamín Cruz', 'Catalina Méndez'
    ];

    let datosDesordenados = [];
    for (let i = 0; i < 20; i++) {
        datosDesordenados.push({
            producto: productos[Math.floor(Math.random() * productos.length)],
            cliente: clientes[Math.floor(Math.random() * clientes.length)],
            cantidad: Math.floor(Math.random() * 50) + 5,
            venta: Math.floor(Math.random() * 150000) + 20000
        });
    }

    function renderTabla(datos, titulo, mostrarBoton = true) {
        let tablaHTML = `
            <div style="width:100%; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <h4 style="color: #f3a022; margin: 0;">${titulo}</h4>
                    <span style="color: rgba(255,255,255,0.6);">${datos.length} registros</span>
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead style="position:sticky; top:0; background:#1a1a21;">
                            <tr>
                                <th style="padding:12px; text-align:left; color:#f3a022;">Producto</th>
                                <th style="padding:12px; text-align:left; color:#f3a022;">Cliente</th>
                                <th style="padding:12px; text-align:center; color:#f3a022;">Cantidad</th>
                                <th style="padding:12px; text-align:right; color:#f3a022;">Venta</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        datos.forEach((item, index) => {
            const bgColor = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)';
            tablaHTML += `
                <tr style="background:${bgColor};">
                    <td style="padding:10px; color:white;">${item.producto}</td>
                    <td style="padding:10px; color:rgba(255,255,255,0.8);">${item.cliente}</td>
                    <td style="padding:10px; text-align:center; color:#f3a022;">${item.cantidad} uds</td>
                    <td style="padding:10px; text-align:right; color:#4CAF50;">$${item.venta.toLocaleString('es-CL')}</td>
                </tr>
            `;
        });

        tablaHTML += `</tbody></table></div>`;

        if (mostrarBoton) {
            // 🟢 SOLUCIÓN 2: Pasar el evento (event) a la función
            tablaHTML += `
                <div style="display:flex; justify-content:center; margin-top:15px;">
                    <button onclick="ordenarDatos(event)" class="btn-cotizar">⚡ ORDENAR CON IA</button>
                </div>
            `;
        }

        tablaHTML += `</div>`;
        return tablaHTML;
    }

    demoDiv.innerHTML = renderTabla(datosDesordenados, '📊 DATOS DESORDENADOS');

    // 🟢 SOLUCIÓN 3: Recibir el evento y detener su propagación
    window.ordenarDatos = function (e) {
        if (e) e.stopPropagation();

        demoDiv.innerHTML = `<div style="text-align:center; padding:40px;"><p style="color:#f3a022;">⏳ Procesando...</p></div>`;

        setTimeout(() => {
            const datosOrdenados = [...datosDesordenados].sort((a, b) => b.cantidad - a.cantidad);
            demoDiv.innerHTML = renderTabla(datosOrdenados, '✅ DATOS ORDENADOS', false);

            const mensajeDiv = document.createElement('div');
            mensajeDiv.style.cssText = 'margin-top:15px; padding:15px; background:rgba(76,175,80,0.1); border-radius:8px; text-align:center;';
            mensajeDiv.innerHTML = `
                <p style="color:#4CAF50; font-weight:bold;">✨ ORDENAMIENTO COMPLETADO</p>
                <div style="display:flex; gap:10px; justify-content:center; margin-top:15px;">
                    <button onclick="reiniciarDemo(event)" class="btn-cotizar">🔄 Probar otra vez</button>
                    <a href="/#five" class="btn-cotizar" style="text-decoration:none;">📝 Solicitar asesoría</a>
                </div>
            `;
            demoDiv.appendChild(mensajeDiv);

            // 🗑️ Eliminé el setTimeout con el focus-mode aquí porque ya no es necesario
        }, 1500);
    };

    window.reiniciarDemo = function (e) {
        if (e) e.stopPropagation();

        datosDesordenados = [];
        for (let i = 0; i < 20; i++) {
            datosDesordenados.push({
                producto: productos[Math.floor(Math.random() * productos.length)],
                cliente: clientes[Math.floor(Math.random() * clientes.length)],
                cantidad: Math.floor(Math.random() * 50) + 5,
                venta: Math.floor(Math.random() * 150000) + 20000
            });
        }
        demoDiv.innerHTML = renderTabla(datosDesordenados, '📊 DATOS DESORDENADOS');
    };
}

// ============================================
// VERIFICACIÓN DE CARGA (GLOBAL - FUERA DE FUNCIONES)
// ============================================
console.log("🚀 demos.js cargado correctamente");
console.log("✅ Funciones disponibles:", {
    data: typeof runDataDemo,
    auto: typeof runAutoDemo,
    chat: typeof runChatDemo,
    dash: typeof runDashDemo,
    sort: typeof runSortDemo
});

window.runDataDemo = runDataDemo;
window.runAutoDemo = runAutoDemo;
window.runChatDemo = runChatDemo;
window.runDashDemo = runDashDemo;
window.runSortDemo = runSortDemo;


// ============================================
// MODO FOCUS (GLOBAL) - CORREGIDO
// ============================================
let activeDemoCard = null;

function focusOnDemo(demoCard, demoFunction) {
    if (activeDemoCard) exitFocusMode();

    demoCard.classList.add('active');
    activeDemoCard = demoCard;
    document.body.classList.add('focus-mode');

    // 1. Asegurar que el botón de cierre exista y sea visible
    // Buscamos el preview dentro de la tarjeta activa
    const preview = demoCard.querySelector('.demo-preview');
    if (preview) {
        // Limpiamos y aseguramos que la X esté siempre presente
        preview.innerHTML = `
            <button class="demo-close-btn" onclick="exitFocusMode()">✕</button>
            <div class="demo-content"></div>
        `;
    }

    // 2. Ejecutar la demo (ahora dentro de .demo-content para no borrar la X)
    setTimeout(() => {
        demoFunction();
    }, 100);
}

function exitFocusMode() {
    if (activeDemoCard) {
        activeDemoCard.classList.remove('active');
        activeDemoCard = null;
    }
    document.body.classList.remove('focus-mode');
}

// NUEVO: Cerrar al hacer clic fuera de la tarjeta (en el fondo oscuro)
document.addEventListener('click', function (e) {
    if (document.body.classList.contains('focus-mode')) {
        // Si el clic NO es dentro de una demo-card activa ni en el botón de abrir
        if (!e.target.closest('.demo-card') && !e.target.closest('.demo-hover-btn')) {
            exitFocusMode();
        }
    }
});

// Cerrar con ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) {
        exitFocusMode();
    }
});

















// Prevenir propagación del botón de cierre
document.querySelectorAll('.demo-close-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});

// Prevenir scroll en modo focus
document.addEventListener('touchmove', function (e) {
    if (document.body.classList.contains('focus-mode')) {
        e.preventDefault();
    }
}, { passive: false });



