document.addEventListener('DOMContentLoaded', () => {
    const cart = document.getElementById('cart');
    const cartButton = document.getElementById('cart-button');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCheckoutButton = document.getElementById('cart-checkout');
    const whatsappNumber = '543433352957';

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

    // Cargar productos desde el JSON
    fetch('../data/productos.json')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.querySelector('.products');
            data.forEach(product => {
                const productElement = `
                    <div class="product-item">
                        <img src="${product.imagen}" alt="${product.nombre}">
                        <h2>${product.nombre}</h2>
                        <p>Precio: <span class="old-price">$${product.precioViejo}</span> <span class="new-price">$${product.precioNuevo}</span></p>
                        <p>${product.cuotas}</p>
                        <p>${product.descuento}</p>
                        <button class="buy-button" data-nombre="${product.nombre}" data-precio="${product.precioNuevo}" data-imagen="${product.imagen}">Comprar</button>
                    </div>
                `;
                productsContainer.innerHTML += productElement;
            });

            // Volver a vincular los botones de "Comprar" después de cargar los productos
            document.querySelectorAll('.buy-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productCard = e.target.closest('.product-item');
                    const product = {
                        name: productCard.querySelector('h2').innerText,
                        price: parseFloat(productCard.querySelector('.new-price').innerText.replace('$', '')),
                        image: productCard.querySelector('img').src
                    };
                    addToCart(product);
                });
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    // Renderizar los productos del carrito al cargar la página
    renderCartItems();
});
