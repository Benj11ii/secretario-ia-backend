// assets/js/demos.js - VERSIÓN FINAL PARA PRODUCCIÓN

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
    const demoDiv = document.querySelector('.demo-card.active .demo-content');
    if (!demoDiv) return;

    let paso = 1;
    let respuestas = {};

    function renderPaso() {
        let html = '';
        if (paso === 1) {
            html = `
                <div style="text-align: center; padding: 15px;">
                    <h4 style="color: #f3a022; margin-bottom: 15px;">📋 PASO 1 DE 3</h4>
                    <p style="margin-bottom: 20px;">¿Cuál es tu principal desafío hoy?</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="responderDemo1('ventas')" class="btn-cotizar" style="width: 100%;">📉 Aumentar ventas</button>
                        <button onclick="responderDemo1('tiempo')" class="btn-cotizar" style="width: 100%;">⏰ Poco tiempo</button>
                        <button onclick="responderDemo1('clientes')" class="btn-cotizar" style="width: 100%;">👥 Gestionar clientes</button>
                    </div>
                </div>`;
        } else if (paso === 2) {
            html = `<div style="text-align: center; padding: 15px;">
                        <h4 style="color: #f3a022; margin-bottom: 15px;">📋 PASO 2 DE 3</h4>
                        <p style="margin-bottom: 20px;">¿Cuánto tiempo dedicas a tareas manuales?</p>
                        <button onclick="responderDemo1('mucho')" class="btn-cotizar" style="width: 100%;">🔥 Más de 3 horas/día</button>
                        <button onclick="responderDemo1('medio')" class="btn-cotizar" style="width: 100%;">⏳ Entre 1 y 3 horas</button>
                    </div>`;
        } else {
            const diagnostico = respuestas.desafio === 'ventas' ? "🚀 Con IA aumentarías ventas un 40%" : "⏰ Ahorrarías 15h semanales";
            html = `<div style="text-align: center; padding: 20px;">
                        <h3 style="color: #f3a022;">✨ Resultado</h3>
                        <p style="margin: 20px 0;">${diagnostico}</p>
                        <a href="/#five" class="btn-cotizar" style="text-decoration:none;">📝 Solicitar asesoría</a>
                    </div>`;
        }
        demoDiv.innerHTML = html;
    }

    window.responderDemo1 = function(r) {
        if(paso === 1) respuestas.desafio = r;
        if(paso < 3) { paso++; renderPaso(); }
    };
    renderPaso();
}

// ============================================
// DEMO 2: AUTOMATIZACIÓN VISUAL
// ============================================
function runAutoDemo() {
    const demoDiv = document.querySelector('.demo-card.active .demo-content');
    if (!demoDiv) return;

    demoDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h4 style="color: #f3a022; margin-bottom: 15px;">⚙️ AUTOMATIZACIÓN</h4>
            <p style="margin-bottom: 25px;">Haz clic para ver cómo la IA gestiona una venta administrativa por ti.</p>
            <button onclick="ejecutarFlujo()" class="btn-cotizar">🛒 Simular Venta</button>
        </div>`;

    window.ejecutarFlujo = function() {
        demoDiv.innerHTML = `<div style="text-align:left; padding:10px; color:#f3a022;">⚡ Ejecutando: <br> 1. CRM ✅ <br> 2. Factura ✅ <br> 3. WhatsApp Bodega ✅ <br><br> <small style="color:white">¡Listo en 1.5 segundos!</small></div>`;
    };
}

// ============================================
// DEMO 3: CHAT IA (RESUMIDO)
// ============================================
function runChatDemo() {
    const demoDiv = document.querySelector('.demo-card.active .demo-content');
    if (!demoDiv) return;

    demoDiv.innerHTML = `
        <div style="padding:15px; background:rgba(0,0,0,0.3); border-radius:10px;">
            <p style="color:#f3a022; font-size:0.8rem;">🤖 Chat en vivo habilitado</p>
            <div id="chat-box" style="height:150px; overflow-y:auto; margin:10px 0; font-size:0.9rem;">
                <p>IA: Hola, ¿en qué puedo ayudarte hoy?</p>
            </div>
            <input type="text" placeholder="Pregunta algo..." style="width:100%; padding:10px; background:#111; border:1px solid #333; color:white;">
        </div>`;
}

// ============================================
// DEMO 4 & 5: DASHBOARD Y SORT (STUBS)
// ============================================
function runDashDemo() { runAutoDemo(); }
function runSortDemo() { runAutoDemo(); }

// ============================================
// DEMO 6: SELECTOR DE TIENDAS (EL QUE FALLABA)
// ============================================
function runTiendaDemo() {
    // Buscamos el contenedor dentro de la tarjeta que está activa actualmente
    const container = document.querySelector('.demo-card.active .demo-content');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h4 style="color: #f3a022; margin-bottom: 15px; font-family: 'Playfair Display', serif;">Seleccione un modelo de negocio</h4>
            <p style="font-size: 0.9rem; color: #ccc; margin-bottom: 25px;">
                Explore cómo la IA gestiona ventas y pedidos en tiempo real.
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <a href="/sushi" class="button fit" style="background: #f3a022; color: #1a1a1a; font-weight: bold; border: none;">
                   🍣 Tienda de Sushi (Ventas)
                </a>
                <a href="/ferreteria" class="button fit" style="border: 2px solid #00d1ff; color: #00d1ff; font-weight: bold; background: transparent;">
                   🛠️ Ferretería (Inventario)
                </a>
                <a href="/turismo" class="button fit" style="border: 2px solid #c9a84c; color: #c9a84c; font-weight: bold; background: transparent;">
                   🏔️ Turismo Premium (Reservas)
                </a>
            </div>
        </div>
    `;
}

// ============================================
// MODO FOCUS (SISTEMA DE VENTANAS)
// ============================================
let activeDemoCard = null;

function focusOnDemo(demoCard, demoFunction) {
    if (activeDemoCard) exitFocusMode();

    demoCard.classList.add('active');
    activeDemoCard = demoCard;
    document.body.classList.add('focus-mode');

    // Limpiar contenido previo y ejecutar la función de la demo
    const preview = demoCard.querySelector('.demo-content');
    if (preview) preview.innerHTML = '';
    
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

// Cerrar con Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') exitFocusMode();
});

// Exportar funciones al objeto window para que los botones HTML las vean
window.runDataDemo = runDataDemo;
window.runAutoDemo = runAutoDemo;
window.runChatDemo = runChatDemo;
window.runDashDemo = runDashDemo;
window.runSortDemo = runSortDemo;
window.runTiendaDemo = runTiendaDemo;
window.exitFocusMode = exitFocusMode;