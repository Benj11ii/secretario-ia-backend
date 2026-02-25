// assets/js/demos.js - VERSIÓN CORREGIDA Y OPTIMIZADA

// ============================================
// MANEJADOR DE CLICKS PARA DEMOS
// ============================================
function handleDemoClick(button, demoFunctionName) {
    const demoCard = button.closest('.demo-card');
    if (!demoCard) return;

    const demoFunction = window[demoFunctionName];
    if (typeof demoFunction !== 'function') return;

    focusOnDemo(demoCard, demoFunction);
}

// ============================================
// DEMO 1: DIAGNÓSTICO EXPRESS
// ============================================
function runDataDemo() {
    console.log("✅ Demo 1 ejecutándose");
    const demoDiv = document.getElementById('demo-data');
    if (!demoDiv) return;
    demoDiv.addEventListener('click', e => e.stopPropagation());

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
                </div>`;
        } else if (paso === 2) {
            html = `
                <div style="text-align: center; padding: 15px;">
                    <h4 style="color: #f3a022; margin: 0 0 15px 0;">📋 PASO 2 DE 3</h4>
                    <p style="color: white; margin-bottom: 20px;">¿Cuánto tiempo dedicas a tareas manuales?</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="responderDemo1('poco')" class="btn-cotizar" style="width: 100%;">🕐 Menos de 1 hora/día</button>
                        <button onclick="responderDemo1('medio')" class="btn-cotizar" style="width: 100%;">⏳ Entre 1 y 3 horas/día</button>
                        <button onclick="responderDemo1('mucho')" class="btn-cotizar" style="width: 100%;">🔥 Más de 3 horas/día</button>
                    </div>
                </div>`;
        } else if (paso === 3) {
            html = `
                <div style="text-align: center; padding: 15px;">
                    <h4 style="color: #f3a022; margin: 0 0 15px 0;">📋 PASO 3 DE 3</h4>
                    <p style="color: white; margin-bottom: 20px;">¿Qué te gustaría lograr en 3 meses?</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="responderDemo1('crecer')" class="btn-cotizar" style="width: 100%;">🚀 Crecer sin contratar</button>
                        <button onclick="responderDemo1('automatizar')" class="btn-cotizar" style="width: 100%;">🤖 Automatizar todo</button>
                    </div>
                </div>`;
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
            const diagnostico = {
                ventas: "🚀 Con IA podrías aumentar ventas 40%",
                tiempo: "⏰ Automatizar te ahorraría 15h/semana",
                inventario: "📦 Dashboard evitaría quiebres de stock",
                clientes: "💬 CRM automático fideliza clientes"
            };
            demoDiv.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #f3a022;">✨ Diagnóstico Express</h3>
                    <p style="color: white; margin: 20px 0;">${diagnostico[respuestas.desafio] || diagnostico.ventas}</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="reiniciarDemo1()" class="btn-cotizar">🔄 Otra vez</button>
                        <a href="/#five" class="btn-cotizar" style="text-decoration:none;">📝 Asesoría</a>
                    </div>
                </div>`;
        }
    };

    window.reiniciarDemo1 = function () {
        paso = 1; respuestas = {}; renderPaso();
    };

    renderPaso();
}

