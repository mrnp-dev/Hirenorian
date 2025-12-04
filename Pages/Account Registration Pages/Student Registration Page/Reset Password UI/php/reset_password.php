<div class="reset-password-overlay" id="resetPasswordOverlay" style="display: none;">
    <div class="reset-password-container">
        <button type="button" class="close-reset-btn" onclick="closeResetPasswordUI()">
            <i class="fa fa-times"></i>
        </button>

        <!-- Step 1: Email Input -->
        <div class="reset-step" id="resetStep1">
            <div class="reset-icon">
                <i class="fa fa-lock"></i>
            </div>
            <h2>Reset Password</h2>
            <p class="reset-instruction">Enter your student email to receive an OTP.</p>
            <div class="input-wrapper">
                <input type="text" id="reset-email-input" placeholder="Student Email">
                <p class="error-msg">error</p>
            </div>
            <button type="button" class="btn-reset-action" onclick="initiateResetPasswordOTP()">
                <i class="fa fa-paper-plane"></i> Send OTP
            </button>
        </div>

        <!-- Step 2: OTP Verification -->
        <div class="reset-step" id="resetStep2" style="display: none;">
            <div class="reset-icon">
                <i class="fa fa-envelope-open-text"></i>
            </div>
            <h2>Verify OTP</h2>
            <p class="reset-instruction">Enter the 6-digit code sent to <span id="reset-email-display"></span></p>
            <div class="otp-input-container">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="otp-input reset-otp" maxlength="1" pattern="[0-9]" inputmode="numeric">
            </div>
            <p class="error-msg" id="resetOtpError"
                style="visibility: hidden; color: #ef4444; text-align: center; position: static; margin-bottom: 1rem;">
                Invalid OTP</p>
            <button type="button" class="btn-reset-action" onclick="verifyResetOTP()">
                <i class="fa fa-check-circle"></i> Verify
            </button>
            <div class="resend-container">
                <span id="resetResendTimer"></span>
                <button type="button" id="resetResendBtn" onclick="resendResetOTP()" disabled>Resend OTP</button>
            </div>
        </div>

        <!-- Step 3: New Password -->
        <div class="reset-step" id="resetStep3" style="display: none;">
            <div class="reset-icon">
                <i class="fa fa-key"></i>
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

            <button type="button" class="btn-reset-action" onclick="submitNewPassword()">
                <i class="fa fa-save"></i> Reset Password
            </button>
        </div>
    </div>
</div>