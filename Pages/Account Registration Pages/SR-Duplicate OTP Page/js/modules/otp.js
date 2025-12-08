// Email Verification and OTP Functions

async function initiateEmailVerification(emailType) {
    if (emailType === 'personal') {
        const emailInput = document.querySelector('#email-input');
        const email = emailInput.value.trim();

        // Validate email format first
        const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;

        if (!email) {
            showError(emailInput, 'Please enter an email address');
            return;
        }
        if (!validEmail_RegEx.test(email)) {
            showError(emailInput, 'Invalid email format');
            return;
        }
        if (validSchoolEmail_RegEx.test(email.toLowerCase())) {
            showError(emailInput, 'Please use your personal email, not school email');
            return;
        }

        currentVerifyingEmail = email;
        currentVerifyingEmailType = emailType;
        openOTPModal();

    } else if (emailType === 'school') {
        const emailInput = document.querySelector('#schoolEmail-input');
        const email = emailInput.value.trim();

        // Validate school email format
        const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;

        if (!email) {
            showError(emailInput, 'Please enter your school email');
            return;
        }
        if (!validSchoolEmail_RegEx.test(email.toLowerCase())) {
            showError(emailInput, 'Invalid school email format');
            return;
        }

        // Check if matches student number
        const studentNumber = document.querySelector('#studNum-input').value.trim();

        // Check availability first
        const isStudentNumberAvailable = await ifStudentNumber_Exist();
        if (!isStudentNumberAvailable) {
            return;
        }

        if (studentNumber) {
            const studentNumber_substr = email.toLowerCase().slice(0, 10);
            if (studentNumber !== studentNumber_substr) {
                showError(emailInput, 'School email must match your student number');
                return;
            }
        }

        currentVerifyingEmail = email;
        currentVerifyingEmailType = emailType;
        openOTPModal();
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

    // Send OTP via API (using the logic from the previous email_otp.js but integrated here)
    // Note: The original code didn't have the actual fetch call in openOTPModal, 
    // but we should integrate the sending logic here or call a function for it.
    // For now, we'll keep it as per the original refactor request, but we might want to 
    // call the send_otp.php script here.

    sendOTPToEmail(currentVerifyingEmail);
}

function sendOTPToEmail(email) {
    console.log("Sending OTP to:", email);
    fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/send_otp.php", {
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
}

function resetOTPInputs() {
    for (let i = 1; i <= 6; i++) {
        const input = document.querySelector(`#otp-${i}`);
        input.value = '';
        input.classList.remove('filled', 'error');
    }
}

function setupOTPInputHandlers() {
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        // Remove existing event listeners by cloning
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });

    // Re-select after cloning
    const freshInputs = document.querySelectorAll('.otp-input');

    freshInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Only allow digits
            e.target.value = value.replace(/[^0-9]/g, '');

            if (e.target.value) {
                e.target.classList.add('filled');
                e.target.classList.remove('error');

                // Auto-focus next input
                if (index < 5) {
                    freshInputs[index + 1].focus();
                }

                // Auto-verify when all filled
                if (index === 5) {
                    setTimeout(() => verifyOTP(), 300);
                }
            } else {
                e.target.classList.remove('filled');
            }

            hideOTPError();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                freshInputs[index - 1].focus();
            }

            if (e.key === 'ArrowLeft' && index > 0) {
                freshInputs[index - 1].focus();
            }

            if (e.key === 'ArrowRight' && index < 5) {
                freshInputs[index + 1].focus();
            }
        });

        // Paste support
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

            if (digits.length === 6) {
                setTimeout(() => verifyOTP(), 300);
            }
        });
    });
}

function verifyOTP() {
    const otpInputs = document.querySelectorAll('.otp-input');
    let otpCode = '';

    otpInputs.forEach(input => {
        otpCode += input.value;
    });

    if (otpCode.length !== 6) {
        showOTPError('Please enter all 6 digits');
        otpInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('error');
            }
        });
        return;
    }

    // For demo: Accept any 6-digit code or implement actual verification
    // In a real scenario, you'd send this code to the backend to verify.
    // Since the original code said "For demo: Accept any 6-digit code", we'll stick to that
    // OR we could implement actual verification if the backend supported it.
    // Given the user request was to "break down", we keep the logic similar but structured.

    // Simulate API call
    setTimeout(() => {
        // Success! Mark email as verified
        markEmailAsVerified(currentVerifyingEmailType);
        closeOTPModal();
        ToastSystem.show('Email verified successfully!', 'success');
    }, 500);
}

function markEmailAsVerified(emailType) {
    if (emailType === 'personal') {
        emailVerificationState.personalEmail = true;

        const verifyBtn = document.querySelector('#verify-personal-email-btn');
        const verifiedBadge = document.querySelector('#personal-email-verified');
        const emailInput = document.querySelector('#email-input');

        verifyBtn.style.display = 'none';
        verifiedBadge.style.display = 'flex';
        // emailInput.setAttribute('readonly', true);

        userInformation['Email Verified'] = true;
    } else if (emailType === 'school') {
        emailVerificationState.schoolEmail = true;

        const verifyBtn = document.querySelector('#verify-school-email-btn');
        const verifiedBadge = document.querySelector('#school-email-verified');
        const emailInput = document.querySelector('#schoolEmail-input');

        verifyBtn.style.display = 'none';
        verifiedBadge.style.display = 'flex';
        // emailInput.setAttribute('readonly', true);

        userInformation['School Email Verified'] = true;
    }
}

function resendOTP() {
    const resendBtn = document.querySelector('#resendOtpBtn');
    const resendText = document.querySelector('#resendText');

    if (resendTimer) {
        return; // Already counting down
    }

    // Call the send function again
    sendOTPToEmail(currentVerifyingEmail);

    ToastSystem.show('Code resent successfully!', 'info');

    // Start countdown
    resendCountdown = 60;
    resendBtn.disabled = true;

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
    const personalEmailInput = document.querySelector('#email-input');
    const schoolEmailInput = document.querySelector('#schoolEmail-input');

    personalEmailInput.addEventListener('input', () => {
        if (emailVerificationState.personalEmail) {
            emailVerificationState.personalEmail = false;
            document.querySelector('#verify-personal-email-btn').style.display = 'flex';
            document.querySelector('#personal-email-verified').style.display = 'none';
            delete userInformation['Email Verified'];
        }
    });

    schoolEmailInput.addEventListener('input', () => {
        if (emailVerificationState.schoolEmail) {
            emailVerificationState.schoolEmail = false;
            document.querySelector('#verify-school-email-btn').style.display = 'flex';
            document.querySelector('#school-email-verified').style.display = 'none';
            delete userInformation['School Email Verified'];
        }
    });
}
