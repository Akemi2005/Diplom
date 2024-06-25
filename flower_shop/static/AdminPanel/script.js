let currentOrderPage = 1;
let hasMoreOrderPages = true;

let currentSubscriptionPage = 1;
let hasMoreSubscriptionPages = true;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        sessionStorage.setItem('authenticated', 'true');
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        await loadOrders();
        await loadSubscriptions();
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    sessionStorage.removeItem('authenticated');
    document.getElementById('login-panel').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
}

async function loadOrders() {
    try {
        const response = await fetch(`/getOrders?page=${currentOrderPage}`);
        const orders = await response.json();
        displayOrders(orders);
        hasMoreOrderPages = orders.length > 0;
        document.getElementById('currentOrderPage').innerText = currentOrderPage;
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Error fetching orders. Please try again later.');
    }
}

async function loadSubscriptions() {
    try {
        const response = await fetch(`/getSubscriptions?page=${currentSubscriptionPage}`);
        const subscriptions = await response.json();
        displaySubscriptions(subscriptions);
        hasMoreSubscriptionPages = subscriptions.length > 0;
        document.getElementById('currentSubscriptionPage').innerText = currentSubscriptionPage;
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        alert('Error fetching subscriptions. Please try again later.');
    }
}
async function nextOrderPage() {
    if (hasMoreOrderPages) {
        currentOrderPage++;
        await loadOrders();
    }
}

async function prevOrderPage() {
    if (currentOrderPage > 1) {
        currentOrderPage--;
        await loadOrders();
    }
}

async function nextSubscriptionPage() {
    if (hasMoreSubscriptionPages) {
        currentSubscriptionPage++;
        await loadSubscriptions();
    }
}

async function prevSubscriptionPage() {
    if (currentSubscriptionPage > 1) {
        currentSubscriptionPage--;
        await loadSubscriptions();
    }
}


async function displayOrders(orders) {
    const ordersTableBody = document.getElementById('orders-table-body');
    ordersTableBody.innerHTML = '';

    orders.forEach(order => {
        const row = ordersTableBody.insertRow();

        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.name}</td>
            <td>${order.phone}</td>
            <td>${order.recipientName}</td>
            <td>${order.recipientPhone}</td>
            <td>${order.deliveryDate}</td>
            <td>${order.deliveryTime}</td>
            <td>${order.street}</td>
            <td>${order.apartment}</td>
            <td>
                <ul>
                    ${JSON.parse(order.cartItems).map(item => `
                        <li>
                            ${item.name}<br>
                            <strong>Quantity:</strong> ${item.quantity}<br>
                        </li>
                    `).join('')}
                </ul>
            </td>
            <td>$${order.subtotal.toFixed(2)}</td>
            <td>$${order.shipping.toFixed(2)}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="editOrder(${order.id})">Edit</button>
                <button onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        `;
    });
}

async function displaySubscriptions(subscriptions) {
    const subscriptionsTableBody = document.getElementById('subscriptions-table-body');
    subscriptionsTableBody.innerHTML = '';

    subscriptions.forEach(subscription => {
        const row = subscriptionsTableBody.insertRow();

        row.innerHTML = `
            <td>${subscription.id}</td>
            <td>${subscription.plan}</td>
            <td>${subscription.frequency}</td>
            <td>${subscription.deliveries}</td>
            <td>${subscription.email}</td>
            <td>${subscription.description}</td> 
            <td>
                <button onclick="editSubscription(${subscription.id})">Edit</button> 
                <button onclick="deleteSubscription(${subscription.id})">Delete</button> 
            </td>
        `;
    });
}

window.onload = async function() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (isAuthenticated === 'true') {
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        await loadOrders();
        await loadSubscriptions();
    }
};

let tab;
let tabContent;

function initTabs() {
    tabContent = document.getElementsByClassName('tabContent');
    tab = document.getElementsByClassName('tab');
    hideTabsContent(1);

    document.getElementById('tabs').addEventListener('click', function(event) {
        let target = event.target;
        if (target.classList.contains('tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    showTabsContent(i);
                    break;
                }
            }
        }
    });
}

function hideTabsContent(a) {
    for (let i = a; i < tabContent.length; i++) {
        tabContent[i].classList.remove('show');
        tabContent[i].classList.add('hide');
        tab[i].classList.remove('whiteborder');
    }
}

function showTabsContent(b) {
    if (tabContent[b].classList.contains('hide')) {
        hideTabsContent(0);
        tab[b].classList.add('whiteborder');
        tabContent[b].classList.remove('hide');
        tabContent[b].classList.add('show');
    }
}

window.onload = async function() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (isAuthenticated === 'true') {
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        await loadOrders();
        await loadSubscriptions();
    }

    initTabs();
};

async function editOrder(orderId) {
    const orderData = {};
    orderData.name = prompt('Enter new name:');
    orderData.phone = prompt('Enter new phone:');
    orderData.recipientName = prompt('Enter new recipient name:');
    orderData.recipientPhone = prompt('Enter new recipient phone:');
    orderData.deliveryDate = prompt('Enter new delivery date:');
    orderData.deliveryTime = prompt('Enter new delivery time:');
    orderData.street = prompt('Enter new street:');
    orderData.apartment = prompt('Enter new apartment:');
    orderData.status = prompt('Enter new status:');

    Object.keys(orderData).forEach(key => {
        if (orderData[key] === '') {
            delete orderData[key];
        }
    });

    if (Object.keys(orderData).length === 0) {
        console.log('No fields provided for update');
        return;
    }

    try {
        const response = await fetch(`/editOrder/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        const data = await response.json();
        if (data.success) {
            location.reload();
        } else {
            console.error('Error updating order:', data.message);
            alert('Error updating order. Please try again later.');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Error updating order. Please try again later.');
    }
}

async function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            const response = await fetch(`/deleteOrder/${orderId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                location.reload();
            } else {
                console.error('Error deleting order:', data.message);
                alert('Error deleting order. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Error deleting order. Please try again later.');
        }
    }
}

async function editSubscription(subscriptionId) {
    const subscriptionData = {};
    subscriptionData.plan = prompt('Enter new plan:');
    subscriptionData.frequency = prompt('Enter new frequency:');
    subscriptionData.deliveries = prompt('Enter new number of deliveries:');
    subscriptionData.email = prompt('Enter new email:');
    subscriptionData.description = prompt('Enter new description:');

    Object.keys(subscriptionData).forEach(key => {
        if (subscriptionData[key] === '') {
            delete subscriptionData[key];
        }
    });

    if (Object.keys(subscriptionData).length === 0) {
        console.log('No fields provided for update');
        return;
    }

    try {
        const response = await fetch(`/editSubscription/${subscriptionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriptionData),
        });
        const data = await response.json();
        if (data.success) {
            location.reload();
        } else {
            console.error('Error updating subscription:', data.message);
            alert('Error updating subscription. Please try again later.');
        }
    } catch (error) {
        console.error('Error updating subscription:', error);
        alert('Error updating subscription. Please try again later.');
    }
}

async function deleteSubscription(subscriptionId) {
    if (confirm('Are you sure you want to delete this subscription?')) {
        try {
            const response = await fetch(`/deleteSubscription/${subscriptionId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                location.reload();
            } else {
                console.error('Error deleting subscription:', data.message);
                alert('Error deleting subscription. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting subscription:', error);
            alert('Error deleting subscription. Please try again later.');
        }
    }
}
