<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../css/company.css">
    <link rel="stylesheet" href="../css/toast.css">
    <title>Company Registration</title>
</head>

<body>
    <div class="header">
        <img src="../images/image 4.png" alt="Logo">
        <h1>Hirenorian</h1>
    </div>

    <div class="wrapper">
        <div class="form-container signIn">
            <div class="sign-in-container shift_active">
                <form action="">
                    <h1>Sign In</h1>
                    <div class="input-wrapper">
                        <input type="email" name="Company Email" id="signin-email" placeholder="Company Email">
                        <p>error</p>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" name="Password" id="signin-password" placeholder="Password">
                        <p>error</p>
                        <button type="button" class="toggle_show_hide" id="toggleSignInPassword"
                            onclick="toggleShow_Hide_Password(this)"><i class="fa fa-eye"></i></button>
                    </div>
                    <span>Forgot password? <a href="javascript:void(0)" id="forgot-pass">Reset Password</a></span>
                    <button type="button" id="signIn_Btn" onclick="check_LogIn_Fields()">Login</button>
                </form>
            </div>
            <div class="sign-up-container shift_inactive">
                <h1 id="title">Company Profile</h1>
                <form action="" id="signUp-Form">
                    <div class="form-section" id="firstInputs">
                        <div class="input-wrapper email-verification-wrapper">
                            <input type="email" id="email-input" name="Company Email" placeholder="Company Email *">
                            <button type="button" class="verify-btn" id="verify-company-email-btn"
                                onclick="initiateEmailVerification('company')">
                                <i class="fa fa-shield-alt"></i> Verify
                            </button>
                            <div class="verified-badge" id="company-email-verified" style="display: none;">
                                <i class="fa fa-check-circle"></i>
                            </div>
                            <p>error</p>
                        </div>

                        <div class="input-wrapper">
                            <input type="password" id="password-input" name="Password" placeholder="Password *">
                            <p>error</p>
                            <button type="button" class="toggle_show_hide" id="togglePassword"
                                onclick="toggleShow_Hide_Password(this)"><i class="fa fa-eye"></i></button>
                        </div>

                        <div class="input-wrapper">
                            <input type="password" id="confirmPass-input" name="Confirm Password"
                                placeholder="Confirm Password *">
                            <p>error</p>
                            <button type="button" class="toggle_show_hide" id="toggleConfirmPassword"
                                onclick="toggleShow_Hide_Password(this)"><i class="fa fa-eye"></i></button>
                        </div>

                        <div class="input-wrapper">
                            <input type="tel" id="phoneNumber-input" name="Phone Number" placeholder="Phone Number *"
                                minlength="11" maxlength="13">
                            <p>error</p>
                        </div>

                        <div class="button-container">
                            <button type="button" class="btn btn-landing" onclick="goBackToLandingPage()">Back to
                                Landing</button>
                            <button type="button" id="first_nextBtn" onclick="goNext(this)"
                                class="btn btn-next">Next</button>
                        </div>
                    </div>

                    <div class="form-section" id="secondInputs">
                        <div class="input-wrapper">
                            <input type="text" id="companyName-input" name="Company Name" placeholder="Company Name *">
                            <p>error</p>
                        </div>

                        <div class="form-row">
                            <div class="input-wrapper">
                                <input type="text" id="companyType-input" name="Company Type"
                                    placeholder="Company Type *">
                                <div class="suggestions"></div>
                                <p>error</p>
                            </div>
                            <div class="input-wrapper">
                                <input type="text" id="industry-input" name="Industry" placeholder="Industry *">
                                <div class="suggestions"></div>
                                <p>error</p>
                            </div>
                        </div>

                        <div class="input-wrapper">
                            <input type="text" id="companyAddress-input" name="Company Address"
                                placeholder="Company Address *">
                            <p>error</p>
                        </div>

                        <div class="button-container">
                            <button type="button" class="btn btn-back" onclick="goToPreviousSection(this)">Back</button>
                            <button type="button" class="btn btn-submit" onclick="submitTheForm(this)">Finish</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="toggle-container signIn">
            <div class="toggle">
                <div class="toggle-right shift_active">
                    <h2>Welcome Back!</h2>
                    <img src="../images/sign-up-icon.svg" alt="">
                    <p>Connect with top talent and grow your team today</p>
                    <div class="toggle-btn-container">
                        <button id="toggle-signUp-Btn">Sign Up</button>
                    </div>
                </div>
                <div class="toggle-left shift_inactive">
                    <h2>"Connecting students with<br>real-world opportunities"</h2>
                    <div class="steps">
                        <div class="step active-step">
                            <div class="step-icon left-active-icon"><img src="../images/User.png" alt="Logo">
                            </div>
                            <span class="step-text left-active-text">Company Profile</span>
                        </div>
                        <div class="step">
                            <div class="step-icon"><img src="../images/Book.png" alt="Logo"></div>
                            <span class="step-text">Brief Background</span>
                        </div>
                    </div>
                    <div class="toggle-btn-container">
                        <button id="toggle-signIn-Btn">Sign In</button>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- OTP Verification Modal -->
    <div class="otp-modal-overlay" id="otpModalOverlay" style="display: none;">
        <div class="otp-modal-content">
            <button type="button" class="otp-modal-close" onclick="closeOTPModal()">
                <i class="fa fa-times"></i>
            </button>

            <div class="otp-modal-header">
                <div class="otp-icon">
                    <i class="fa fa-envelope"></i>
                </div>
                <h2>Verify Your Email</h2>
                <p class="otp-instruction">We've sent a 6-digit code to <span id="verifying-email-display"></span></p>
                <p class="otp-note">(For demo: Enter any 6-digit number)</p>
            </div>

            <div class="otp-input-container">
                <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="otp-1">
                <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="otp-2">
                <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="otp-3">
                <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="otp-4">
                <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="otp-5">
                <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="otp-6">
            </div>

            <div class="otp-error-message" id="otpErrorMessage" style="display: none;">
                <i class="fa fa-exclamation-circle"></i> <span id="otpErrorText"></span>
            </div>

            <div class="otp-modal-actions">
                <button type="button" class="btn-verify-otp" onclick="verifyOTP()">
                    <i class="fa fa-check"></i> Verify Code
                </button>
                <button type="button" class="btn-resend-otp" id="resendOtpBtn" onclick="resendOTP()">
                    <i class="fa fa-redo"></i> <span id="resendText">Resend Code</span>
                </button>
            </div>
        </div>
    </div>

    <script src="../js/company_registration.js"></script>
    <script src="../js/toast.js"></script>
</body>

</html>