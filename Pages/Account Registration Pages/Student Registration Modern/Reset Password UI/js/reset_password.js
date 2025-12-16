// Reset Password Logic

let resetOtpTimer = null;
let resetOtpCountdown = 60;
let generatedResetOTP = null; // Mock OTP for now

function openResetPasswordUI() {
    document.getElementById('resetPasswordOverlay').style.display = 'flex';
    showResetStep(1);
}

function closeResetPasswordUI() {
    document.getElementById('resetPasswordOverlay').style.display = 'none';
    resetResetForm();
}

function showResetStep(stepNumber) {
    document.querySelectorAll('.reset-step').forEach(step => step.style.display = 'none');
    document.getElementById(`resetStep${stepNumber}`).style.display = 'block';
}

function resetResetForm() {
    document.getElementById('reset-email-input').value = '';
    document.querySelectorAll('.reset-otp').forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
    const newPassInput = document.getElementById('reset-new-password');
    const confirmPassInput = document.getElementById('reset-confirm-password');
    if (newPassInput) {
        newPassInput.value = '';
        delete newPassInput.dataset.strength;
    }
    if (confirmPassInput) confirmPassInput.value = '';
    document.querySelectorAll('.error-msg').forEach(msg => msg.style.visibility = 'hidden');
    clearInterval(resetOtpTimer);
}

