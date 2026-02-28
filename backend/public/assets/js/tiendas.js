// assets/js/tiendas.js - VERSIÓN SEGURA Y A PRUEBA DE FALLOS

// ==========================================
// CONFIGURACIÓN Y DATOS
// ==========================================
// URL de tu Google Apps Script
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxO6j-I6dCSp361U2IQrb8kr5EWPXRTL8tt9ulLK44utC7KiZIOHI2InjutpbLidls5/exec"; 
let productoSeleccionado = "";

const demosConfig = {
    sushi: { 
        title: "Sakura Sushi IA", color: "#00ff88", 
        items: [
            { n: "California Roll", d: "Cangrejo, palta y sésamo" },
            { n: "Sake Maki", d: "Salmón fresco y queso crema" },
            { n: "Ebi Tempura", d: "Camarón frito crocante" },
            { n: "Handroll Mix", d: "Ideal para comer al paso" }
        ],
        imgBase: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80"
    },
    ferreteria: { 
        title: "Ferretería Industrial IA", color: "#00d1ff", 
        items: [
            { n: "Taladro Percutor 18V", d: "Stock: 12 unid." },
            { n: "Set Herramientas 100pcs", d: "Stock: 5 unid." },
            { n: "Esmeril Angular 4 1/2", d: "Stock: 8 unid." },
            { n: "Sierra Circular Pro", d: "Stock: 3 unid." }
        ],
        imgBase: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80"
    },
    pasteleria: { 
        title: "Dulce Tentación IA", color: "#f3a022", 
        items: [
            { n: "Torta Frutos Bosque", d: "Artesanal" },
            { n: "Cheesecake Naranja", d: "Premium" },
            { n: "Macarons Selección", d: "Caja 12 unid." },
            { n: "Mousse Chocolate", d: "Intenso" }
        ],
        imgBase: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80"
    }
};

// ==========================================
// GESTIÓN DE TEMAS
// ==========================================
function setPalette(theme) {
    let color = "#00ff88"; 
    $('body').removeClass('theme-neon theme-azul theme-neon-claro theme-pastel');
    $('body').addClass('theme-' + theme);

    if (theme === 'azul') color = "#00d1ff"; 
    else if (theme === 'pastel') color = "#d81b60"; 
    else if (theme === 'neon-claro') color = "#008f39"; 

    document.documentElement.style.setProperty('--accent', color);
}

// ==========================================
// CARGA DE PRODUCTOS (CON SEGURO ANTI-FALLOS)
// ==========================================
function cargarDemo(tipo) {
    try {
        console.log("Intentando cargar demo:", tipo);
        const data = demosConfig[tipo];
        
        if (!data) {
            console.error("No se encontró la configuración para:", tipo);
            return;
        }

        // Si existen estos elementos, los actualiza (si no, no pasa nada)
        if ($('#tipo-demo').length) $('#tipo-demo').text(`Demo: ${data.title}`);
        if ($('#demo-title').length) $('#demo-title').text(data.title);
        
        document.documentElement.style.setProperty('--accent', data.color);
        $('body').removeClass('theme-neon theme-azul theme-neon-claro theme-pastel');

        let htmlProductos = '';
        for (let i = 0; i < 10; i++) {
            const item = data.items[i % data.items.length];
            const precio = `$${Math.floor(Math.random() * 15000 + 3000).toLocaleString('es-CL')}`;
            const randomSeed = Math.floor(Math.random() * 1000);
            const imgUrl = `${data.imgBase}&sig=${randomSeed}`;
            
            htmlProductos += `
                <div class="product-card" style="opacity: 1 !important; transform: none !important;">
                    <div class="card-image-container">
                        <img src="${imgUrl}" alt="${item.n}" style="width:100%; height:220px; object-fit:cover;">
                    </div>
                    <div class="product-info">
                        <h4>${item.n}</h4>
                        <p>${item.d}</p>
                        <span class="price">${precio}</span>
                        <button class="btn-add" onclick="abrirCaptura('${item.n}')">AGREGAR</button>
                    </div>
                </div>
            `;
        }

        console.log("Insertando productos en el DOM...");
        $('#contenedor-productos').html(htmlProductos);
        console.log("Carga exitosa.");

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

function abrirCaptura(nombreProducto) {
    productoSeleccionado = nombreProducto;
    $('#modal-lead').fadeIn().css("display", "flex"); 
}

// ==========================================
// LÓGICA DE CAPTURA DE LEADS (GOOGLE SHEETS)
// ==========================================
function enviarWhatsApp() {
    const phone = $('#user-phone').val().trim();
    
    if(phone.length < 8) { 
        alert("Por favor, ingrese un número de WhatsApp válido."); 
        return; 
    }
    
    const btn = $('.btn-order');
    const btnOriginalText = btn.html();
    btn.html('<i class="fas fa-spinner fa-spin"></i> Procesando...').prop('disabled', true);

    // Si no existe #demo-title, mandamos "Sakura Sushi" por defecto
    let origen = "Sakura Sushi";
    if ($('#demo-title').length > 0) {
        origen = $('#demo-title').text();
    }

    const payload = {
        fecha: new Date().toLocaleString(),
        telefono: phone,
        producto: productoSeleccionado,
        demo_origen: origen
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        $('.modal-content').html(`
            <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--accent); margin-bottom: 20px; display:block;"></i>
            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom:15px;">¡Solicitud Recibida!</h3>
            <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.6;">
                Hemos registrado tu interés en nuestro sistema.<br><br>
                Te contactaremos a la brevedad por WhatsApp (<b>${phone}</b>) para enviarte tu prueba de demostración gratuita.
            </p>
            <button class="btn-add" onclick="$('#modal-lead').fadeOut(); setTimeout(() => location.reload(), 500);">Aceptar y Cerrar</button>
        `);
    })
    .catch(err => {
        console.error("Error conectando al backend:", err);
        alert("Hubo un error de conexión, pero tu prueba ha sido registrada.");
        btn.html(btnOriginalText).prop('disabled', false);
    });
}

// ==========================================
// INICIALIZACIÓN CORREGIDA PARA FLASK
// ==========================================
$(document).ready(function() {
    // Obtenemos la ruta actual para saber qué demo cargar
    const path = window.location.pathname;
    
    if (path.includes('sushi')) {
        cargarDemo('sushi');
    } else if (path.includes('ferreteria')) {
        cargarDemo('ferreteria');
    } else if (path.includes('turismo')) {
        // Mapeamos 'turismo' al objeto 'pasteleria' o crea uno nuevo de turismo
        cargarDemo('pasteleria'); 
    }
});