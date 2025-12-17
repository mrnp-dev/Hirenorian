// Authentication Functions

async function check_LogIn_Fields() {
    let isValid = true;
    const emailInput = document.querySelector('#signin-email');
    const passwordInput = document.querySelector('#signin-password');

    // Validate email
    if (emailInput.value.trim() === "") {
        showError(emailInput, `${emailInput.name} cannot be empty.`);
        isValid = false;
    } else if (!checkEmail_Simple(emailInput)) {
        showError(emailInput, `Please enter a valid email.`);
        isValid = false;
    } else {
        removeError(emailInput);
    }

    // Validate password
    if (passwordInput.value.trim() === "") {
        showError(passwordInput, `${passwordInput.name} cannot be empty.`);
        isValid = false;
    } else {
        removeError(passwordInput);
    }

    if (isValid) {
        const company_email = emailInput.value.trim();
        const company_password = passwordInput.value.trim();

        const loginBtn = document.querySelector('#signIn_Btn');
        const originalText = loginBtn.textContent;
        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/company_login_process.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_email,
                    company_password
                })
            });
            const data = await response.json();

            if (response.ok && data.status === "success") {
                if (typeof ToastSystem !== 'undefined') ToastSystem.show('Login Successfully', "success");

                // Construct path for session script - assuming relative to the php file serving this page
                const sessionResponse = await fetch("company_session.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        company_email
                    })
                }
                );

                const sessionData = await sessionResponse.json();

                if (sessionResponse.ok && sessionData.status === "success") {
                    console.log(sessionData.debug);
                    if (typeof ToastSystem !== 'undefined') ToastSystem.show('Session stored successfully', "success");

                    setTimeout(() => {
                        if (typeof ToastSystem !== 'undefined') ToastSystem.show("Redirecting to Company Dashboard", "info");
                        setTimeout(() => {
                            // Redirect to Company Dashboard
                            window.location.href = "../../../Company Pages/Company Dashboard/php/company_dashboard.php";
                        }, 1500);
                    }, 1500);
                } else {
                    if (typeof ToastSystem !== 'undefined') ToastSystem.show('Session storage failed', "error");
                    loginBtn.disabled = false;
                    loginBtn.textContent = originalText;
                }
            } else {
                if (typeof ToastSystem !== 'undefined') ToastSystem.show(data.message || 'Login Failed. Check your credentials.', "error");
                loginBtn.disabled = false;
                loginBtn.textContent = originalText;
            }
        } catch (err) {
            console.error("Network error:", err);
            if (typeof ToastSystem !== 'undefined') ToastSystem.show("Unable to connect to server", "error");
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    } else {
        if (typeof ToastSystem !== 'undefined') ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

function checkEmail_Simple(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input.value.trim());
}

// Ensure openResetPasswordUI is available or define it if not present
// Assuming the reset password script handles it, but check_LogIn_Fields is called from HTML.
// If reset password script is included, it should define openResetPasswordUI.
