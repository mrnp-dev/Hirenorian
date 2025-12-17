/**
 * Password Modal Module
 * Handles change password functionality with strict validation
 * Dependencies: ui-controls.js, toast.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const changePasswordModal = document.getElementById('changePasswordModal');
    const passwordForm = document.getElementById('passwordForm');

    // Toggle Password Visibility
    window.togglePasswordVisibility = function (button) {
        const wrapper = button.parentElement;
        const input = wrapper.querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    if (passwordForm) {
        // Elements for Multi-step
        const stepOtp = document.getElementById('password-step-otp');
        const stepForm = document.getElementById('passwordForm'); // The form IS step 2
        const otpEmailInput = document.getElementById('otp_student_email');
        const verifyOtpBtn = document.getElementById('btn-verify-password-otp');
        const otpStatus = document.getElementById('password-otp-status');
        const otpError = document.getElementById('password-otp-error');
        const otpInputs = document.querySelectorAll('.password-otp-digit');

        let generatedPasswordOTP = null;

        // Hook into the open button to trigger OTP
        const openBtn = document.querySelector('[data-modal-target="#changePasswordModal"]');
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                // Reset State
                stepOtp.style.display = 'block';
                stepForm.style.display = 'none';
                otpInputs.forEach(i => i.value = '');
                otpError.style.display = 'none';

                // Send OTP
                const email = otpEmailInput.value;
                if (email) {
                    sendPasswordOTP(email);
                } else {
                    otpStatus.innerHTML = "<span style='color:red'>Error: Student email not found.</span>";
                }
            });
        }

        async function sendPasswordOTP(email) {
            otpStatus.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending verification code...';
            verifyOtpBtn.disabled = true;

            try {
                // Using existing send_reset_otp.php (assuming it works for this purpose)
                // It sends to 'email' param.
                const response = await fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/send_reset_otp.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    generatedPasswordOTP = data.otp.toString();
                    console.log("DEBUG: Password OTP Sent:", generatedPasswordOTP);
                    otpStatus.innerHTML = '<span style="color: green;"><i class="fa fa-check"></i> Code sent successfully!</span>';
                    verifyOtpBtn.disabled = false;
                    setTimeout(() => otpInputs[0].focus(), 500);
                } else {
                    otpStatus.innerHTML = `<span style='color:red'>Failed: ${data.message}</span>`;
                }
            } catch (err) {
                console.error(err);
                otpStatus.innerHTML = "<span style='color:red'>Network error sending OTP.</span>";
            }
        }

        // OTP Input Logic (Auto-focus & Navigation)
        otpInputs.forEach((input, index) => {
            // Handle Input (Typing)
            input.addEventListener('input', (e) => {
                // Ensure number only
                e.target.value = e.target.value.replace(/[^0-9]/g, '');

                if (e.target.value.length === 1) {
                    // Move to next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                }
            });

            // Handle Navigation (Backspace, Arrows)
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value) {
                    // Move to previous input
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
                if (e.key === 'ArrowLeft' && index > 0) {
                    otpInputs[index - 1].focus();
                }
                if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            // Select value on focus for easy overwrite
            input.addEventListener('focus', (e) => {
                e.target.select();
            });

            // Handle Paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const data = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('');
                data.forEach((char, i) => {
                    if (otpInputs[index + i]) {
                        otpInputs[index + i].value = char;
                        // Focus the last filled input or the next empty one
                        if (i === data.length - 1) {
                            if (index + i < otpInputs.length - 1) {
                                otpInputs[index + i + 1].focus();
                            } else {
                                otpInputs[index + i].focus();
                            }
                        }
                    }
                });
            });
        });

        // Verify OTP Logic
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', () => {
                const otp = Array.from(otpInputs).map(i => i.value).join('');

                if (otp === generatedPasswordOTP) {
                    // Success
                    otpError.style.display = 'none';
                    stepOtp.style.display = 'none';
                    stepForm.style.display = 'block'; // Show the actual form
                } else {
                    otpError.textContent = "Invalid OTP";
                    otpError.style.display = 'block';
                    otpInputs.forEach(i => i.value = '');
                    otpInputs[0].focus();
                }
            });
        }

        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        // Real-time validation for New Password
        newPasswordInput.addEventListener('input', () => {
            // Link confirm password validation if it has value
            if (confirmPasswordInput.value.trim() !== '') {
                checkConfirmPassword(confirmPasswordInput, newPasswordInput.value);
            }
            checkPassword(newPasswordInput);
        });

        // Real-time validation for Confirm Password
        confirmPasswordInput.addEventListener('input', () => {
            checkConfirmPassword(confirmPasswordInput, newPasswordInput.value);
        });

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentId = document.getElementById('studentIdPassword').value;
            const newPassword = newPasswordInput.value;

            // Final Validation Check
            const isNewPasswordValid = checkPassword(newPasswordInput);
            const isConfirmPasswordValid = checkConfirmPassword(confirmPasswordInput, newPassword);

            if (!isNewPasswordValid || !isConfirmPasswordValid) {
                // ToastSystem.show('Please correct the highlighted errors', 'warning');
                return;
            }

            // Loading State
            const submitBtn = passwordForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Changing...';
            submitBtn.disabled = true;

            // API Call
            fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/change_password_v2.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    new_password: newPassword
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        ToastSystem.show('Password changed successfully', 'success');
                        passwordForm.reset();
                        resetValidationStyles();
                        if (changePasswordModal) closeModal(changePasswordModal);
                    } else {
                        ToastSystem.show(data.message || 'Failed to change password', 'error');
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    ToastSystem.show('Network error', 'error');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.disabled = false;
                });
        });
    }

    // ================= VALIDATION LOGIC =================

    function checkPassword(input) {
        const password_minLength = 12;
        const password_maxLength = 64;

        if (input.value.length < password_minLength) {
            showError(input, `${input.name} must contain at least ${password_minLength} characters.`);
            return false;
        } else if (input.value.length > password_maxLength) {
            showError(input, `${input.name} must not exceed ${password_maxLength} characters.`);
            return false;
        } else {
            return checkPasswordStrength(input);
        }
    }

    function checkPasswordStrength(input) {
        const password = input.value;
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecials = /[^a-zA-Z0-9]/.test(password);

        const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;

        return changePasswordStrength_text(input, typesCount);
    }

    function changePasswordStrength_text(element, strength) {
        let valid = true;
        const section = element.closest(".input-wrapper");
        const strength_P = section.querySelector(".error-text");
        const span = document.createElement('span');

        // Clear previous content
        strength_P.textContent = "strength: ";
        strength_P.style.color = "white"; // Or any neutral color to match design, validation.js uses white but context might be different. 
        // validation.js sets p color to white, then appends a colored span.
        // But our p has class error-text which might have default styles.
        // Let's stick to validation.js logic but adapt for our CSS.

        // In validation.js:
        // strength_P.textContent = "strength: ";
        // strength_P.style.color = "white"; 
        // ... switch ... span.style.color = ...
        // strength_P.append(span);

        // In our case, the background is white, so "white" text won't show.
        // validation.js likely runs on a dark theme or colored background?
        // Let's assume standard dark text on light bg or adjust.
        // Actually, let's look at edit_profile.css... wait, I can't see it.
        // I will use safe colors (dark grey for label, colored for strength).

        strength_P.style.color = "#666"; // Default text color

        switch (strength) {
            case 1:
                span.textContent = "weak";
                span.style.color = "red";
                element.dataset.strength = "weak";
                valid = false;
                break;
            case 2:
                span.textContent = "medium";
                span.style.color = "orange";
                element.dataset.strength = "medium";
                break;
            case 3:
                span.textContent = "strong";
                span.style.color = "green";
                element.dataset.strength = "strong";
                break;
            default: // 0
                span.textContent = "weak";
                span.style.color = "red";
                element.dataset.strength = "weak";
                valid = false;
        }

        strength_P.innerHTML = "Strength: "; // Reset
        strength_P.appendChild(span);
        strength_P.style.visibility = 'visible';

        // If it's weak, validation.js says valid = false.
        // But if length is okay, we need to show this error?
        // validation.js:
        // if (input.value.length < min) ... return false
        // else checkPasswordStrength -> changePasswordStrength_text -> returns valid (false if weak)

        // Use showError if not valid to ensure red border?
        if (!valid) {
            element.classList.add('input-error');
            // Note: changePasswordStrength_text in validation.js DOES NOT call showError, 
            // it just updates the text.
            // But valid=false is returned.
            // We should probably ensure the 'invalid' visual state on the input too if we want 'working valid password validations'
            // In validation.js, firstInputsValidation checks explicitely:
            // if (input.name == "Password" && input.dataset.strength == "weak") ... showError ...

            // So here we should probably do the same or let the return value handle it?
            // function checkPassword returns the result of this function.
            // So if weak, checkPassword returns false.
        } else {
            element.classList.remove('input-error');
        }

        return valid;
    }

    function checkConfirmPassword(input, originalPassword) {
        if (input.value !== originalPassword) {
            showError(input, `Passwords do not match.`);
            return false;
        } else {
            input.classList.remove('input-error');
            const section = input.closest(".input-wrapper");
            const p = section.querySelector(".error-text");
            p.textContent = "Passwords matched";
            p.style.color = "green";
            p.style.visibility = 'visible';
            return true;
        }
    }

    function showError(input, message) {
        input.classList.add('input-error');
        const wrapper = input.closest(".input-wrapper"); // Use closest to be safe
        const p = wrapper.querySelector(".error-text");
        p.textContent = message;
        p.style.color = 'red';
        p.style.visibility = 'visible';
    }

    function removeError(input) {
        input.classList.remove('input-error');
        const wrapper = input.closest(".input-wrapper");
        if (!wrapper) return;

        const p = wrapper.querySelector(".error-text");

        // Simpler check: if visibility is visible, hide it? 
        // No, we want strength to stay visible.
        // We only hide if we strictly want to clear it. 
        // For current password, we want to clear 'Required'.
        if (p) {
            p.style.visibility = 'hidden';
        }
    }

    function resetValidationStyles() {
        const inputs = passwordForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('input-error');
            const wrapper = input.closest(".input-wrapper");
            if (wrapper) {
                const p = wrapper.querySelector(".error-text");
                if (p) {
                    p.style.visibility = 'hidden';
                    p.textContent = 'Error message'; // Reset text
                }
                if (input.type === 'text' && input.name.toLowerCase().includes('password')) {
                    input.type = 'password';
                    wrapper.querySelector('i').classList.remove('fa-eye-slash');
                    wrapper.querySelector('i').classList.add('fa-eye');
                }
            }
        });
    }
});
