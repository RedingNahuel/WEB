document.addEventListener('DOMContentLoaded', () => {
    const cart = document.getElementById('cart');
    const cartButton = document.getElementById('cart-button');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCheckoutButton = document.getElementById('cart-checkout');
    const whatsappNumber = '3413162692';

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
        updateCartTotal();

        // Agregar funcionalidad de eliminar item del carrito
        item.querySelector('.cart-item-remove').addEventListener('click', () => {
            item.remove();
            updateCartTotal();
        });
    }

    // Actualizar el total del carrito
    function updateCartTotal() {
        let total = 0;
        const items = cartItems.getElementsByClassName('cart-item');
        for (let item of items) {
            const price = parseFloat(item.children[1].children[1].innerText.replace('$', ''));
            total += price;
        }
        cartSubtotal.innerText = `$${total.toFixed(2)}`;
    }

    // Vincular botones de "Comprar"
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                name: productCard.getAttribute('data-nombre'),
                price: parseFloat(productCard.getAttribute('data-precio')),
                image: productCard.getAttribute('data-imagen')
            };
            addToCart(product);
        });
    });

    // Generar enlace de WhatsApp y redirigir
    cartCheckoutButton.addEventListener('click', () => {
        const items = cartItems.getElementsByClassName('cart-item');
        let message = 'Hola, me gustaría comprar los siguientes productos:\n\n';
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
});
