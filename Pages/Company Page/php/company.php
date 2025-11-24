<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet"> 
<link rel="stylesheet" href="../css/company.css">
<title>Company Registration</title>
</head>

<body>

<div class="header">
    <img src="../images/image 4.png" alt="Logo">
    <h1>Hirenorian</h1>
</div>

<div class="wrapper">

    <div class="left-panel">
        
        <div class="p1 active" id="p1">
            <h2>Company Profile</h2>
            <form>
                <div class="fields">
                    <input type="email" placeholder="Company Email Address *" name="email" required>
                    <p>error-message</p>
                </div>
                <div class="fields">
                    <input type="password" placeholder="Password *" name="password1" required>
                    <p>error-message</p>
                </div>
                <div class="fields">
                    <input type="password" placeholder="Confirm Password *" name="password2" required>
                    <p>error-message</p>
                </div>
                <div class="fields">
                    <input type="tel" placeholder="Phone Number *" name="phoneNum" required>
                    <p>error-message</p>
                </div>
                <div class="buttons">
                    <button type="button" class="btn btn-login">Log in</button>
                    <button type="button" class="btn btn-next" id="btn-next1">Next</button>
                </div>
            </form>
        </div>

        <div class="p2" id="p2">
            <h2>Brief Background</h2>
            <form>
                <div class="fields">
                    <input type="text" placeholder="Company Name * " name="companyName" required>
                    <p>error-message</p>
                </div>
                <div class="form-row">
                    <div class="fields">
                        <input type="text" placeholder="Company Type *" name="companyType" id="companyType" required>
                        <p>error-message</p>
                        <div class="dropdown"></div>
                    </div>
                    <div class="fields">
                        <input type="text" placeholder="Industry *"  id="industryType" name="industryType" required>
                        <p>error-message</p>
                        <div class="dropdown"></div>
                    </div>
                </div>
                <div class="fields">
                    <input type="text" placeholder="Company Address *" name="companyAddress" required>
                    <p>error-message</p>
                </div>

                <div class="buttons">
                    <button type="button" class="btn btn-back">Back</button>
                    <button type="button" class="btn btn-next" id="btn-next2">Next</button>
                </div>
            </form>
        </div>

        <div class="p3" id="p3">
            <h2>Who to Contact?</h2>
            <form>
                 <div class="fields">
                    <input type="text" placeholder="Full Name *" name="contactName" required>
                    <p>error-message</p>
                </div>
                <div class="fields">
                    <input type="text" placeholder="Position/Role *" name="contactPosition" required>
                    <p>error-message</p>
                </div>
                <div class="fields">
                    <input type="email" placeholder="Email Address *" name="contactEmail" required>
                    <p>error-message</p>
                </div>
                 <div class="fields">
                    <input type="tel" placeholder="Phone Number *"  name="contactPhone" required>
                    <p>error-message</p>
                </div>

                <div class="buttons">
                    <button type="button" class="btn btn-back">Back</button>
                    <button type="submit" class="btn btn-submit" id="btn-3">Finish</button>
                </div>
            </form>
        </div>
    </div>

    <div class="right-panel">
        <h3>“Connecting students with<br>real-world opportunities”</h3>

        <div class="steps">
            <div class="step active-step">
                <div class="step-icon"><img src="../images/User.png" alt="User Icon"></div>
                <span class="step-text">Company Profile</span>
            </div>
            <div class="step">
                <div class="step-icon"><img src="../images/Book.png" alt="Book Icon"></div>
                <span class="step-text">Brief Background</span>
            </div>
            <div class="step">
                <div class="step-icon"><img src="../images/Briefcase.png" alt="Briefcase Icon"></div>
                <span class="step-text">Who to Contact?</span>
            </div>
        </div>
    </div>
</div>

<script src="../js/CompanyRegistrationPage.js"></script>

</body>
</html>