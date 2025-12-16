<?php
session_start();
if(isset($_SESSION['email']))
{
    echo "<script>console.log('email in session');</script>";
    /* header("Location: ../../../Student Pages/Student Dashboard Page/php/student_dashboard.php"); */
}
else
{
    echo "<script>console.log('email not in session');</script>";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../css/student_registration.css">
    <link rel="stylesheet" href="../css/otp-modal.css">
    <link rel="stylesheet" href="../css/toast.css">
    <link rel="stylesheet" href="../Reset Password UI/css/reset_password.css">
    <title>Student Registration - Hirenorian</title>
</head>

<body>
    <div class="header">
        <div class="header-left">
            <img src="../images/DHVSU-LOGO.png" alt="Logo">
            <h1>Hirenorian</h1>
        </div>
        <a href="../../Company Registration Modern/php/company_registration.php" class="switch-registration-btn">
            <i class="fa fa-building"></i>
            <span>Company Registration</span>
        </a>
    </div>

    <div class="wrapper">
        <div class="form-container signIn">
            <div class="sign-in-container shift_active">
                <form action="">
                    <h1>Sign In</h1>
                    <div class="input-wrapper">
                        <input type="email" name="Student Email" id="signup-email" placeholder="Student Email">
                        <p>error</p>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" name="Password" id="signup-password" placeholder="Password">
                        <p>error</p>
                        <button type="button" class="toggle_show_hide" id="toggleSignInPassword"
                            onclick="toggleShow_Hide_Password(this)"><i class="fa fa-eye"></i></button>
                    </div>
                    <span>Forgot password? <a href="javascript:void(0)" id="forgot-pass"
                            onclick="openResetPasswordUI()">Reset Password</a></span>
                    <button type="button" id="signIn_Btn" onclick="check_LogIn_Fields()">Login</button>
                </form>
            </div>
            <div class="sign-up-container shift_inactive">
                <h1 id="title">Personalize your Profile</h1>
                <form action="" id="signUp-Form">
                    <div class="form-section" id="firstInputs">
                        <div class="form-row">
                            <div class="input-wrapper">
                                <input type="text" id="firstName-input" name="First Name" placeholder="First Name *">
                                <p>error</p>
                            </div>

                            <div class="input-wrapper">
                                <input type="text" id="lastName-input" name="Last Name" placeholder="Last Name *">
                                <p>error</p>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-wrapper">
                                <input type="text" id="middleInitial-input" name="Middle Initial"
                                    placeholder="Middle Initial *" minlength="1" maxlength="2">
                                <p>error</p>
                            </div>

                            <div class="input-wrapper">
                                <input type="text" id="suffix-input" name="Suffix" placeholder="Suffix (optional)">
                                <p>error</p>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-wrapper email-verification-wrapper">
                                <input type="text" id="email-input" name="Email" placeholder="Personal Email *">
                                <button type="button" class="verify-btn" id="verify-personal-email-btn"
                                    onclick="initiateEmailVerification('personal')" title="Verify Email">
                                    <i class="fa fa-shield-alt"></i>
                                </button>
                                <div class="verified-badge" id="personal-email-verified" style="display: none;">
                                    <i class="fa fa-check-circle"></i>
                                </div>
                                <p>error</p>
                            </div>

                            <div class="input-wrapper phone-wrapper">
                                <input type="text" id="phoneNumber-input" name="Phone Number" placeholder="Phone No *"
                                    minlength="11" maxlength="13">
                                <p>error</p>
                            </div>
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

                        <div class="button-container">
                            <button type="button" class="btn btn-landing" onclick="goBackToLandingPage()">Back to
                                Landing</button>
                            <button type="button" id="first_nextBtn" onclick="goNext(this)"
                                class="btn btn-next">Next</button>
                        </div>
                    </div>

                    <div class="form-section" id="secondInputs">
                        <div class="input-wrapper">
                            <input type="text" id="univ-input" name="University/Campus"
                                placeholder="University / Campus *">
                            <div class="suggestions"></div>
                            <p>error</p>
                        </div>
                        <div class="form-row">
                            <div class="input-wrapper">
                                <input type="text" id="dep-input" name="Department" placeholder="Department *">
                                <div class="suggestions"></div>
                                <p>error</p>
                            </div>
                            <div class="input-wrapper">
                                <input type="text" id="course-input" name="Course" placeholder="Course *">
                                <div class="suggestions"></div>
                                <p>error</p>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-wrapper student-num-wrapper">
                                <input type="text" id="studNum-input" name="Student Number" placeholder="Student No *">
                                <p>error</p>
                            </div>
                            <div class="input-wrapper email-verification-wrapper">
                                <input type="text" id="schoolEmail-input" name="School Email"
                                    placeholder="School Email *">
                                <button type="button" class="verify-btn" id="verify-school-email-btn"
                                    onclick="initiateEmailVerification('school')" title="Verify Email">
                                    <i class="fa fa-shield-alt"></i>
                                </button>
                                <div class="verified-badge" id="school-email-verified" style="display: none;">
                                    <i class="fa fa-check-circle"></i>
                                </div>
                                <p>error</p>
                            </div>
                        </div>

                        <div class="input-wrapper">
                            <input type="text" id="org-input" name="Organization" placeholder="Organization (optional)">
                            <div class="suggestions"></div>
                            <p>error</p>
                        </div>

                        <div class="button-container">
                            <button type="button" class="btn btn-landing"
                                onclick="goToPreviousSection(this)">Back</button>
                            <button type="button" id="second_nextBtn" class="btn btn-next"
                                onclick="goToLast(this)">Next</button>
                        </div>
                    </div>
                    <div class="form-section" id="thirdInputs">
                        <div class="input-wrapper">
                            <input type="text" id="location-input" name="Ideal Location" placeholder="Ideal Location *">
                            <div class="suggestions"></div>
                            <p>error</p>
                        </div>

                        <div class="tag-wrapper">
                            <div class="tag-header">
                                <h3>Choose 3 preferred Working Field <span class="optional-text">(optional)</span></h3>
                            </div>
                            <div class="selected-count" id="selectedCount">Selected: 0/3</div>
                            <div class="tags-container">

                            </div>
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
                    <h2>Hello Honorian!</h2>
                    <img src="../images/sign-up-icon.svg" alt="">
                    <p>Let us help you find your workplace and grow your career today</p>
                    <div class="toggle-btn-container">
                        <button id="toggle-signUp-Btn">Sign Up</button>
                    </div>
                </div>
                <div class="toggle-left shift_inactive">
                    <h2>"Connecting students with<br>real-world opportunities"</h2>
                    <div class=" steps">
                        <div class="step active-step">
                            <div class="step-icon left-active-icon"><img src="../images/1User_White.png" alt="Logo">
                            </div>
                            <span class="step-text left-active-text">Personal Information</span>
                        </div>
                        <div class="step">
                            <div class="step-icon"><img src="../images/1Book_White.png" alt="Logo"></div>
                            <span class="step-text">Educational Background</span>
                        </div>
                        <div class="step">
                            <div class="step-icon"><img src="../images/1Briefcase_White.png" alt="Logo"></div>
                            <span class="step-text">Work Preference</span>
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

    <!-- Reset Password UI -->
    <?php include '../Reset Password UI/php/reset_password.php'; ?>

    <script src="../js/modules/globals.js"></script>
    <script src="../js/modules/utils.js"></script>
    <script src="../js/modules/tags.js"></script>
    <script src="../js/modules/api.js"></script>
    <script src="../js/modules/validation.js"></script>
    <script src="../js/modules/auth.js"></script>
    <script src="../js/modules/otp.js"></script>
    <script src="../js/modules/navigation.js"></script>
    <script src="../js/modules/main.js"></script>
    <script src="../js/modules/toast.js"></script>
    <script src="../Reset Password UI/js/reset_password.js"></script>
</body>

</html>
