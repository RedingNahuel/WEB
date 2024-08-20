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

    // Cargar productos desde el JSON
    fetch('../json/termos.json')
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
                    <img src="${product.imagen}" alt="${product.nombre}">
                    <h2>${product.nombre}</h2>
                    <p class="price">$${product.precio.toFixed(2)}</p>
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
                        price: product.precio,
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
