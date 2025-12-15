// Email Verification and OTP Functions
let expectedOTP = null;

async function initiateEmailVerification(emailType) {
    if (emailType === 'company') {
        const emailInput = document.querySelector('#email-input');
        const verifyBtn = document.querySelector('#verify-company-email-btn');
        const email = emailInput.value.trim();

        // Validate email format and availability first
        if (!email) {
            showError(emailInput, 'Please enter an email address');
            return;
        }

        // Add loading state
        const originalText = verifyBtn.innerHTML;
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Checking...';

        try {
            const isValid = await checkEmail(emailInput);

            if (!isValid) {
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = originalText;
                return;
            }

            currentVerifyingEmail = email;
            currentVerifyingEmailType = emailType;
            openOTPModal();

            // Reset button state (modal is now open)
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = originalText;

        } catch (error) {
            console.error("Verification error:", error);
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = originalText;
            if (typeof ToastSystem !== 'undefined') ToastSystem.show("An error occurred during verification", "error");
        }
    }
}

function openOTPModal() {
    const modal = document.querySelector('#otpModalOverlay');
    const emailDisplay = document.querySelector('#verifying-email-display');

    emailDisplay.textContent = currentVerifyingEmail;
    modal.style.display = 'flex';

    // Reset OTP inputs
    resetOTPInputs();

    // Focus first input
    setTimeout(() => {
        document.querySelector('#otp-1').focus();
    }, 100);

    // Setup OTP input handlers
    setupOTPInputHandlers();

    sendOTPToEmail(currentVerifyingEmail);
    startResendCountdown();
}

function sendOTPToEmail(email) {
    console.log("Sending OTP to:", email);
    fetch("send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    console.log("%c DEBUG OTP: " + data.otp, "background: #222; color: #bada55; font-size: 20px");
                    expectedOTP = data.otp.toString();
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show("OTP sent successfully!", "success");
                    }
                } else {
                    console.error("Error sending OTP:", data.message);
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show(data.message || "Failed to send OTP", "error");
                    }
                }
            } catch (e) {
                console.error("JSON Parse Error:", e);
            }
        })
        .catch(err => console.error("Request failed", err));
}

function closeOTPModal() {
    const modal = document.querySelector('#otpModalOverlay');
    modal.classList.add('closing');

    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
        resetOTPInputs();
        hideOTPError();
    }, 300);

    currentVerifyingEmail = null;
    currentVerifyingEmailType = null;

    if (resendTimer) {
        clearInterval(resendTimer);
        resendTimer = null;
    }
}

function resetOTPInputs() {
    for (let i = 1; i <= 6; i++) {
        const input = document.querySelector(`#otp-${i}`);
        input.value = '';
        input.classList.remove('filled', 'error');
    }
}

function setupOTPInputHandlers() {
    const otpInputs = document.querySelectorAll('.company-otp-input');

    otpInputs.forEach((input, index) => {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });

    const freshInputs = document.querySelectorAll('.company-otp-input');

    freshInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            e.target.value = value.replace(/[^0-9]/g, '');

            if (e.target.value) {
                e.target.classList.add('filled');
                e.target.classList.remove('error');
                if (index < 5) freshInputs[index + 1].focus();
                if (index === 5) setTimeout(() => verifyOTP(), 300);
            } else {
                e.target.classList.remove('filled');
            }
            hideOTPError();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) freshInputs[index - 1].focus();
            if (e.key === 'ArrowLeft' && index > 0) freshInputs[index - 1].focus();
            if (e.key === 'ArrowRight' && index < 5) freshInputs[index + 1].focus();
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6);

            digits.split('').forEach((digit, i) => {
                if (i < 6) {
                    freshInputs[i].value = digit;
                    freshInputs[i].classList.add('filled');
                }
            });

            if (digits.length === 6) setTimeout(() => verifyOTP(), 300);
        });
    });
}

function verifyOTP() {
    const otpInputs = document.querySelectorAll('.company-otp-input');
    let otpCode = '';
    otpInputs.forEach(input => otpCode += input.value);

    if (otpCode.length !== 6) {
        showOTPError('Please enter all 6 digits');
        return;
    }

    if (otpCode !== expectedOTP) {
        showOTPError('Invalid OTP Code');
        otpInputs.forEach(input => input.classList.add('error'));
        return;
    }

    setTimeout(() => {
        markEmailAsVerified(currentVerifyingEmailType);
        closeOTPModal();
        ToastSystem.show('Email verified successfully!', 'success');
    }, 500);
}

function markEmailAsVerified(emailType) {
    if (emailType === 'company') {
        emailVerificationState.companyEmail = true;

        const verifyBtn = document.querySelector('#verify-company-email-btn');
        const verifiedBadge = document.querySelector('#company-email-verified');

        verifyBtn.style.display = 'none';
        verifiedBadge.style.display = 'flex';

        userInformation['Company Email Verified'] = true;
    }
}

function resendOTP() {
    if (resendTimer) return;
    sendOTPToEmail(currentVerifyingEmail);
    ToastSystem.show('Code resent successfully!', 'info');
    startResendCountdown();
}

function startResendCountdown() {
    const resendBtn = document.querySelector('#resendOtpBtn');
    const resendText = document.querySelector('#resendText');

    if (resendTimer) clearInterval(resendTimer);

    resendCountdown = 30;
    resendBtn.disabled = true;
    resendText.textContent = `Resend Code (${resendCountdown}s)`;

    resendTimer = setInterval(() => {
        resendCountdown--;
        resendText.textContent = `Resend Code (${resendCountdown}s)`;

        if (resendCountdown <= 0) {
            clearInterval(resendTimer);
            resendTimer = null;
            resendBtn.disabled = false;
            resendText.textContent = 'Resend Code';
        }
    }, 1000);
}

function showOTPError(message) {
    const errorDiv = document.querySelector('#otpErrorMessage');
    const errorText = document.querySelector('#otpErrorText');
    errorText.textContent = message;
    errorDiv.style.display = 'block';
}

function hideOTPError() {
    const errorDiv = document.querySelector('#otpErrorMessage');
    errorDiv.style.display = 'none';
}

function setupEmailEditListeners() {
    const companyEmailInput = document.querySelector('#email-input');

    companyEmailInput.addEventListener('input', () => {
        if (emailVerificationState.companyEmail) {
            emailVerificationState.companyEmail = false;
            document.querySelector('#verify-company-email-btn').style.display = 'flex';
            document.querySelector('#company-email-verified').style.display = 'none';
            delete userInformation['Company Email Verified'];
        }
    });
}
