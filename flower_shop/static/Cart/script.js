document.addEventListener('DOMContentLoaded', function () {
    updateCartItemCount();
    const dropdownOrders = document.querySelectorAll('.dropdown-order');

    // Отримуємо елементи DOM для обрахунку суми
    const subtotalAmountElement = document.getElementById('subtotalAmount');
    const shippingAmountElement = document.querySelector('.shipping p:last-child');
    const totalAmountElement = document.getElementById('totalAmount');

    dropdownOrders.forEach(function (dropdownOrder, index) {
        const orderInfo = dropdownOrder.querySelector('.order-info');
        const orderStep = dropdownOrder.querySelector('.orderstep');

        orderStep.addEventListener('click', function () {
            dropdownOrders.forEach(function (item) {
                const info = item.querySelector('.order-info');
                if (item !== dropdownOrder) {
                    info.style.display = 'none';
                }
            });
            if (orderInfo.style.display === 'none' || orderInfo.style.display === '') {
                orderInfo.style.display = 'flex';
            } else {
                orderInfo.style.display = 'none';
            }
        });

        if (index < 2) {
            const nextOrderStep = dropdownOrders[index + 1].querySelector('.orderstep');
            const nextOrderInfo = dropdownOrders[index + 1].querySelector('.order-info');

            orderInfo.querySelector('button').addEventListener('click', function () {
                orderInfo.style.display = 'none';
                nextOrderInfo.style.display = 'flex';
            });
        }
    });

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    displayCartItemsOnCartPage();

    function displayCartItemsOnCartPage() {
        cartItemsContainer.innerHTML = '';

        const itemCountMap = {};

        cartItems.forEach(item => {
            if (itemCountMap[item.name]) {
                itemCountMap[item.name].quantity += item.quantity;
            } else {
                itemCountMap[item.name] = { ...item, quantity: item.quantity };
            }
        });

        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.totalPrice * item.quantity;
        });
        const shipping = 2 + 0.02 * subtotal;
        const total = subtotal + shipping;

        subtotalAmountElement.textContent = '$' + subtotal.toFixed(2);
        shippingAmountElement.textContent = '$' + shipping.toFixed(2);
        totalAmountElement.textContent = '$' + total.toFixed(2);

        Object.values(itemCountMap).forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const image = document.createElement('img');
            image.src = item.image;
            image.alt = item.name;

            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('product-info');

            const labalQuantityDiv = document.createElement('div');
            labalQuantityDiv.classList.add('labal-quantity');

            const nameLabel = document.createElement('h3');
            nameLabel.textContent = item.name;

            const quantityLabel = document.createElement('p');
            quantityLabel.textContent = `Quantity: ${item.quantity}`;

            const priceDeleteDiv = document.createElement('div');
            priceDeleteDiv.classList.add('price-delete');

            const priceLabel = document.createElement('p');
            priceLabel.classList.add('price');
            priceLabel.textContent = '$' + item.totalPrice;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function() {
                cartItems = cartItems.filter(cartItem => cartItem.name !== item.name);
                displayCartItemsOnCartPage();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            });

            labalQuantityDiv.appendChild(nameLabel);
            labalQuantityDiv.appendChild(quantityLabel);

            priceDeleteDiv.appendChild(priceLabel);
            priceDeleteDiv.appendChild(deleteButton);

            productInfoDiv.appendChild(labalQuantityDiv);
            productInfoDiv.appendChild(priceDeleteDiv);

            productDiv.appendChild(image);
            productDiv.appendChild(productInfoDiv);

            cartItemsContainer.appendChild(productDiv);
        });
    }

    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const emailInput = document.getElementById('emailInput');
    const nameInput = document.getElementById('nameInput');
    const phoneInput = document.getElementById('phoneInput');
    const recipientName = document.getElementById('recipientNameInput').value;
    const recipientPhone = document.getElementById('recipientPhoneInput').value;
    const deliveryDate = document.getElementById('deliveryDateInput').value;
    const deliveryTime = document.getElementById('deliveryTimeInput').value;
    const street = document.getElementById('streetInput').value;
    const apartment = document.getElementById('apartmentInput').value;
    const cardNumberInput = document.getElementById('cardNumberInput');
    const expiryDateInput = document.getElementById('expiryDateInput');
    const cvvInput = document.getElementById('cvvInput');

    submitOrderBtn.addEventListener('click', async function () {
        if (cardNumberInput.value.trim() === '' || expiryDateInput.value.trim() === '' || cvvInput.value.trim() === '') {
            alert('Please fill in all required fields.');
            return;
        }
        const email = emailInput.value;
        const name = nameInput.value;
        const phone = phoneInput.value;
        const recipientName = recipientNameInput.value;
        const recipientPhone = recipientPhoneInput.value;
        const deliveryDate = deliveryDateInput.value;
        const deliveryTime = deliveryTimeInput.value;
        const street = streetInput.value;
        const apartment = apartmentInput.value;
        const subtotal = parseFloat(subtotalAmountElement.textContent.replace('$', ''));
        const shipping = parseFloat(shippingAmountElement.textContent.replace('$', ''));
        const total = parseFloat(totalAmountElement.textContent.replace('$', ''));

        const data = {
            email: email,
            name: name,
            phone: phone,
            recipientName: recipientName,
            recipientPhone: recipientPhone,
            deliveryDate: deliveryDate,
            deliveryTime: deliveryTime,
            street: street,
            apartment: apartment,
            cartItems: JSON.stringify(cartItems),
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            cardNumber: cardNumberInput.value.trim(),
            expiryDate: expiryDateInput.value.trim(),
            cvv: cvvInput.value.trim()
        };

        try {
            const response = await fetch('/submitOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.success) {
                alert('Order submitted successfully!');
                emailInput.value = '';
                nameInput.value = '';
                phoneInput.value = '';
                recipientNameInput.value = '';
                recipientPhoneInput.value = '';
                deliveryDateInput.value = '';
                deliveryTimeInput.value = '';
                streetInput.value = '';
                apartmentInput.value = '';
                cardNumberInput.value = '';
                expiryDateInput.value = '';
                cvvInput.value = '';
                cartItems = [];
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                displayCartItemsOnCartPage();
            } else {
                alert('Failed to submit order. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again later.');
        }
    });
});
// Функція для оновлення кількості товарів у кошику
function updateCartItemCount() {
    const cartItemCountSpan = document.getElementById('cartItemCount');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let currentItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartItemCountSpan.textContent = currentItemCount;
}
