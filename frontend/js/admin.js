const tbody = document.querySelector("#ordersTable tbody");
const grandTotalDisplay = document.getElementById("grandTotal");

// 🔹 Load Orders from Backend
function loadOrders() {
    fetch("http://localhost:5006/api/orders")
        .then(res => res.json())
        .then(orders => {
            tbody.innerHTML = "";

            if (orders.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No Orders Found</td></tr>`;
                grandTotalDisplay.innerText = "Total Sales: ₹0";
                return;
            }

            let grandTotal = 0;

            orders.forEach(order => {
                grandTotal += Number(order.total);

                let itemsHTML = "";
                order.items.forEach(item => {
                    itemsHTML += `<p>${item.name} (${item.quantity})</p>`;
                });

                tbody.innerHTML += `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${new Date(order.createdAt).toLocaleString()}</td>
                    <td>${itemsHTML}</td>
                    <td>Rs.${order.total}</td>
                    <td>
                        <select onchange="updateStatus('${order._id}', this.value)">
                            <option ${order.status=="Placed"?"selected":""}>Placed</option>
                            <option ${order.status=="Preparing"?"selected":""}>Preparing</option>
                            <option ${order.status=="Out for Delivery"?"selected":""}>Out for Delivery</option>
                            <option ${order.status=="Delivered"?"selected":""}>Delivered</option>
                            <option ${order.status=="Cancelled"?"selected":""}>Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <button onclick="deleteOrder('${order._id}')">Delete</button>
                    </td>
                </tr>`;
            });

            grandTotalDisplay.innerText = "Total Sales: ₹" + grandTotal;
        })
        .catch(err => console.error("Load Orders Error:", err));
}

// 🔹 Update Order Status
function updateStatus(id, status) {
    fetch(`http://localhost:5006/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(() => loadOrders());
}

// 🔹 Delete Order
function deleteOrder(id) {
    if (confirm("Delete this order?")) {
        fetch(`http://localhost:5006/api/orders/${id}`, {
            method: "DELETE"
        })
        .then(() => loadOrders());
    }
}

// Initial Load
loadOrders();
