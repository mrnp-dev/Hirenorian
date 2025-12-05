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
    document.getElementById('reset-new-password').value = '';
    document.getElementById('reset-confirm-password').value = '';
    document.querySelectorAll('.error-msg').forEach(msg => msg.style.visibility = 'hidden');
    clearInterval(resetOtpTimer);
}

// Step 1: Email Validation & Send OTP
async function initiateResetPasswordOTP() {
    const emailInput = document.getElementById('reset-email-input');
    const email = emailInput.value.trim();
    const errorMsg = emailInput.parentElement.querySelector('.error-msg');

    // Validation
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;

    if (email === "") {
        showResetError(errorMsg, "Email cannot be empty");
        return;
    }

    if (!validSchoolEmail_RegEx.test(email)) {
        showResetError(errorMsg, "Invalid student email format");
        return;
    }

    // Mock Backend Call
    hideResetError(errorMsg);

    // Simulate API call delay
    const btn = document.querySelector('#resetStep1 .btn-reset-primary');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;

        // Mock Success
        document.getElementById('reset-email-display').textContent = email;
        startResetOtpTimer();
        showResetStep(2);

        // Focus first OTP input
        setTimeout(() => document.querySelector('.reset-otp').focus(), 100);

        // For demo purposes, log OTP
        generatedResetOTP = "123456";
        console.log("Reset OTP:", generatedResetOTP);
        ToastSystem.show(`OTP sent to ${email}`, "success");
    }, 1500);
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

function resendResetOTP() {
    startResetOtpTimer();
    ToastSystem.show("OTP Resent!", "success");
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

    // MODIFIED: Allow ANY 6-digit number for testing
    if (/^\d{6}$/.test(otp)) {
        errorMsg.style.visibility = 'hidden';
        otpInputs.forEach(input => {
            input.classList.remove('error');
            input.classList.add('filled');
        });

        // Simulate loading
        const btn = document.querySelector('#resetStep2 .btn-reset-primary');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Verifying...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            showResetStep(3);
        }, 1000);

    } else {
        errorMsg.textContent = "Invalid OTP Format";
        errorMsg.style.visibility = 'visible';
        otpInputs.forEach(input => input.classList.add('error'));
    }
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

// Step 3: New Password
function toggleResetPasswordVisibility(btn) {
    const input = btn.previousElementSibling;
    const icon = btn.querySelector('i');

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function submitNewPassword() {
    const passInput = document.getElementById('reset-new-password');
    const confirmInput = document.getElementById('reset-confirm-password');

    const passError = passInput.parentElement.querySelector('.error-msg');
    const confirmError = confirmInput.parentElement.querySelector('.error-msg');

    const password = passInput.value;
    const confirm = confirmInput.value;

    let isValid = true;

    // Password Strength Validation
    if (password.length < 12) {
        showResetError(passError, "Must be at least 12 characters");
        isValid = false;
    } else {
        hideResetError(passError);
    }

    if (password !== confirm) {
        showResetError(confirmError, "Passwords do not match");
        isValid = false;
    } else {
        hideResetError(confirmError);
    }

    if (isValid) {
        // Mock Backend Call
        ToastSystem.show("Password Reset Successfully!", "success");
        closeResetPasswordUI();

        // Redirect or show login
        const signInContainer = document.querySelector('.sign-in-container');
        if (signInContainer) {
            // Ensure we are in sign in mode if applicable
        }
    }
}
