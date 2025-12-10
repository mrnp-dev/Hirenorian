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
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const currentPasswordInput = document.getElementById('currentPassword');

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

        // Remove error on input for current password
        currentPasswordInput.addEventListener('input', () => {
            if (currentPasswordInput.value.trim() !== '') {
                removeError(currentPasswordInput);
            }
        });

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentId = document.getElementById('studentIdPassword').value;
            const currentPassword = currentPasswordInput.value.trim();
            const newPassword = newPasswordInput.value;

            // Final Validation Check
            const isNewPasswordValid = checkPassword(newPasswordInput);
            const isConfirmPasswordValid = checkConfirmPassword(confirmPasswordInput, newPassword);

            if (!currentPassword) {
                showError(currentPasswordInput, 'Current Password is required');
                return;
            }

            if (!isNewPasswordValid || !isConfirmPasswordValid) {
                // ToastSystem.show('Please correct the highlighted errors', 'warning');
                return;
            }

            // API Call
            fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/change_password.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    current_password: currentPassword,
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
        if (input.id === 'currentPassword' && p) {
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