// Step 1: Email Validation & Send OTP
async function initiateResetPasswordOTP() {
    const emailInput = document.getElementById('reset-email-input');
    const email = emailInput.value.trim();
    const errorMsg = emailInput.parentElement.querySelector('.error-msg');

    // Validation - Normal email format for company
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showResetError(errorMsg, "Email cannot be empty");
        return;
    }

    if (!validEmail_RegEx.test(email)) {
        showResetError(errorMsg, "Invalid email format");
        return;
    }

    // Backend Call
    hideResetError(errorMsg);

    const btn = document.querySelector('#resetStep1 .btn-reset-primary');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    console.log("DEBUG: Initiating OTP request for email:", email);
    console.log("DEBUG: Target URL:", "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/send_reset_otp.php");

    try {
        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/send_reset_otp.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        const responseText = await response.text();
        console.log("DEBUG: Raw response from server:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
            console.log("DEBUG: Parsed JSON data:", data);
        } catch (e) {
            console.error("DEBUG: JSON Parse Error. Response is not valid JSON.");
            showResetError(errorMsg, "Server error: Invalid response format");
            return;
        }

        if (data.status === 'success') {
            document.getElementById('reset-email-display').textContent = email;

            // Store OTP for client-side validation
            generatedResetOTP = data.otp.toString();
            console.log("DEBUG: Reset OTP received and stored:", generatedResetOTP);

            startResetOtpTimer();
            showResetStep(2);
            setTimeout(() => document.querySelector('.reset-otp').focus(), 100);
            ToastSystem.show(`OTP sent to ${email}`, "success");
        } else {
            console.warn("DEBUG: API returned error status:", data.message);
            showResetError(errorMsg, data.message || "Failed to send OTP");
        }
    } catch (error) {
        console.error("DEBUG: Network/Fetch Error sending OTP:", error);
        showResetError(errorMsg, "Network error occurred.");
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

function showResetError(element, message) {
    element.textContent = message;
    element.style.visibility = 'visible';
    if (element.previousElementSibling) {
        element.previousElementSibling.classList.add('input_InvalidInput');
    }
}

function hideResetError(element) {
    element.style.visibility = 'hidden';
    if (element.previousElementSibling) {
        element.previousElementSibling.classList.remove('input_InvalidInput');
    }
}

// Step 2: OTP Verification
function startResetOtpTimer() {
    resetOtpCountdown = 60;
    const timerDisplay = document.getElementById('resetResendTimer');
    const resendBtn = document.getElementById('resetResendBtn');

    resendBtn.disabled = true;

    clearInterval(resetOtpTimer);
    updateTimerDisplay(); // Initial display

    resetOtpTimer = setInterval(() => {
        resetOtpCountdown--;
        updateTimerDisplay();

        if (resetOtpCountdown <= 0) {
            clearInterval(resetOtpTimer);
            timerDisplay.textContent = "";
            resendBtn.disabled = false;
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('resetResendTimer');
    if (resetOtpCountdown > 0) {
        timerDisplay.textContent = `(${resetOtpCountdown}s)`;
    } else {
        timerDisplay.textContent = "";
    }
}

async function resendResetOTP() {
    const email = document.getElementById('reset-email-display').textContent;
    startResetOtpTimer();

    try {
        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/send_reset_otp.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (data.status === 'success') {
            generatedResetOTP = data.otp.toString();
            console.log("DEBUG: Resent OTP received:", generatedResetOTP);
            ToastSystem.show("OTP Resent!", "success");
        } else {
            ToastSystem.show("Failed to resend OTP", "error");
        }

    } catch (error) {
        ToastSystem.show("Failed to resend OTP", "error");
    }
}

function verifyResetOTP() {
    const otpInputs = document.querySelectorAll('.reset-otp');
    let otp = "";
    otpInputs.forEach(input => otp += input.value);

    const errorMsg = document.getElementById('resetOtpError');

    if (otp.length !== 6) {
        errorMsg.textContent = "Please enter all 6 digits";
        errorMsg.style.visibility = 'visible';
        otpInputs.forEach(input => input.classList.add('error'));
        return;
    }

    const btn = document.querySelector('#resetStep2 .btn-reset-primary');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Verifying...';
    btn.disabled = true;

    // Client-side Validation
    setTimeout(() => {
        if (otp === generatedResetOTP) {
            errorMsg.style.visibility = 'hidden';
            otpInputs.forEach(input => {
                input.classList.remove('error');
                input.classList.add('filled');
            });
            showResetStep(3);
        } else {
            errorMsg.textContent = "Invalid OTP";
            errorMsg.style.visibility = 'visible';
            otpInputs.forEach(input => input.classList.add('error'));
        }

        btn.innerHTML = originalContent;
        btn.disabled = false;
    }, 500); // Small delay to simulate processing
}

// OTP Input Logic (Auto-focus & Styling)
document.querySelectorAll('.reset-otp').forEach((input, index) => {
    input.addEventListener('input', (e) => {
        // Remove error state on input
        input.classList.remove('error');

        if (e.target.value.length === 1) {
            input.classList.add('filled');
            const nextInput = document.querySelectorAll('.reset-otp')[index + 1];
            if (nextInput) nextInput.focus();
        } else {
            input.classList.remove('filled');
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length === 0) {
            const prevInput = document.querySelectorAll('.reset-otp')[index - 1];
            if (prevInput) prevInput.focus();
        }
    });

    // Paste support
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.length > 0) {
            const inputs = document.querySelectorAll('.reset-otp');
            pastedData.forEach((char, i) => {
                if (inputs[index + i]) {
                    inputs[index + i].value = char;
                    inputs[index + i].classList.add('filled');
                }
            });
            const nextIndex = Math.min(index + pastedData.length, 5);
            inputs[nextIndex].focus();
        }
    });
});

// Step 3: New Password with Strength Validation
function toggleResetPasswordVisibility(btn) {
    const newPassInput = document.getElementById('reset-new-password');
    const confirmPassInput = document.getElementById('reset-confirm-password');

    // Find the toggle buttons (siblings to the inputs)
    const newPassBtn = newPassInput.nextElementSibling;
    const confirmPassBtn = confirmPassInput.nextElementSibling;

    const newPassIcon = newPassBtn.querySelector('i');
    const confirmPassIcon = confirmPassBtn.querySelector('i');

    if (newPassInput.type === "password") {
        newPassInput.type = "text";
        confirmPassInput.type = "text";

        newPassIcon.classList.remove('fa-eye');
        newPassIcon.classList.add('fa-eye-slash');
        confirmPassIcon.classList.remove('fa-eye');
        confirmPassIcon.classList.add('fa-eye-slash');
    } else {
        newPassInput.type = "password";
        confirmPassInput.type = "password";

        newPassIcon.classList.remove('fa-eye-slash');
        newPassIcon.classList.add('fa-eye');
        confirmPassIcon.classList.remove('fa-eye-slash');
        confirmPassIcon.classList.add('fa-eye');
    }
}

// Password Strength Validation (matching sign-up logic)
function checkResetPasswordStrength(input) {
    const password = input.value;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecials = /[^a-zA-Z0-9]/.test(password);

    const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;
    return changeResetPasswordStrengthDisplay(input, typesCount);
}

function changeResetPasswordStrengthDisplay(element, strength) {
    let valid = true;
    const section = element.closest(".input-wrapper");
    const strength_P = section.querySelector("p");

    // Clear previous content
    strength_P.innerHTML = '';

    const span = document.createElement('span');
    strength_P.textContent = "strength: ";
    strength_P.style.color = "white";

    switch (strength) {
        case 1:
            span.textContent = "weak";
            span.style.color = "#ef4444";
            element.dataset.strength = "weak";
            valid = false;
            break;
        case 2:
            span.textContent = "medium";
            span.style.color = "#f59e0b";
            element.dataset.strength = "medium";
            break;
        case 3:
            span.textContent = "strong";
            span.style.color = "#10b981";
            element.dataset.strength = "strong";
            break;
    }

    strength_P.append(span);
    strength_P.style.visibility = 'visible';
    strength_P.style.position = 'absolute';
    strength_P.style.marginTop = '0';

    return valid;
}

// Add blur listeners to password fields for validation (ONLY validate on blur and submit)
document.addEventListener('DOMContentLoaded', function () {
    const newPasswordInput = document.getElementById('reset-new-password');
    const confirmPasswordInput = document.getElementById('reset-confirm-password');

    if (newPasswordInput) {
        // Only validate on blur (losing focus)
        newPasswordInput.addEventListener('blur', function () {
            const errorMsg = this.parentElement.querySelector('p');

            if (this.value.length >= 12) {
                checkResetPasswordStrength(this);
            } else if (this.value.length > 0 && this.value.length < 12) {
                errorMsg.textContent = "Must be at least 12 characters";
                errorMsg.style.color = "#ef4444";
                errorMsg.style.visibility = 'visible';
                errorMsg.style.position = 'absolute';
                errorMsg.style.marginTop = '0';
                delete this.dataset.strength;
            } else {
                errorMsg.style.visibility = 'hidden';
                delete this.dataset.strength;
            }
        });

        // Clear error on focus
        newPasswordInput.addEventListener('focus', function () {
            // Don't clear if we have a strength indicator
            if (!this.dataset.strength) {
                const errorMsg = this.parentElement.querySelector('p');
                errorMsg.style.visibility = 'hidden';
            }
        });
    }

    if (confirmPasswordInput) {
        // Validate confirm password on blur
        confirmPasswordInput.addEventListener('blur', function () {
            const passInput = document.getElementById('reset-new-password');
            const errorMsg = this.parentElement.querySelector('p');

            if (this.value.length > 0 && this.value !== passInput.value) {
                errorMsg.textContent = "Passwords do not match";
                errorMsg.style.color = "#ef4444";
                errorMsg.style.visibility = 'visible';
                errorMsg.style.position = 'absolute';
                errorMsg.style.marginTop = '0';
            } else {
                errorMsg.style.visibility = 'hidden';
            }
        });

        // Clear error on focus
        confirmPasswordInput.addEventListener('focus', function () {
            const errorMsg = this.parentElement.querySelector('p');
            errorMsg.style.visibility = 'hidden';
        });
    }
});

async function submitNewPassword() {
    const passInput = document.getElementById('reset-new-password');
    const confirmInput = document.getElementById('reset-confirm-password');

    const passError = passInput.parentElement.querySelector('p');
    const confirmError = confirmInput.parentElement.querySelector('p');

    const password = passInput.value;
    const confirm = confirmInput.value;
    const email = document.getElementById('reset-email-display').textContent;

    let isValid = true;

    // Password Length Validation
    if (password.length < 12) {
        passError.textContent = "Must be at least 12 characters";
        passError.style.color = "#ef4444";
        passError.style.visibility = 'visible';
        passError.style.position = 'absolute';
        passError.style.marginTop = '0';
        isValid = false;
    } else if (password.length > 64) {
        passError.textContent = "Must not exceed 64 characters";
        passError.style.color = "#ef4444";
        passError.style.visibility = 'visible';
        passError.style.position = 'absolute';
        passError.style.marginTop = '0';
        isValid = false;
    } else if (passInput.dataset.strength === "weak" || !passInput.dataset.strength) {
        // Check strength - must be medium or strong
        passError.textContent = "Password strength must be at least medium";
        passError.style.color = "#ef4444";
        passError.style.visibility = 'visible';
        passError.style.position = 'absolute';
        passError.style.marginTop = '0';
        isValid = false;
    }

    // Confirm Password Validation
    if (password !== confirm) {
        confirmError.textContent = "Passwords do not match";
        confirmError.style.color = "#ef4444";
        confirmError.style.visibility = 'visible';
        confirmError.style.position = 'absolute';
        confirmError.style.marginTop = '0';
        isValid = false;
    }

    if (isValid) {
        // Backend Call
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/reset_password.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    new_password: password
                })
            });

            const responseText = await response.text();
            console.log("DEBUG: Raw Reset Password Response:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error("DEBUG: JSON Parsing Failed for Reset Password. Raw:", responseText);
                showResetError(passError, "Server Error: Invalid Response");
                ToastSystem.show("Server Error: Invalid Response", "error");
                return;
            }

            if (data.status === "success") {
                ToastSystem.show("Password Reset Successfully!", "success");
                closeResetPasswordUI();
                // Optionally redirect to login or ensure login mode
            } else {
                ToastSystem.show(data.message || "Failed to reset password", "error");
            }
        } catch (error) {
            console.error("DEBUG: Reset Password Error:", error);
            if (response) {
                // If we have a response object but JSON parsing failed elsewhere
                try {
                    const errorText = await response.text();
                    console.error("DEBUG: Raw Error Response Text:", errorText);
                } catch (e) {
                    console.error("DEBUG: Could not read response text on error.");
                }
            }
            ToastSystem.show("Network error occurred", "error");
        }
    }
}
