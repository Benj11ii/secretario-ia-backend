// assets/js/demos.js - VERSIÓN COMPLETA CON 4 DEMOS

// ============================================
// DEMO 1: ORDENAR DATOS
// ============================================
function runDataDemo() {
    console.log("✅ Demo 1 ejecutándose");
    
    const demoDiv = document.getElementById('demo-data');
    if (!demoDiv) {
        console.error("❌ No se encontró el elemento demo-data");
        return;
    }

    demoDiv.innerHTML = '<p style="color: #f3a022; text-align: center;">⏳ Ordenando datos con IA...</p>';
    
    setTimeout(() => {
        const datosDesordenados = [
            { producto: 'Marraqueta', cantidad: 120, venta: 60000 },
            { producto: 'Hallulla', cantidad: 85, venta: 42500 },
            { producto: 'Pan Molde', cantidad: 45, venta: 33750 },
            { producto: 'Dulce Leche', cantidad: 60, venta: 45000 },
        ];

        const datosOrdenados = [...datosDesordenados].sort((a, b) => b.cantidad - a.cantidad);

        let tablaHTML = `
            <style>
                .demo-tabla {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }
                .demo-tabla th {
                    background: rgba(243, 160, 34, 0.2);
                    color: #f3a022;
                    padding: 8px;
                    text-align: center;
                    font-weight: bold;
                    border-bottom: 2px solid #f3a022;
                }
                .demo-tabla td {
                    padding: 6px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .demo-tabla tr:last-child td {
                    border-bottom: none;
                }
                .demo-tabla tr:hover td {
                    background: rgba(243, 160, 34, 0.1);
                }
            </style>
            <table class="demo-tabla">
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Venta</th>
                </tr>
        `;

        datosOrdenados.forEach(item => {
            tablaHTML += `
                <tr>
                    <td>${item.producto}</td>
                    <td><strong>${item.cantidad}</strong> uds</td>
                    <td>$${item.venta.toLocaleString('es-CL')}</td>
                </tr>
            `;
        });
        
        tablaHTML += '</table>';
        tablaHTML += '<p style="text-align:center; margin-top:10px; color:#aaa; font-size:0.8rem;">✅ Ordenado por producto más vendido</p>';

        demoDiv.style.transition = 'opacity 0.3s';
        demoDiv.style.opacity = '0';
        
        setTimeout(() => {
            demoDiv.innerHTML = tablaHTML;
            demoDiv.style.opacity = '1';
        }, 150);
        
    }, 600);
}

// ============================================
// DEMO 2: AUTOMATIZACIÓN
// ============================================
function runAutoDemo() {
    console.log("✅ Demo 2 ejecutándose");
    
    const demoDiv = document.getElementById('demo-auto');
    if (!demoDiv) {
        console.error("❌ No se encontró el elemento demo-auto");
        return;
    }

    demoDiv.innerHTML = '<p style="color: #f3a022; text-align: center;">⏳ Ejecutando automatización...</p>';
    
    setTimeout(() => {
        demoDiv.innerHTML = `
            <div style="text-align: left; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <p style="color: #4CAF50; margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">✅</span> Correo de confirmación enviado
                </p>
                <p style="color: #4CAF50; margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">✅</span> Cliente añadido a base de datos
                </p>
                <p style="color: #4CAF50; margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">✅</span> Notificación enviada a Telegram
                </p>
                <p style="color: #f3a022; margin: 8px 0; font-size:0.8rem; text-align:center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    ⚡ 3 acciones automáticas en 1 clic
                </p>
            </div>
        `;
    }, 800);
}

