<div class="reset-password-overlay" id="resetPasswordOverlay" style="display: none;">
    <div class="reset-password-container">
        <button type="button" class="close-reset-btn" onclick="closeResetPasswordUI()">
            <i class="fa fa-times"></i>
        </button>

        <!-- Step 1: Email Input -->
        <div class="reset-step" id="resetStep1">
            <div class="reset-icon-container">
                <div class="reset-icon">
                    <i class="fa fa-lock"></i>
                </div>
            </div>
            <h2>Reset Password</h2>
            <p class="reset-instruction">Enter your company email to receive an OTP.</p>
            <div class="input-wrapper">
                <input type="text" id="reset-email-input" placeholder="Company Email">
                <p class="error-msg">error</p>
            </div>
            <button type="button" class="btn-reset-primary" onclick="initiateResetPasswordOTP()">
                <i class="fa fa-paper-plane"></i> Send OTP
            </button>
        </div>

        <!-- Step 2: OTP Verification -->
        <div class="reset-step" id="resetStep2" style="display: none;">
            <div class="reset-icon-container">
                <div class="reset-icon">
                    <i class="fa fa-envelope"></i>
                </div>
            </div>
            <h2>Verify Your Email</h2>
            <p class="reset-instruction">We've sent a 6-digit code to <span id="reset-email-display"></span></p>
            <p class="reset-note">(For demo: Enter any 6-digit number)</p>

            <div class="otp-input-container">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
            </div>

            <p class="error-msg" id="resetOtpError"
                style="visibility: hidden; position: static; text-align: center; margin-bottom: 1rem;">Invalid OTP</p>

            <div class="reset-actions">
                <button type="button" class="btn-reset-primary" onclick="verifyResetOTP()">
                    <i class="fa fa-check"></i> Verify Code
                </button>
                <button type="button" class="btn-reset-secondary" id="resetResendBtn" onclick="resendResetOTP()"
                    disabled>
                    <i class="fa fa-redo"></i> <span id="resetResendText">Resend Code</span> <span
                        id="resetResendTimer"></span>
                </button>
            </div>
        </div>

        <!-- Step 3: New Password -->
        <div class="reset-step" id="resetStep3" style="display: none;">
            <div class="reset-icon-container">
                <div class="reset-icon">
                    <i class="fa fa-key"></i>
                </div>
            </div>
            <h2>New Password</h2>
            <p class="reset-instruction">Create a new strong password.</p>

            <div class="input-wrapper">
                <input type="password" id="reset-new-password" placeholder="New Password">
                <button type="button" class="toggle_show_hide" onclick="toggleResetPasswordVisibility(this)">
                    <i class="fa fa-eye"></i>
                </button>
                <p class="error-msg">error</p>
            </div>

            <div class="input-wrapper">
                <input type="password" id="reset-confirm-password" placeholder="Confirm Password">
                <button type="button" class="toggle_show_hide" onclick="toggleResetPasswordVisibility(this)">
                    <i class="fa fa-eye"></i>
                </button>
                <p class="error-msg">error</p>
            </div>

            <button type="button" class="btn-reset-primary" onclick="submitNewPassword()">
                <i class="fa fa-save"></i> Reset Password
            </button>
        </div>
    </div>
</div>