// ============================================
// DEMO 2: AUTOMATIZACIÓN
// ============================================
function runAutoDemo() {
    const demoDiv = document.getElementById('demo-auto');
    if (!demoDiv) return;
    demoDiv.addEventListener('click', e => e.stopPropagation());

    window.renderAutoInicial = function (e) {
        if (e) e.stopPropagation();
        demoDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #f3a022; margin: 0 0 15px 0;">⚙️ MAGIA EN UN CLIC</h4>
                <p style="color: white; margin-bottom: 25px;">Simula una venta para ver la automatización.</p>
                <button onclick="ejecutarAutoFlujo(event)" class="btn-cotizar">🛒 Simular Venta</button>
            </div>`;
    };

    window.ejecutarAutoFlujo = function (e) {
        if (e) e.stopPropagation();
        const stActive = "padding: 12px; border-radius: 8px; background: rgba(243,160,34,0.15); border-left: 4px solid #f3a022; margin-bottom:10px; display: flex; justify-content: space-between; color: white;";
        const stDone = "padding: 12px; border-radius: 8px; background: rgba(76,175,80,0.15); border-left: 4px solid #4CAF50; margin-bottom:10px; display: flex; justify-content: space-between; color: white; opacity: 0.8;";

        demoDiv.innerHTML = `
            <div style="padding: 10px;">
                <div id="p1" style="${stActive}"><span>🗄️ Guardando CRM...</span><span>⏳</span></div>
                <div id="p2" style="opacity:0.5; ${stActive}"><span>📧 Enviando factura...</span><span>⌛</span></div>
                <div id="p3" style="opacity:0.5; ${stActive}"><span>📱 Notificando Bodega...</span><span>⌛</span></div>
                <div id="res" style="display:none; text-align:center; margin-top:20px;">
                    <p style="color:#4CAF50;">✨ ¡Completado!</p>
                    <button onclick="renderAutoInicial(event)" class="btn-cotizar">🔄 Reiniciar</button>
                </div>
            </div>`;

        setTimeout(() => { 
            document.getElementById('p1').style.cssText = stDone;
            document.getElementById('p2').style.opacity = "1";
        }, 800);
        setTimeout(() => { 
            document.getElementById('p2').style.cssText = stDone;
            document.getElementById('p3').style.opacity = "1";
        }, 1600);
        setTimeout(() => { 
            document.getElementById('p3').style.cssText = stDone;
            document.getElementById('res').style.display = "block";
        }, 2400);
    };

    renderAutoInicial();
}

// ============================================
// DEMO 3: CHAT CON LÍMITE (CORREGIDA)
// ============================================
function runChatDemo() {
    const demoDiv = document.getElementById('demo-chat');
    if (!demoDiv) return;
    demoDiv.addEventListener('click', e => e.stopPropagation());

    let consultasRestantes = parseInt(sessionStorage.getItem('chatConsultas') || "3");
    let chatHistory = [];

    function renderChat() {
        demoDiv.innerHTML = `
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #f3a022;">🤖 Asistente IA</span>
                    <span id="chat-counter" style="color: white; font-size: 0.8rem; background: rgba(243,160,34,0.2); padding: 3px 8px; border-radius: 12px;">
                        💬 ${consultasRestantes} consultas
                    </span>
                </div>
                <div id="chat-messages" style="height: 180px; overflow-y: auto; margin-bottom: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <p style="color:#f3a022;">🤖 ¡Hola! ¿En qué puedo ayudarte?</p>
                </div>
                <div id="chat-controls" style="display: flex; gap: 5px;">
                    <input type="text" id="chat-input" placeholder="Escribe..." style="flex:1; padding: 8px; border-radius: 4px; border:none; background:#333; color:white;">
                    <button onclick="sendChatMessage()" id="chat-send-btn" class="btn-cotizar" style="padding: 5px 15px;">Enviar</button>
                </div>
                <div id="chat-bloqueado" style="display: ${consultasRestantes <= 0 ? 'block' : 'none'}; margin-top: 10px; text-align: center;">
                    <p style="color: #f3a022;">✨ Demo completada</p>
                    <a href="/#five" class="btn-cotizar" style="text-decoration:none; font-size:0.8rem;">Ir al formulario</a>
                </div>
            </div>`;
            
        if(consultasRestantes <= 0) desactivarChat();
    }

    function desactivarChat() {
        const input = document.getElementById('chat-input');
        const btn = document.getElementById('chat-send-btn');
        if(input) input.disabled = true;
        if(btn) btn.disabled = true;
    }

    window.sendChatMessage = async function () {
        const input = document.getElementById('chat-input');
        const msgDiv = document.getElementById('chat-messages');
        const userMsg = input.value.trim();

        if (!userMsg || consultasRestantes <= 0) return;

        input.value = '';
        msgDiv.innerHTML += `<p style="text-align:right; color:white;">👤 ${userMsg}</p>`;
        msgDiv.innerHTML += `<p id="typing" style="color:#f3a022;">🤖 Pensando...</p>`;
        msgDiv.scrollTop = msgDiv.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: chatHistory })
            });

            const data = await response.json();
            const typing = document.getElementById('typing');
            if (typing) typing.remove();

            if (data.success) {
                msgDiv.innerHTML += `<p style="color:#f3a022;">🤖 ${data.response}</p>`;
                chatHistory.push({ role: 'user', content: userMsg });
                chatHistory.push({ role: 'assistant', content: data.response });

                consultasRestantes--;
                sessionStorage.setItem('chatConsultas', consultasRestantes.toString());
                document.getElementById('chat-counter').innerText = `💬 ${consultasRestantes} consultas`;

                if (consultasRestantes <= 0) {
                    desactivarChat();
                    document.getElementById('chat-bloqueado').style.display = 'block';
                }
            }
        } catch (error) {
            if (document.getElementById('typing')) document.getElementById('typing').innerText = "❌ Error de conexión";
        }
        msgDiv.scrollTop = msgDiv.scrollHeight;
    };

    renderChat();
}

// ============================================
// DEMO 4: DASHBOARD
// ============================================
function runDashDemo() {
    const demoDiv = document.getElementById('demo-dash');
    if (!demoDiv) return;
    demoDiv.addEventListener('click', e => e.stopPropagation());

    window.renderDashInicial = function () {
        demoDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #f3a022;">📊 DASHBOARD INTELIGENTE</h4>
                <p style="color:white; font-size:0.9rem;">Transforma datos en decisiones.</p>
                <button onclick="generarDashboard()" class="btn-cotizar">🧠 Analizar con IA</button>
            </div>`;
    };

    window.generarDashboard = function () {
        demoDiv.innerHTML = `<div style="text-align:center; padding:40px;"><p style="color:#f3a022; animation: pulse 1s infinite;">⏳ Analizando transacciones...</p></div>`;
        setTimeout(() => {
            demoDiv.innerHTML = `
                <div style="padding: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom:15px;">
                        <div style="background:rgba(243,160,34,0.1); padding:10px; border-radius:8px; text-align:center;">
                            <small style="color:#aaa;">VENTAS</small><br><strong style="color:#f3a022; font-size:1.2rem;">$450.000</strong>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; text-align:center;">
                            <small style="color:#aaa;">TENDENCIA</small><br><strong style="color:white; font-size:1.1rem;">Marraqueta</strong>
                        </div>
                    </div>
                    <div style="background:rgba(76,175,80,0.1); border-left:4px solid #4CAF50; padding:10px; border-radius:4px;">
                        <p style="margin:0; font-size:0.85rem; color:white;">🤖 <strong>IA Insight:</strong> Sube el stock de pan a las 18:00 para evitar quiebres.</p>
                    </div>
                    <button onclick="renderDashInicial()" class="btn-cotizar" style="margin-top:15px; width:100%;">🔄 Reset</button>
                </div>`;
        }, 1500);
    };
    renderDashInicial();
}

