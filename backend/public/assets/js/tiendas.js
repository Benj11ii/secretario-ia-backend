// assets/js/tiendas.js - VERSIÓN FINAL PARA PRODUCCIÓN (UNIFICADA)

// ==========================================
// CONFIGURACIÓN Y DATOS
// ==========================================
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
    turismo: { // Cambiado de 'pasteleria' a 'turismo'
        title: "Turismo Premium IA", color: "#c9a84c", 
        items: [
            { n: "Esencial Araucanía", d: "Trekking y Termas" },
            { n: "Aventura Volcán", d: "Ascenso al Cráter" },
            { n: "Experiencia VIP", d: "Vuelo Panorámico" },
            { n: "Navegación Lago", d: "Tour Privado" }
        ],
        imgBase: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
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
// CARGA DE PRODUCTOS
// ==========================================
function cargarDemo(tipo) {
    try {
        const data = demosConfig[tipo];
        if (!data) return;

        // Actualizar elementos de texto si existen
        if ($('#tipo-demo').length) $('#tipo-demo').text(`Demo: ${data.title}`);
        if ($('#demo-title').length) $('#demo-title').text(data.title);
        
        document.documentElement.style.setProperty('--accent', data.color);

        let htmlProductos = '';
        for (let i = 0; i < 8; i++) { // Mostramos 8 productos
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
                </div>`;
        }
        $('#contenedor-productos').html(htmlProductos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function abrirCaptura(nombreProducto) {
    productoSeleccionado = nombreProducto;
    $('#modal-lead').fadeIn().css("display", "flex"); 
}

// ==========================================
// LÓGICA DE ENVÍO (GOOGLE SHEETS)
// ==========================================
function enviarWhatsApp() {
    const phone = $('#user-phone').val().trim();
    if(phone.length < 8) return alert("Por favor, ingrese un número válido."); 
    
    const btn = $('.btn-order');
    btn.html('<i class="fas fa-spinner fa-spin"></i> Procesando...').prop('disabled', true);

    const payload = {
        fecha: new Date().toLocaleString(),
        telefono: phone,
        producto: productoSeleccionado,
        demo_origen: $('#demo-title').text() || "Demo General"
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
            <h3>¡Solicitud Recibida!</h3>
            <p style="color: var(--text-muted); margin-bottom: 25px;">
                Te contactaremos a la brevedad por WhatsApp (<b>${phone}</b>).
            </p>
            <a href="https://www.iasesoria.cl/#five" target="_blank" class="btn-order" style="text-decoration:none;">Quiero esto para mi negocio</a>
            <button class="btn-add" style="margin-top:10px;" onclick="location.reload()">Cerrar</button>
        `);
    })
    .catch(err => {
        alert("Error de conexión.");
        btn.html('Reintentar').prop('disabled', false);
    });
}

// ==========================================
// INICIALIZACIÓN (ADAPTADA A FLASK)
// ==========================================
$(document).ready(function() {
    const path = window.location.pathname;
    
    if (path.includes('sushi')) {
        cargarDemo('sushi');
    } else if (path.includes('ferreteria')) {
        cargarDemo('ferreteria');
    } else if (path.includes('turismo')) {
        cargarDemo('turismo'); 
    }
});