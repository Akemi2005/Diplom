document.addEventListener('DOMContentLoaded', function () {
    const productsSection = document.getElementById('productsSection');
    const cartItemCountSpan = document.getElementById('cartItemCount');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                displayProducts(data.products);
            } else {
                console.error('Помилка завантаження даних:', xhr.status);
            }
        }
    };
    xhr.open('GET', productsURL);
    xhr.send();

    function displayProducts(products) {
        productsSection.innerHTML = '';
        for (let i = 0; i < products.length; i += 2) {
            const product1 = products[i];
            const product2 = products[i + 1];

            const productCard1 = createProductCard(product1);
            const productCard2 = product2 ? createProductCard(product2) : '';

            const contentCard = document.createElement('div');
            contentCard.classList.add('content-card-categor');
            contentCard.innerHTML = productCard1 + productCard2;

            productsSection.appendChild(contentCard);
        }

        const productCards = document.querySelectorAll('.card-item-categor');
        productCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const quantity = prompt('Введіть бажану кількість товару:', '1');
                if (quantity !== null) {
                    const parsedQuantity = parseInt(quantity);
                    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
                        const productName = products[index].name;
                        const totalPrice = products[index].price * parsedQuantity;
                        addToCart(productName, parsedQuantity, totalPrice, products[index].image); // Додавання виклику addToCart з URL зображення
                    } else {
                        alert('Будь ласка, введіть дійсне число більше 0.');
                    }
                }
            });
        });
    }

    function createProductCard(product) {
        return `
            <div class="card-item-categor">
                <img src="${product.image}" alt="${product.name}">
                <div class="description">
                    <h6 class="category-title-categor">${product.name}</h6>
                    <p class="prise">price ${product.price}&#36;</p>
                </div>
            </div>
        `;
    }
    function addToCart(productName, quantity, totalPrice, imageUrl) {
        alert(`Ви успішно додали ${quantity} одиниць товару "${productName}" до кошика. Загальна вартість: ${totalPrice}$`);

        let currentItemCount = parseInt(cartItemCountSpan.textContent) || 0;
        currentItemCount += quantity;
        cartItemCountSpan.textContent = currentItemCount;

        cartItems.push({
            name: productName,
            quantity: quantity,
            totalPrice: totalPrice,
            image: imageUrl
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Відображення кількості товарів у кошику при завантаженні сторінки
    updateCartItemCount();
});

// Функція для оновлення кількості товарів у кошику
function updateCartItemCount() {
    const cartItemCountSpan = document.getElementById('cartItemCount');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let currentItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartItemCountSpan.textContent = currentItemCount;
}
