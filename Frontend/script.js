document.addEventListener('DOMContentLoaded', () => {
    initHelpButton();
    initCarrito();
    loadProductDetails();
    initQuantitySelectors();
    initAddToCart();
});

/**
 * Inicializa el botón de ayuda.
 */
function initHelpButton() {
    const helpButton = document.getElementById('help-button');
    const helpInfo = document.getElementById('help-info');
    helpButton.addEventListener('mouseover', () => helpInfo.style.display = 'block');
    helpButton.addEventListener('mouseout', () => helpInfo.style.display = 'none');
}

// Manejo del carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/**
 * Actualiza el carrito en el almacenamiento local y en la interfaz.
 */
function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarVistaPreviaCarrito();
}

/**
 * Muestra los elementos del carrito en el overlay.
 */
function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito-items');
    if (!carritoContainer) return; // Salir si no estamos en una página con el contenedor del carrito

    carritoContainer.innerHTML = '';
    let total = 0;

    carrito.forEach((producto, index) => {
        const carritoItem = document.createElement('div');
        carritoItem.classList.add('carrito-item');
        carritoItem.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="carrito-info">
                <p>${producto.nombre}</p>
                <p>${producto.cantidad} x $${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <button class="btn-remove" onclick="eliminarProducto(${index})">✖</button>
            </div>
        `;
        carritoContainer.appendChild(carritoItem);
        total += producto.precio * producto.cantidad;
    });

    const carritoTotal = document.getElementById('carrito-total');
    carritoTotal.textContent = total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const carritoOverlay = document.getElementById('carrito-overlay');
    carritoOverlay.style.display = 'block';
}

/**
 * Muestra una vista previa del carrito.
 */
function mostrarVistaPreviaCarrito() {
    const cartPreview = document.getElementById('cart-preview');
    if (!cartPreview) return;

    cartPreview.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const previewItem = document.createElement('div');
        previewItem.classList.add('preview-item');
        previewItem.innerHTML = `
            <p>${producto.nombre}</p>
            <p>$${(producto.precio * producto.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        `;
        cartPreview.appendChild(previewItem);
        total += producto.precio * producto.cantidad;
    });

    const previewTotal = document.createElement('div');
    previewTotal.classList.add('preview-total');
    previewTotal.innerHTML = `
        <p>Total: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <a href="#" class="btn-checkout" id="ver-carrito">Ver carrito</a>
    `;
    cartPreview.appendChild(previewTotal);

    document.getElementById('ver-carrito').addEventListener('click', mostrarCarrito);
}

/**
 * Elimina un producto del carrito por su índice.
 * @param {number} index - Índice del producto a eliminar.
 */
function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

/**
 * Inicializa la funcionalidad del carrito.
 */
function initCarrito() {
    const carritoClose = document.getElementById('carrito-close');
    carritoClose.addEventListener('click', () => {
        document.getElementById('carrito-overlay').style.display = 'none';
    });

    const cartButton = document.getElementById('cart-button');
    cartButton.addEventListener('mouseover', () => {
        mostrarVistaPreviaCarrito();
        document.getElementById('cart-preview').style.display = 'block';
    });

    cartButton.addEventListener('mouseout', () => {
        document.getElementById('cart-preview').style.display = 'none';
    });

    cartButton.addEventListener('click', mostrarCarrito);
}

/**
 * Carga los detalles del producto desde el archivo JSON.
 */
function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const producto = data.find(p => p.nombre === productId);
            if (producto) {
                displayProductDetails(producto);
            }
        })
        .catch(error => console.error('Error al cargar los detalles del producto:', error));
}

/**
 * Muestra los detalles del producto en la interfaz.
 * @param {Object} producto - Objeto del producto.
 */
function displayProductDetails(producto) {
    document.getElementById('product-name').textContent = producto.nombre;
    document.getElementById('main-image').src = producto.imagen;
    document.getElementById('original-price').textContent = producto.descuento ? `$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
    document.getElementById('discounted-price').textContent = producto.descuento 
        ? `$${(producto.precio - (producto.precio * (producto.descuento / 100))).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : `$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('installments').textContent = `${producto.cuotas} cuotas sin interés de $${producto.precio_cuota.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const thumbnailImages = document.getElementById('thumbnail-images');
    const imagenes = [producto.imagen, ...(producto.imagenes || [])]; // Asegurarse de que imagenes sea un array

    imagenes.forEach(imagen => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imagen;
        thumbnail.alt = producto.nombre;
        thumbnail.addEventListener('click', () => {
            document.getElementById('main-image').src = imagen;
        });
        thumbnailImages.appendChild(thumbnail);
    });
}

/**
 * Inicializa los selectores de cantidad.
 */
function initQuantitySelectors() {
    const decreaseButton = document.getElementById('decrease-quantity');
    const increaseButton = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity');

    decreaseButton.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseButton.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
}

/**
 * Inicializa la funcionalidad de agregar al carrito.
 */
function initAddToCart() {
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const productName = document.getElementById('product-name').textContent;
        const productImage = document.getElementById('main-image').src;
        const productPrice = parseFloat(document.getElementById('discounted-price').textContent.replace('$', '').replace('.', '').replace(',', '.'));

        const producto = {
            nombre: productName,
            precio: productPrice,
            imagen: productImage,
            cantidad: quantity
        };

        carrito.push(producto);
        actualizarCarrito();
        mostrarVistaPreviaCarrito();
    });
}