// ============================================
// DEMO 5: VISUAL SORT
// ============================================
function runSortDemo() {
    const demoDiv = document.getElementById('demo-sort');
    if (!demoDiv) return;
    demoDiv.addEventListener('click', e => e.stopPropagation());

    let datos = [
        { p: 'Pan', c: 45 }, { p: 'Leche', c: 12 }, { p: 'Dulce', c: 85 }, { p: 'Mantequilla', c: 30 }
    ];

    function renderTabla(items, ordenado = false) {
        let html = `<h4 style="color:#f3a022; text-align:center;">${ordenado ? '✅ ORDENADO' : '📊 DESORDENADO'}</h4>`;
        html += `<table style="width:100%; color:white; margin-bottom:15px;">`;
        items.forEach(i => {
            html += `<tr style="border-bottom:1px solid #333;"><td style="padding:5px;">${i.p}</td><td style="text-align:right; color:#f3a022;">${i.c} uds</td></tr>`;
        });
        html += `</table>`;
        if(!ordenado) html += `<button onclick="ordenarConIA(event)" class="btn-cotizar" style="width:100%;">⚡ ORDENAR CON IA</button>`;
        else html += `<button onclick="runSortDemo()" class="btn-cotizar" style="width:100%;">🔄 Reiniciar</button>`;
        demoDiv.innerHTML = `<div style="padding:15px;">${html}</div>`;
    }

    window.ordenarConIA = function(e) {
        if(e) e.stopPropagation();
        demoDiv.innerHTML = `<p style="text-align:center; color:#f3a022; padding:20px;">⚡ Organizando...</p>`;
        setTimeout(() => {
            const sorted = [...datos].sort((a, b) => b.c - a.c);
            renderTabla(sorted, true);
        }, 1000);
    };

    renderTabla(datos);
}

// ============================================
// GESTIÓN DE MODO FOCUS Y CIERRE
// ============================================
let activeDemoCard = null;

function focusOnDemo(demoCard, demoFunction) {
    if (activeDemoCard) exitFocusMode();

    demoCard.classList.add('active');
    activeDemoCard = demoCard;
    document.body.classList.add('focus-mode');

    const preview = demoCard.querySelector('.demo-preview');
    if (preview) {
        // Preservamos el ID necesario para la función buscando el ID original o creándolo
        const originalId = demoFunction.name === 'runDataDemo' ? 'demo-data' : 
                         demoFunction.name === 'runAutoDemo' ? 'demo-auto' :
                         demoFunction.name === 'runChatDemo' ? 'demo-chat' :
                         demoFunction.name === 'runDashDemo' ? 'demo-dash' : 'demo-sort';
        
        preview.innerHTML = `
            <button class="demo-close-btn" onclick="exitFocusMode(event)">✕</button>
            <div id="${originalId}" class="demo-content-container"></div>
        `;
    }

    setTimeout(() => demoFunction(), 50);
}

function exitFocusMode(e) {
    if (e) e.stopPropagation();
    if (activeDemoCard) {
        activeDemoCard.classList.remove('active');
        activeDemoCard = null;
    }
    document.body.classList.remove('focus-mode');
}

// Cerrar al hacer clic fuera
document.addEventListener('click', function (e) {
    if (document.body.classList.contains('focus-mode')) {
        if (!e.target.closest('.demo-card') && !e.target.closest('.demo-hover-btn')) {
            exitFocusMode();
        }
    }
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') exitFocusMode();
});

// Exportar funciones globalmente
window.runDataDemo = runDataDemo;
window.runAutoDemo = runAutoDemo;
window.runChatDemo = runChatDemo;
window.runDashDemo = runDashDemo;
window.runSortDemo = runSortDemo;
window.exitFocusMode = exitFocusMode;

console.log("🚀 demos.js corregido y cargado");