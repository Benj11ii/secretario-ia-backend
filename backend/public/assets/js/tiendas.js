// assets/js/tiendas.js - VERSIÓN UNIFICADA Y LIMPIA

// ==========================================
// CONFIGURACIÓN Y DATOS
// ==========================================
const SERVER_URL = "http://127.0.0.1:5010/api/v1/tienda-contacto";; //
let productoSeleccionado = "";

const demosConfig = {
    sushi: { 
        title: "Sakura Sushi IA", 
        color: "#00ff88", 
        items: [
            { n: "California Roll", d: "Cangrejo, palta y sésamo" },
            { n: "Sake Maki", d: "Salmón fresco y queso crema" },
            { n: "Ebi Tempura", d: "Camarón frito crocante" },
            { n: "Handroll Mix", d: "Ideal para comer al paso" }
        ],
        imgBase: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80"
    },
    ferreteria: { 
        title: "Ferretería Industrial IA", 
        color: "#00d1ff", 
        items: [
            { n: "Taladro Percutor 18V", d: "Stock: 12 unid." },
            { n: "Set Herramientas 100pcs", d: "Stock: 5 unid." },
            { n: "Esmeril Angular 4 1/2", d: "Stock: 8 unid." },
            { n: "Sierra Circular Pro", d: "Stock: 3 unid." }
        ],
        imgBase: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80"
    },
    pasteleria: { 
        title: "Dulce Tentación IA", 
        color: "#f3a022", 
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
// LÓGICA DE GESTIÓN
// ==========================================

function setTheme(color) {
    document.documentElement.style.setProperty('--accent-color', color);
}

function cargarDemo(tipo) {
    const data = demosConfig[tipo];
    if (!data) return;

    // Actualizar textos y colores
    $('#tipo-demo').text(`Demo: ${data.title}`);
    $('#demo-title').text(data.title);
    setTheme(data.color);

    let htmlProductos = '';
    // Generar 9 productos basados en la configuración
    for (let i = 0; i < 9; i++) {
        const item = data.items[i % data.items.length];
        const precio = `$${(Math.random() * 15000 + 3000).toLocaleString('es-CL')}`;
        
        htmlProductos += `
            <div class="col-4 col-6-medium col-12-small">
                <div class="product-card" style="border-left: 4px solid var(--accent-color); background:#1a1a1a; border-radius:8px; padding:15px; text-align:center;">
                    <img src="${data.imgBase}&sig=${i}" style="width:100%; height:150px; object-fit:cover; border-radius:4px;">
                    <h4 style="margin:10px 0 5px 0;">${item.n}</h4>
                    <p style="font-size:0.8rem; opacity:0.7; margin:0;">${item.d}</p>
                    <p style="color: var(--accent-color); font-weight:bold; margin:5px 0;">${precio}</p>
                    <button class="button small fit" onclick="abrirCaptura('${item.n}')">Lo quiero</button>
                </div>
            </div>
        `;
    }
    $('#grid-productos').html(htmlProductos);
}

function abrirCaptura(nombreProducto) {
    productoSeleccionado = nombreProducto;
    $('#modal-lead').fadeIn(); // Asegúrese que el ID del modal sea 'modal-lead'
}

// ==========================================
// CONEXIÓN BACKEND (CELERON)
// ==========================================
function enviarWhatsApp() {
    const phone = $('#user-phone').val();
    if(!phone) { alert("Por favor, ingrese su número"); return; }
    
    // Mostramos estado de carga
    const btn = $('#modal-lead button');
    btn.text('Procesando...').prop('disabled', true);

    const payload = {
        producto: productoSeleccionado,
        telefono: phone,
        tipo_demo: $('#demo-title').text()
    };

    fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            window.open(data.whatsapp_url, '_blank');
            $('#modal-lead').fadeOut();
        } else {
            alert("Error al registrar lead.");
        }
    })
    .catch(err => {
        console.error("Error Celeron:", err);
        // Fallback
        const msg = `Interés en: ${productoSeleccionado}. Contacto: ${phone}`;
        window.open(`https://wa.me/56926870966?text=${encodeURIComponent(msg)}`, '_blank');
    })
    .finally(() => {
        btn.text('Continuar al WhatsApp').prop('disabled', false);
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
$(document).ready(function() {
    // Detectar tipo por URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo') || 'sushi';
    cargarDemo(tipo);
});

// Dentro de tiendas.js, actualice la parte donde se genera el HTML de los productos:
function cargarDemo(tipo) {
    const data = demosConfig[tipo];
    // ... logic ...
    htmlProductos += `
        <div class="product-card">
            <img src="${data.imgBase}&sig=${i}">
            <div class="product-info">
                <h4>${item.n}</h4>
                <span class="price">${precio}</span>
                <button class="btn-add" onclick="abrirCaptura('${item.n}')">AGREGAR AL PEDIDO</button>
            </div>
        </div>
    `;
    $('#contenedor-productos').html(htmlProductos);
}