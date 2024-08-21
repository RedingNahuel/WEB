document.addEventListener('DOMContentLoaded', () => {
    const cart = document.getElementById('cart');
    const cartButton = document.getElementById('cart-button');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCheckoutButton = document.getElementById('cart-checkout');
    const whatsappNumber = '3413162692';
    const productContainer = document.querySelector('.products');

    // Mostrar carrito
    cartButton.addEventListener('click', () => {
        cart.style.transform = 'translateX(0)';
    });

    // Cerrar carrito
    cartClose.addEventListener('click', () => {
        cart.style.transform = 'translateX(100%)';
    });

    // Función para agregar productos al carrito
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartTotal();
    }

    // Función para mostrar los productos del carrito
    function renderCartItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = ''; // Limpiar el contenido actual
        cart.forEach(product => {
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p>${product.name}</p>
                    <p>$${product.price.toFixed(2)}</p>
                </div>
                <button class="cart-item-remove">&times;</button>
            `;
            cartItems.appendChild(item);

            // Agregar funcionalidad de eliminar item del carrito
            item.querySelector('.cart-item-remove').addEventListener('click', () => {
                removeFromCart(product);
            });
        });
        updateCartTotal();
    }

    // Función para eliminar productos del carrito
    function removeFromCart(productToRemove) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.name !== productToRemove.name);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // Actualizar el total del carrito
    function updateCartTotal() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = cart.reduce((sum, product) => sum + product.price, 0);
        cartSubtotal.innerText = `$${total.toFixed(2)}`;
    }

    // Cargar productos desde el JSON
    fetch('../json/org.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-id', product.id);
                productCard.setAttribute('data-nombre', product.nombre);
                productCard.setAttribute('data-precio', product.precio);
                productCard.setAttribute('data-imagen', product.imagen);

                productCard.innerHTML = `
                    ${product.descuento ? `<div class="discount-badge">${product.descuento}</div>` : ''}
                    <img src="${product.imagen}" alt="${product.nombre}">
                    <h2>${product.nombre}</h2>
                    ${product.precioViejo ? `<p class="price-old">$${product.precioViejo.toFixed(2)}</p>` : ''}
                    <p class="price-new">$${product.precioNuevo ? product.precioNuevo.toFixed(2) : product.precio.toFixed(2)}</p>
                    <p class="installments">${product.cuotas}</p>
                    <div class="buttons">
                        <button class="buy-button">Comprar</button>
                        <button class="view-button" data-id="${product.id}">Ver</button>
                    </div>
                `;
                productContainer.appendChild(productCard);

                // Vincular el botón de "Comprar" a la función addToCart
                productCard.querySelector('.buy-button').addEventListener('click', () => {
                    addToCart({
                        name: product.nombre,
                        price: product.precioNuevo ? product.precioNuevo : product.precio,
                        image: product.imagen
                    });
                });

                // Vincular el botón de "Ver" a la redirección a la página de detalle del producto
                productCard.querySelector('.view-button').addEventListener('click', (event) => {
                    const productId = event.target.getAttribute('data-id');
                    window.location.href = `detalle_producto.html?id=${productId}`;
                });
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    // Generar enlace de WhatsApp y redirigir
    cartCheckoutButton.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let message = 'Hola, me gustaría comprar los siguientes productos:\n\n';
        cart.forEach(product => {
            message += `${product.name} - $${product.price.toFixed(2)}\n`;
        });
        const subtotal = cartSubtotal.innerText;
        message += `\nTotal: ${subtotal}\n\nGracias.`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Renderizar los productos del carrito al cargar la página
    renderCartItems();
});
