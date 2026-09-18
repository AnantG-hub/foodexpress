document.getElementById("placeOrder").addEventListener("click", async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login first!");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Ask user details
    const customerName = prompt("Enter your name:");
    const phone = prompt("Enter your phone number:");
    const address = prompt("Enter your delivery address:");

    if (!customerName || !phone || !address) {
        return alert("All fields required!");
    }

    const orderData = {
        customerId: user._id || user.id,  // ← Auto pick correct ID
        customerName,
        phone,
        address,
        items: cart,
        total
    };

    const res = await fetch("http://localhost:5006/api/orders", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (res.ok) {
        alert("Order placed successfully!");
        cart = [];
        renderCart();
    } else {
        alert(data.message || "Order failed");
        console.log(data);
    }
});

