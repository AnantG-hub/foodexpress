const API_URL = "http://localhost:5006/api/auth";

// ===============================
// LOGIN
// ===============================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save user info and token separately
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token 
      }));

      messageEl.style.color = "green";
      messageEl.innerText = "Login Successful!";
      setTimeout(() => window.location.href = "Index.html", 500);
    } else {
      messageEl.style.color = "red";
      messageEl.innerText = data.message || "Login failed!";
    }

  } catch (err) {
    console.error(err);
    messageEl.style.color = "red";
    messageEl.innerText = "Server error!";
  }
});

// ===============================
// REGISTER
// ===============================
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.style.color = "green";
      messageEl.innerText = data.message || "Registration successful!";
      setTimeout(() => window.location.href = "login.html", 1000);
    } else {
      messageEl.style.color = "red";
      messageEl.innerText = data.message || data.error || "Registration failed!";
    }
  } catch (err) {
    console.error(err);
    messageEl.style.color = "red";
    messageEl.innerText = "Server error!";
  }
});

// ===============================
// FORGOT PASSWORD
// ===============================
document.getElementById("forgotForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value;
  const msg = document.getElementById("forgotMessage");

  try {
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      msg.style.color = "green";
      msg.innerText = "OTP sent successfully! Check your email.";
    } else {
      msg.style.color = "red";
      msg.innerText = data.message || "Error sending OTP!";
    }
  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.innerText = "Server error!";
  }
});

// ===============================
// VERIFY OTP + RESET PASSWORD
// ===============================
document.getElementById("resetBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("resetEmail").value;
  const otp = document.getElementById("resetOtp").value;
  const newPassword = document.getElementById("newPassword").value;
  const msg = document.getElementById("resetMessage");

  try {
    // 1️⃣ Verify OTP
    const verifyRes = await fetch(`${API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) {
      msg.style.color = "red";
      msg.innerText = verifyData.message || "Invalid OTP!";
      return;
    }

    // 2️⃣ Reset Password
    const resetRes = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });

    const resetData = await resetRes.json();
    if (resetRes.ok) {
      msg.style.color = "green";
      msg.innerText = "Password reset successfully!";
      setTimeout(() => window.location.href = "login.html", 1500);
    } else {
      msg.style.color = "red";
      msg.innerText = resetData.message || "Failed to reset password!";
    }

  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.innerText = "Server error!";
  }
});

// ===============================
// LOGOUT
// ===============================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  }
});
