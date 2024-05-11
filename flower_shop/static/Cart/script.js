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
        const shipping = 5;
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

    submitOrderBtn.addEventListener('click', async function () {
        const inputs = document.querySelectorAll('input[type="text"]');
        const isAllFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        if (!isAllFilled) {
            alert('Please fill in all fields.');
            return;
        }
        if (cartItems.length === 0) {
            alert('Cart is empty. Please add items to cart before placing an order.');
            return;
        }

        const email = document.getElementById('emailInput').value;
        const name = document.getElementById('nameInput').value;
        const phone = document.getElementById('phoneInput').value;
        const recipientName = document.getElementById('recipientNameInput').value;
        const recipientPhone = document.getElementById('recipientPhoneInput').value;
        const deliveryDate = document.getElementById('deliveryDateInput').value;
        const deliveryTime = document.getElementById('deliveryTimeInput').value;
        const street = document.getElementById('streetInput').value;
        const apartment = document.getElementById('apartmentInput').value;
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
                cartItems = [];
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                displayCartItemsOnCartPage();
                location.reload();
            } else {
                alert('Failed to submit order. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again later.');
        }
    });

    function generateOrderNumber() {
        const now = new Date();

        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2); // Додаємо 0, якщо місяць менше 10
        const day = ('0' + now.getDate()).slice(-2); // Додаємо 0, якщо день менше 10
        const hours = ('0' + now.getHours()).slice(-2); // Додаємо 0, якщо година менше 10
        const minutes = ('0' + now.getMinutes()).slice(-2); // Додаємо 0, якщо хвилина менше 10
        const seconds = ('0' + now.getSeconds()).slice(-2); // Додаємо 0, якщо секунда менше 10
        const randomNum = Math.floor(Math.random() * 9000) + 1000;

        return `${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`;
    }

    const totalAmount = parseFloat(totalAmountElement.textContent.replace('$', ''));
    const description = 'Оплата замовлення на сайті';
    const orderNumber = generateOrderNumber();

    const data = {
        public_key: 'sandbox_i98137437047',
        version: 3,
        action: 'pay',
        amount: totalAmount,
        currency: 'USD',
        description: description,
        order_id: orderNumber,
        sandbox: 1
    };

    const requestData = encodeURIComponent(JSON.stringify(data));

    const signature = generateSignature(requestData);

    const privatPayURL = `https://www.liqpay.ua/api/3/checkout?data=${requestData}&signature=${signature}`; // Додайте підпис (signature)

    const privatPayButton = document.createElement('button');
    privatPayButton.textContent = 'Оплатити через PrivatPay';

    privatPayButton.addEventListener('click', function() {
        window.location.href = privatPayURL;
    });

    const orderButtonContainer = document.getElementById('orderButtonContainer');
    orderButtonContainer.appendChild(privatPayButton);

    function generateSignature(data) {
        const privateKey = 'sandbox_aXeCS7FocvdqaY0uVRXbkKjZZ82II9qtRp2GqoFO';
        const hash = CryptoJS.SHA256(privateKey + data + privateKey);
        return hash.toString(CryptoJS.enc.Hex);
    }

    console.log("Request Data:", requestData);
    console.log("Generated Signature:", signature);
    console.log("PrivatPay URL:", privatPayURL);
    console.log("Дані перед генерацією підпису:", data);
    console.log("Згенерований підпис:", signature);
});

function updateCartItemCount() {
    const cartItemCountSpan = document.getElementById('cartItemCount');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let currentItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartItemCountSpan.textContent = currentItemCount;
}
