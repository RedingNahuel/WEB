document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const productName = document.getElementById('product-name');
    const productPriceNew = document.getElementById('product-price-new');
    const productPriceOld = document.getElementById('product-price-old');
    const productInstallments = document.getElementById('product-installments');
    const productMainImage = document.getElementById('product-main-image');
    const addToCartButton = document.getElementById('add-to-cart-button');
    
    const cart = document.getElementById('cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartButton = document.getElementById('cart-button');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCheckoutButton = document.getElementById('cart-checkout');
    const whatsappNumber = '3413162692';

    // Mostrar carrito
    const toggleCart = (show) => {
        cart.style.transform = show ? 'translateX(0)' : 'translateX(100%)';
        cartOverlay.style.display = show ? 'block' : 'none';
    };
  // Cerrar carrito
  cartClose.addEventListener('click', () => {
    cart.style.transform = 'translateX(100%)';
});
    cartButton.addEventListener('click', () => toggleCart(true));
    cartClose.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    // Función para agregar productos al carrito
    function addToCart(product) {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="cart-item-image">
            <div class="cart-item-details">
                <p>${product.nombre}</p>
                <p>$${product.precioNuevo.toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" aria-label="Eliminar producto">&times;</button>
        `;
        cartItems.appendChild(item);
        updateCartTotal();

        // Agregar funcionalidad de eliminar item del carrito
        item.querySelector('.cart-item-remove').addEventListener('click', () => {
            item.remove();
            updateCartTotal();
        });
    }

    // Función para actualizar el total del carrito
    function updateCartTotal() {
        let total = 0;
        const items = cartItems.getElementsByClassName('cart-item');
        for (let item of items) {
            const price = parseFloat(item.children[1].children[1].innerText.replace('$', ''));
            total += price;
        }
        cartSubtotal.innerText = `$${total.toFixed(2)}`;
        cartSubtotal.setAttribute('aria-live', 'polite'); // Para accesibilidad
    }

    // Generar enlace de WhatsApp y redirigir
    cartCheckoutButton.addEventListener('click', () => {
        if (cartItems.children.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        let message = 'Hola, me gustaría comprar los siguientes productos:\n\n';
        const items = cartItems.getElementsByClassName('cart-item');
        for (let item of items) {
            const name = item.children[1].children[0].innerText;
            const price = item.children[1].children[1].innerText;
            const imageUrl = item.children[0].src;
            message += `${name} - ${price}\n${imageUrl}\n\n`;
        }
        const subtotal = cartSubtotal.innerText;
        message += `\nTotal: ${subtotal}\n\nGracias.`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Función para cargar los detalles del producto
    function loadProductDetails(product) {
        productName.innerText = product.nombre;
        productPriceNew.innerText = `$${product.precioNuevo.toFixed(2)}`;
        productPriceOld.innerText = product.precioViejo ? `$${product.precioViejo.toFixed(2)}` : '';
        productInstallments.innerText = product.cuotas;
        productMainImage.src = product.imagen;

        // Añadir producto al carrito
        addToCartButton.addEventListener('click', () => {
            addToCart(product);
        });
    }

    // Cargar detalles del producto desde el JSON
    fetch('../json/productos.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.id === parseInt(productId));
            if (product) {
                loadProductDetails(product);
            } else {
                console.error('Producto no encontrado');
            }
        })
        .catch(error => console.error('Error al cargar los detalles del producto:', error));
});