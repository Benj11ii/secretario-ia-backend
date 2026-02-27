const demos = {
    sushi: { title: "Sushi Premium IA", color: "#00ff88", items: ["Roll Acevichado", "Handroll Salmón", "Nigiri Camarón"] },
    ferreteria: { title: "Inventario Ferretero", color: "#00d1ff", items: ["Taladro Percutor", "Set Destornilladores", "Sierra Circular"] },
    pasteleria: { title: "Pastelería Boutique", color: "#f3a022", items: ["Torta Amor", "Pie de Limón", "Muffin Arándano"] }
};

function setTheme(color) {
    document.documentElement.style.setProperty('--accent-color', color);
}

function cargarDemo(tipo) {
    const data = demos[tipo];
    $('#demo-title').text(data.title);
    setTheme(data.color);
    // Lógica para renderizar los 10 productos aquí...
}

function abrirCaptura(producto) {
    window.productoElegido = producto;
    $('#modal-whatsapp').fadeIn();
}

// Al cargar, por defecto sushi
$(document).ready(() => cargarDemo('sushi'));

// Lógica para detectar el tipo de demo desde la URL
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoSeleccionado = urlParams.get('tipo') || 'sushi'; // Sushi por defecto
    
    if (demos[tipoSeleccionado]) {
        cargarDemo(tipoSeleccionado);
    }
});

// Función mejorada para inyectar los 10 productos según el tipo
function cargarDemo(tipo) {
    const data = demos[tipo];
    $('#tipo-demo').text(`Demo: ${data.title}`);
    $('#demo-title').text(data.title);
    setTheme(data.color);

    let htmlProductos = '';
    // Generamos 10 tarjetas de producto simuladas
    for (let i = 1; i <= 10; i++) {
        htmlProductos += `
            <div class="col-4 col-6-medium col-12-small">
                <div class="product-card" style="border-left: 4px solid var(--accent-color);">
                    <h4>${data.items[i % data.items.length]} #${i}</h4>
                    <p>Precio: $${(Math.random() * 10000 + 2000).toLocaleString('es-CL')}</p>
                    <button class="button small fit" onclick="abrirCaptura('${data.items[i % data.items.length]}')">Lo quiero</button>
                </div>
            </div>
        `;
    }
    $('#grid-productos').html(htmlProductos);
}


// Configuración de la demo
const itemsSushi = [
    { nombre: "California Roll", desc: "Cangrejo, palta y sésamo" },
    { nombre: "Sake Maki", desc: "Salmón fresco y queso crema" },
    { nombre: "Ebi Tempura", desc: "Camarón frito crocante" },
    { nombre: "Handroll Mix", desc: "Ideal para comer al paso" }
];

let productoSeleccionado = "";

function setTheme(color) {
    document.documentElement.style.setProperty('--accent-color', color);
}

function initTienda() {
    let html = '';
    for (let i = 1; i <= 10; i++) {
        const item = itemsSushi[i % itemsSushi.length];
        // Imagen aleatoria de sushi de Unsplash
        const imgUrl = `https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80&sig=${i}`;
        
        html += `
            <div class="card-sushi">
                <img src="${imgUrl}" alt="Sushi">
                <div class="card-content">
                    <h4>${item.nombre} #${i}</h4>
                    <p style="font-size:0.8rem; opacity:0.7;">${item.desc}</p>
                    <div class="price">$${(Math.random() * 5000 + 3000).toLocaleString('es-CL')}</div>
                    <button class="button small fit" style="margin-top:15px;" onclick="prepararPedido('${item.nombre} #${i}')">Lo quiero</button>
                </div>
            </div>
        `;
    }
    $('#contenedor-sushi').html(html);
}

function prepararPedido(nombre) {
    productoSeleccionado = nombre;
    $('#modal-lead').css('display', 'flex');
}

function enviarWhatsApp() {
    const phone = $('#user-phone').val();
    if(!phone) { alert("Por favor, ingrese su número"); return; }
    
    const mensaje = encodeURIComponent(`¡Hola! Vengo de la demo de IAsesoria. Me interesa el producto: ${productoSeleccionado}. Mi número es ${phone}`);
    window.open(`https://wa.me/56926870966?text=${mensaje}`, '_blank');
}

$(document).ready(function() {
    setTheme('#00ff88'); // Verde por defecto
    initTienda();
});

// assets/js/tiendas.js

// Apuntamos al Celeron (puerto 5005)
const SERVER_URL = "http://su-ip-servidor:5010/api/v1/tienda-contacto"; 

function enviarWhatsApp() {
    const phone = $('#user-phone').val();
    if(!phone) { alert("Por favor, ingrese su número"); return; }
    
    // Mostramos un estado de carga en el botón
    const btn = $('#modal-lead button');
    btn.text('Procesando...').prop('disabled', true);

    const payload = {
        producto: productoSeleccionado, // Variable global definida al hacer click en "Lo quiero"
        telefono: phone,
        tipo_demo: document.title // Detecta si es Sushi, Ferretería o Pastelería
    };

    fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // El Celeron nos devuelve la URL ya armada
            window.open(data.whatsapp_url, '_blank');
            $('#modal-lead').fadeOut();
        }
    })
    .catch(err => {
        console.error("Error:", err);
        // Si el servicio 5005 llegara a estar caído, enviamos igual por WhatsApp (Fallback)
        const msg = `Interés en: ${productoSeleccionado}. Contacto: ${phone}`;
        window.open(`https://wa.me/56926870966?text=${encodeURIComponent(msg)}`, '_blank');
    })
    .finally(() => {
        btn.text('Continuar al WhatsApp').prop('disabled', false);
    });
}