document.getElementById("verify-personal-email-btn").addEventListener("click", function() {
    const email = document.getElementById("email-input").value;

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    // Send email to backend PHP as JSON
    fetch("send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("OTP sent:", data.otp); // For debugging only, don’t show OTP in production
            document.getElementById("personal-email-verified").style.display = "inline-block";
        } else {
            console.error("Error:", data.message);
        }
    })
    .catch(err => console.error("Request failed", err));
});