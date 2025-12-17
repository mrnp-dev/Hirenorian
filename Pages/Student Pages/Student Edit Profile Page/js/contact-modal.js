/**
 * Contact Modal Module
 * Handles contact information modal functionality with Email OTP Verification
 * Dependencies: validation.js, toast.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('editContactModal');
    let generatedContactOTP = null;

    if (contactModal) {
        // Elements
        const form = document.getElementById('contactForm');
        const step1 = document.getElementById('contact-step-1');
        const step2 = document.getElementById('contact-step-2');

        const personalEmailInput = document.getElementById('personalEmail');
        const originalEmailInput = document.getElementById('originalPersonalEmail');
        const phoneInput = document.getElementById('phone');
        const locationInput = document.getElementById('location');
        const studentIdInput = document.getElementById('student_id');

        const verifyEmailDisplay = document.getElementById('verify-email-display');
        const otpInputs = document.querySelectorAll('.otp-digit');
        const otpError = document.getElementById('otp-error');

        // Buttons & Badges
        const saveBtn = document.getElementById('btn-save-contact');
        const verifyOtpBtn = document.getElementById('btn-verify-contact'); // The 'Verify & Save' button in Step 2
        const backBtn = document.getElementById('btn-back-contact');

        const verifyActionBtn = document.getElementById('verify-personal-email-btn'); // New Verify Button
        const verifiedBadge = document.getElementById('personal-email-verified'); // New Badge

        // Initialize Validation Listeners
        if (personalEmailInput) {
            personalEmailInput.addEventListener('blur', () => validateEmail(personalEmailInput));
            personalEmailInput.addEventListener('input', () => {
                if (personalEmailInput.classList.contains('input-error')) validateEmail(personalEmailInput);
                checkEmailChange();
            });
        }
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => validatePhoneNumber(phoneInput));
            phoneInput.addEventListener('input', () => {
                if (phoneInput.classList.contains('input-error')) validatePhoneNumber(phoneInput);
            });
        }

        // Logic to toggle Verify Button / Verified Badge
        function checkEmailChange() {
            const currentEmail = personalEmailInput.value.trim();
            const originalEmail = originalEmailInput.value.trim();

            if (currentEmail !== originalEmail) {
                // Email Changed
                if (verifyActionBtn) verifyActionBtn.style.display = 'flex';
                if (verifiedBadge) verifiedBadge.style.display = 'none';
            } else {
                // Email Reverted
                if (verifyActionBtn) verifyActionBtn.style.display = 'none';
                if (verifiedBadge) verifiedBadge.style.display = 'flex'; // Assuming initially verified
            }
        }

        // Explicit Verify Button Click
        if (verifyActionBtn) {
            verifyActionBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const email = personalEmailInput.value.trim();

                if (!validateEmail(personalEmailInput)) {
                    ToastSystem.show('Invalid email address', 'error');
                    return;
                }

                await initiateOTP(email);
            });
        }

        // Handle Main Form Submit (Step 1)
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // If we are in Step 2, don't trigger this submit logic (Verify button handles it)
                if (step1.style.display === 'none') {
                    return;
                }

                const isValidEmail = validateEmail(personalEmailInput);
                const isValidPhone = validatePhoneNumber(phoneInput);
                // const isValidLocation = validateLocation(locationInput); // Optional check

                if (!isValidEmail || !isValidPhone) {
                    // ToastSystem.show('Please fix the errors before saving', 'warning');
                    return;
                }

                const currentEmail = personalEmailInput.value.trim();
                const originalEmail = originalEmailInput.value.trim();

                if (currentEmail !== originalEmail) {
                    // Email Changed - Initiate OTP Flow (Fallback if they didn't click verify button)
                    await initiateOTP(currentEmail);
                } else {
                    // No Email Change - Update Directly
                    updateContactInfo();
                }
            });
        }

        // OTP inputs logic
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    if (index < otpInputs.length - 1) otpInputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value) {
                    if (index > 0) otpInputs[index - 1].focus();
                }
            });
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const data = e.clipboardData.getData('text').slice(0, 6).split('');
                data.forEach((char, i) => {
                    if (otpInputs[index + i]) otpInputs[index + i].value = char;
                });
                if (index + data.length < otpInputs.length) {
                    otpInputs[index + data.length].focus();
                } else {
                    otpInputs[otpInputs.length - 1].focus();
                }
            });
        });

        // Verify JSON OTP Logic (Step 2)
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', () => {
                console.log("Verify & Save Clicked");
                const otp = Array.from(otpInputs).map(i => i.value).join('');
                if (otp.length !== 6) {
                    otpError.textContent = "Please enter complete code";
                    otpError.style.display = 'block';
                    return;
                }

                // Client-Side Verification (Matches Reset Password Logic)
                if (otp === generatedContactOTP) {
                    otpError.style.display = 'none';
                    console.log("OTP Matches. Updating info...");
                    updateContactInfo(); // Proceed to update
                } else {
                    console.log("OTP Mismatch:", otp, "Expected:", generatedContactOTP);
                    otpError.textContent = "Invalid OTP";
                    otpError.style.display = 'block';
                    otpInputs.forEach(i => i.value = ''); // Clear inputs
                    otpInputs[0].focus();
                }
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                step2.style.display = 'none';
                step1.style.display = 'block';
            });
        }

        async function initiateOTP(email) {
            // Visual feedback on the button that triggered it
            // If triggered via explicit button, use that. Else default to saveBtn?
            // For now, let's just toggle 'Sending...' on the verifyActionBtn if visible

            let loadingBtn = verifyActionBtn.style.display !== 'none' ? verifyActionBtn : saveBtn;
            const originalBtnContent = loadingBtn.innerHTML;

            loadingBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            loadingBtn.disabled = true;

            try {
                // Correct path to the new API file we created taking into account user edit
                const response = await fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit Profile APIs/send_contact_otp.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    generatedContactOTP = data.otp.toString(); // Store OTP

                    // LOG OTP AS REQUESTED
                    console.log("OTP sent successfully:", generatedContactOTP);

                    // Show Step 2
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                    verifyEmailDisplay.textContent = email;

                    // Focus first OTP input
                    setTimeout(() => otpInputs[0].focus(), 100);

                    ToastSystem.show('Verification code sent!', 'success');
                } else {
                    ToastSystem.show(data.message || 'Failed to send verification code', 'error');
                }
            } catch (err) {
                console.error(err);
                ToastSystem.show('Network error sending OTP', 'error');
            } finally {
                loadingBtn.innerHTML = originalBtnContent;
                loadingBtn.disabled = false;
            }
        }

        function updateContactInfo() {
            // Collecting Data
            const email = personalEmailInput.value.trim();
            const phone = phoneInput.value.trim();
            const location = locationInput.value.trim();
            const studentId = studentIdInput.value;

            // Show loading state
            const originalBtnContent = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;

            fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/student_contact_update.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    phone,
                    location,
                    studentId
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        ToastSystem.show('Contact information updated successfully', "success");

                        // Update DOM elements immediately for SPA feel
                        const displayEmail = document.getElementById('display-personal-email');
                        const displayPhone = document.getElementById('display-phone');
                        const displayLocation = document.getElementById('display-location');

                        if (displayEmail) displayEmail.textContent = email || "Not Provided";
                        if (displayPhone) displayPhone.textContent = phone || "Not Provided";
                        if (displayLocation) displayLocation.textContent = location || "Not Specified";

                        // Update Original Email ref in case they open modal again
                        originalEmailInput.value = email;

                        // Reset Logic for Buttons
                        checkEmailChange();

                        // Close Modal and Reset Form Steps
                        step2.style.display = 'none';
                        step1.style.display = 'block';
                        otpInputs.forEach(i => i.value = '');
                        closeModal(contactModal);
                    } else {
                        ToastSystem.show(data.message || 'Failed to update contact info', "error");
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    ToastSystem.show('Network error updating profile', "error");
                })
                .finally(() => {
                    saveBtn.innerHTML = originalBtnContent;
                    saveBtn.disabled = false;
                });
        }
    }
});