// ============================================
// DEMO 3: ASISTENTE IA (CHAT)
// ============================================
function runChatDemo() {
    console.log("✅ Demo 3 ejecutándose");
    
    const demoDiv = document.getElementById('demo-chat');
    if (!demoDiv) return;

    demoDiv.innerHTML = `
        <div style="width:100%; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px;">
            <div id="chat-messages" style="height: 120px; overflow-y: auto; margin-bottom: 10px; padding: 8px; background: rgba(0,0,0,0.4); border-radius: 8px; border: 1px solid #f3a02230;">
                <p style="margin:2px 0;"><strong style="color:#f3a022;">🤖 Bot:</strong> ¡Hola! Pregúntame por horarios o precios.</p>
            </div>
            <div style="display: flex; gap: 5px;">
                <input type="text" id="chat-input" placeholder="Escribe algo..." 
                    style="flex:1; padding: 8px; background: rgba(0,0,0,0.5); color: white; border: 1px solid #f3a02250; border-radius: 4px;">
                <button onclick="sendChatMessage()" style="padding: 8px 15px; background: #f3a022; color: black; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Enviar</button>
            </div>
        </div>
    `;
    
    window.sendChatMessage = function() {
        const input = document.getElementById('chat-input');
        const msgDiv = document.getElementById('chat-messages');
        
        if (input.value.trim() !== '') {
            msgDiv.innerHTML += `<p style="margin:2px 0;"><strong style="color:white;">👤 Tú:</strong> ${input.value}</p>`;
            
            let respuesta = "Entendido. Un asesor te contactará a la brevedad.";
            const texto = input.value.toLowerCase();
            
            if (texto.includes('horario')) respuesta = "🕒 Nuestro horario es de 9 a 18 hrs, de lunes a viernes.";
            else if (texto.includes('precio') || texto.includes('costo')) respuesta = "💰 Los planes parten en $50.000 mensuales. ¿Te gustaría una cotización?";
            else if (texto.includes('hola') || texto.includes('buenos días')) respuesta = "👋 ¡Hola! ¿En qué puedo ayudarte hoy?";
            else if (texto.includes('gracias')) respuesta = "😊 ¡A ti por contactarnos!";
            else if (texto.includes('servicio')) respuesta = "🔧 Automatización, datos, chatbots, integraciones y más. ¿Qué necesitas?";
            
            setTimeout(() => {
                msgDiv.innerHTML += `<p style="margin:2px 0;"><strong style="color:#f3a022;">🤖 Bot:</strong> ${respuesta}</p>`;
                msgDiv.scrollTop = msgDiv.scrollHeight;
            }, 300);
            
            input.value = '';
            msgDiv.scrollTop = msgDiv.scrollHeight;
        }
    };
}

// ============================================
// DEMO 4: DATOS QUE HABLAN (DASHBOARD)
// ============================================
function runDashDemo() {
    console.log("✅ Demo 4 ejecutándose");
    
    const demoDiv = document.getElementById('demo-dash');
    if (!demoDiv) return;

    demoDiv.innerHTML = '<p style="color: #f3a022; text-align: center;">⏳ Actualizando dashboard en tiempo real...</p>';
    
    setTimeout(() => {
        // Generar datos aleatorios realistas
        const ventas = Math.floor(Math.random() * 200) + 80;
        const clientes = Math.floor(Math.random() * 40) + 15;
        const productos = ['Marraqueta', 'Hallulla', 'Pan Molde', 'Dulce Leche', 'Pan Amasado'];
        const topProducto = productos[Math.floor(Math.random() * productos.length)];
        const crecimiento = Math.floor(Math.random() * 35) + 5;
        const ticketPromedio = Math.floor(Math.random() * 1500) + 800;

        demoDiv.innerHTML = `
            <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="background: rgba(243,160,34,0.15); padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="color:#aaa; font-size:0.75rem; margin-bottom: 5px;">💰 VENTAS HOY</div>
                        <div style="font-size: 2rem; color:#f3a022; font-weight: bold;">$${ventas}k</div>
                        <div style="color:#4CAF50; font-size:0.7rem; margin-top: 5px;">⬆️ +${crecimiento}%</div>
                    </div>
                    <div style="background: rgba(243,160,34,0.15); padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="color:#aaa; font-size:0.75rem; margin-bottom: 5px;">👥 CLIENTES HOY</div>
                        <div style="font-size: 2rem; color:#f3a022; font-weight: bold;">${clientes}</div>
                        <div style="color:#4CAF50; font-size:0.7rem; margin-top: 5px;">⬆️ +3 nuevos</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                        <div style="color:#aaa; font-size:0.7rem;">🏆 PRODUCTO TOP</div>
                        <div style="color:white; font-size:1.1rem; font-weight: bold;">${topProducto}</div>
                        <div style="color:#f3a022; font-size:0.8rem;">${Math.floor(Math.random()*30)+40} unidades</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                        <div style="color:#aaa; font-size:0.7rem;">🛒 TICKET PROMEDIO</div>
                        <div style="color:white; font-size:1.1rem; font-weight: bold;">$${ticketPromedio}</div>
                        <div style="color:#f3a022; font-size:0.8rem;">por venta</div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; text-align: center; padding: 8px; background: rgba(76, 175, 80, 0.1); border-radius: 8px;">
                    <span style="color: #4CAF50; font-size:0.8rem;">✨ Datos actualizados al ${new Date().toLocaleTimeString('es-CL')}</span>
                </div>
            </div>
        `;
    }, 500);
}

// ============================================
// VERIFICACIÓN DE CARGA
// ============================================
console.log("🚀 demos.js cargado correctamente");
console.log("✅ Funciones disponibles:", {
    data: typeof runDataDemo,
    auto: typeof runAutoDemo,
    chat: typeof runChatDemo,
    dash: typeof runDashDemo
});

// Hacer las funciones globales explícitamente
window.runDataDemo = runDataDemo;
window.runAutoDemo = runAutoDemo;
window.runChatDemo = runChatDemo;
window.runDashDemo = runDashDemo;