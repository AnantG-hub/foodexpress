const user = JSON.parse(localStorage.getItem("user"));
fetch(`http://localhost:5006/api/orders/user/${user.name}`)
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("orders");
    data.forEach(o => {
      box.innerHTML += `
        <div>
          <h4>${o.customerName}</h4>
          <p>Total: Rs.${o.total}</p>
          <p>Status: ${o.status}</p>
          <p>Payment: ${o.paymentMethod}</p>
          <button onclick="cancel('${o._id}')">Cancel</button>
        </div>
      `;
    });
  });

function cancel(id) {
  fetch(`http://localhost:5006/api/orders/${id}`, { method: "DELETE" })
    .then(() => location.reload());
}
