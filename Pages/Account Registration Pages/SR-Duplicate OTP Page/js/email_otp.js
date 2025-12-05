document.addEventListener('DOMContentLoaded', function () {
    const verifyBtn = document.getElementById("verify-personal-email-btn");
    if (verifyBtn) {
        verifyBtn.addEventListener("click", function () {
            const emailInput = document.getElementById("email-input");
            const email = emailInput.value.trim();

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
                        alert("An error occurred while processing the response.");
                    }
                })
                .catch(err => {
                    console.error("Request failed", err);
                    alert("An error occurred while sending the request.");
                });
        });
    } else {
        console.error("Verify button not found!");
    }
});
