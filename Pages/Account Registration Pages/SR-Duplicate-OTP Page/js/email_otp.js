document.getElementById("verify-personal-email-btn").addEventListener("click", function () {
    const email = document.getElementById("email-input").value;

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    console.log("Sending OTP to:", email); // Debugging

    // Send email to backend PHP as JSON
    fetch("../php/send_otp.php", { // Ensure correct path to php file
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
        .then(response => response.text())
        .then(text => {
            console.log("Raw response:", text);
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    console.log("OTP sent successfully:", data.otp);
                    document.getElementById("personal-email-verified").style.display = "inline-block";
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show("OTP sent successfully!", "success");
                    } else {
                        alert("OTP sent successfully!");
                    }
                } else {
                    console.error("Error sending OTP:", data.message);
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show(data.message || "Failed to send OTP", "error");
                    } else {
                        alert(data.message || "Failed to send OTP");
                    }
                }
            } catch (e) {
                console.error("JSON Parse Error:", e);
            }
        })
        .catch(err => console.error("Request failed", err));
});