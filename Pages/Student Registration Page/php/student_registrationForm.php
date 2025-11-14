<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../css/student_registrationForm.css">
    <title>Student sign in 1</title>
</head>

<body>
    <div class="header">
        <img src="../images/DHVSU-LOGO.png" alt="Logo">
        <h1>Hirenorian</h1>
    </div>

    <div class="wrapper">
        <div class="left">
            <h2>“Connecting students with<br>real-world opportunities”</h2>
            <div class="steps">
                <div class="step active-step">
                    <div class="step-icon left-active-icon"><img src="../images/1User_White.png" alt="Logo"></div>
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
        </div>

        <div class="right">
            <h1 id="title">Personalize your Profile</h1>
            <form action="">
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
                            <input type="text" id="middleInitial-input" name="Middle Initial" placeholder="Middle Initial *" minlength="1" maxlength="2">
                            <p>error</p>
                        </div>

                        <div class="input-wrapper">
                            <input type="text" id="suffix-input" name="Suffix" placeholder="Suffix (optional)">
                            <p>error</p>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="input-wrapper">
                            <input type="text" id="email-input" name="Email" placeholder="Personal Email *">
                            <p>error</p>
                        </div>

                        <div class="input-wrapper">
                            <input type="text" id="phoneNumber-input" name="Phone Number" placeholder="Phone No *" minlength="11" maxlength="13">
                            <p>error</p>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" id="password-input" name="Password" placeholder="Password *">
                        <p>error</p>
                        <button type="button" class="toggle_show_hide" id="togglePassword" onclick="toggleShow_Hide_Password()"><i class="fa fa-eye"></i></button>
                    </div>

                    <div class="input-wrapper">
                        <input type="password" id="confirmPass-input" name="Confirm Password" placeholder="Confirm Password *">
                        <p>error</p>
                        <button type="button" class="toggle_show_hide" id="toggleConfirmPassword" onclick="toggleShow_Hide_Password()"><i class="fa fa-eye"></i></button>
                    </div>

                    <div class="button-container">
                        <button type="button" class="btn btn-landing">Back to Landing</button>
                        <button type="button" id="first_nextBtn" onclick="goNext(this)" class="btn btn-next">Next</button>
                    </div>
                </div>

                <div class="form-section" id="secondInputs">
                    <div class="input-wrapper">
                        <input type="text" id="univ-input" name="University/Campus" placeholder="University / Campus *">
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
                        <div class="input-wrapper">
                            <input type="text" id="studNum-input" name="Student Number" placeholder="Student No *">
                            <p>error</p>
                        </div>
                        <div class="input-wrapper">
                            <input type="text" id="schoolEmail-input" name="School Email" placeholder="School Email *">
                            <p>error</p>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <input type="text" id="org-input" name="Organization" placeholder="Organization (optional)">
                        <div class="suggestions"></div>
                        <p>error</p>
                    </div>

                    <div class="button-container">
                        <button type="button" class="btn btn-landing" onclick="goToPreviousSection(this)">Back</button>
                        <button type="button" id="second_nextBtn" class="btn btn-next" onclick="goToLast(this)">Next</button>
                    </div>
                </div>
                <div class="form-section" id="thirdInputs">
                    <div class="input-wrapper">
                        <input type="text" id="job1-input" name="Job Classification 1" placeholder="Job Classification 1 *">
                        <div class="suggestions"></div>
                        <p>error</p>
                    </div>

                    <div class="input-wrapper">
                        <input type="text" id="job2-input" name="Job Classification 2" placeholder="Job Classification 2 *">
                        <div class="suggestions"></div>
                        <p>error</p>
                    </div>

                    <div class="input-wrapper">
                        <input type="text" id="job3-input" name="Job Classification 3" placeholder="Job Classification 3 *">
                        <div class="suggestions"></div>
                        <p>error</p>
                    </div>

                    <div class="input-wrapper">
                        <input type="text" id="location-input" name="Ideal Location" placeholder="Ideal Location *">
                        <div class="suggestions"></div>
                        <p>error</p>
                    </div>

                    <div class="button-container">
                        <button type="button" class="btn btn-back" onclick="goToPreviousSection(this)">Back</button>
                        <button type="button" class="btn btn-submit" onclick="submitTheForm(this)">Finish</button>
                    </div>
                </div>
            </form>
            <script src="../js/student_registrationForm.js"></script>
        </div>
    </div>

</body>

</html>