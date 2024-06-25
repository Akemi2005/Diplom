function clearCartItems() {
    localStorage.removeItem('cartItems');
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartItemCount();
    const dropdownOrders = document.querySelectorAll('.dropdown-order');

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
            subtotal += item.totalPrice;
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

    const order_id = generateOrderNumber();
    function generateOrderNumber() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        return `${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`;
    }

    submitOrderBtn.addEventListener('click', async function () {
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
            order_id: order_id,
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
                order_id.value = '';
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

    const totalAmount = parseFloat(totalAmountElement.textContent.replace('$', ''));

    const description = 'Оплата замовлення на сайті';

    const data = {
        version: 3,
        public_key: 'sandbox_i98137437047',
        action: 'pay',
        amount: totalAmount,
        currency: 'USD',
        description: description,
        order_id: order_id,
        result_url: `http://localhost:3000/static/Cart/order-confirmation.html?order_id=${order_id}`,
    };

    const requestData = base64_encode(JSON.stringify(data));
    const signature = generateSignature(requestData);

    const privatPayURL = `https://www.liqpay.ua/api/3/checkout`;
    const formPay = document.querySelector('.formPay');
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = privatPayURL;
    form.acceptCharset = 'utf-8';

    const dataInput = document.createElement('input');
    dataInput.type = 'hidden';
    dataInput.name = 'data';
    dataInput.value = requestData;

    const signatureInput = document.createElement('input');
    signatureInput.type = 'hidden';
    signatureInput.name = 'signature';
    signatureInput.value = signature;

    form.appendChild(dataInput);
    form.appendChild(signatureInput);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Pay with LiqPay';
    submitButton.type = 'submit';
    submitButton.classList.add('next');

    form.appendChild(submitButton);

    formPay.appendChild(form);

    submitButton.addEventListener('click', async function (event) {
        const inputs = document.querySelectorAll('input[type="text"]');
        const isAllFilled = Array.from(inputs).every(input => input.value.trim() !== '');

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;

        const inputDate = deliveryDateInput.value;
        const parts = inputDate.split('.');
        const inputDay = parseInt(parts[0], 10);
        const inputMonth = parseInt(parts[1], 10);
        const inputYear = currentDate.getFullYear();

        const deliveryTime = deliveryTimeInput.value;
        const [hours, minutes] = deliveryTime.split(':').map(Number);

        // Створюємо дату доставки з року, місяця, дня, години та хвилини
        const selectedDate = new Date(inputYear, inputMonth - 1, inputDay, hours, minutes);

        if (!isAllFilled) {
            alert('Please fill in all fields.');
            event.preventDefault();
            return;
        }
        if (cartItems.length === 0) {
            alert('Cart is empty. Please add items to cart before placing an order.');
            event.preventDefault();
            return;
        }
        if (selectedDate < currentDate) {
            alert('You have entered a past date or time. Please select a future date and time.');
            deliveryDateInput.value = '';
            deliveryTimeInput.value = '';
            event.preventDefault();
            return;
        }
        clearCartItems();
        submitOrderBtn.click();
    });

    function generateSignature(data) {
        const privateKey = 'sandbox_aXeCS7FocvdqaY0uVRXbkKjZZ82II9qtRp2GqoFO';
        const hash = CryptoJS.SHA1(privateKey + data + privateKey);
        return hash.toString(CryptoJS.enc.Base64);
    }

    function base64_encode(data) {
        const encodedData = encodeURIComponent(data).replace(/%([0-9A-F]{2})/g,
            (match, p1) => String.fromCharCode('0x' + p1));
        return btoa(encodedData);
    }

    const phoneTInput = document.getElementById('phoneInput');
    phoneTInput.addEventListener('keypress', (event) => {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    });

    const recipientPhoneInput = document.getElementById('recipientPhoneInput');
    recipientPhoneInput.addEventListener('keypress', (event) => {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    });

    async function handleLiqPayCallback(orderId, status) {
        try {
            const response = await fetch(`/updateOrderStatus/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const responseData = await response.json();
            if (responseData.success) {
                console.log('Order status updated successfully');
            } else {
                console.error('Failed to update order status:', responseData.message);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }

});

function updateCartItemCount() {
    const cartItemCountSpan = document.getElementById('cartItemCount');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let currentItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartItemCountSpan.textContent = currentItemCount;
}
