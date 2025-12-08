<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet"> 
<link rel="stylesheet" href="company.css">
<title>Company Registration</title>
</head>

<body>

<div class="header">
    <img src="images/DHVSU-LOGO.png" alt="Logo">
    <h1>Hirenorian</h1>
</div>

<div class="wrapper">

    <div class="left-panel">
        
        <div class="p1 active">
            <h2>Company Profile</h2>
            <form>
                <input type="email" placeholder="Company Email Address *" required>
                <input type="password" placeholder="Password *" required>
                <input type="password" placeholder="Confirm Password *" required>
                <input type="tel" placeholder="Phone Number *" required>
                
                <div class="buttons">
                    <button type="button" class="btn btn-login">Log in</button>
                    <button type="button" class="btn btn-next">Next</button>
                </div>
            </form>
        </div>

        <div class="p2">
            <h2>Brief Background</h2>
            <form>
                <input type="text" placeholder="Company Name *" required>
                <div class="form-row">
                    <input type="text" placeholder="Company Type *" required>
                    <input type="text" placeholder="Industry *" required>
                </div>
                <input type="text" placeholder="Company Address *" required>

                <div class="buttons">
                    <button type="button" class="btn btn-back">Back</button>
                    <button type="button" class="btn btn-next">Next</button>
                </div>
            </form>
        </div>

        <div class="p3">
            <h2>Who to Contact?</h2>
            <form>
                <input type="text" placeholder="Full Name *" required>
                <input type="text" placeholder="Position/Role *" required>
                <input type="email" placeholder="Email Address *" required>
                <input type="tel" placeholder="Phone Number *" required>

                <div class="buttons">
                    <button type="button" class="btn btn-back">Back</button>
                    <button type="submit" class="btn btn-submit">Finish</button>
                </div>
            </form>
        </div>
    </div>

    <div class="right-panel">
        <h3>“Connecting students with<br>real-world opportunities”</h3>

        <div class="steps">
            <div class="step active-step">
                <div class="step-icon"><img src="images/userlogo.png" alt="User Icon"></div>
                <span class="step-text">Company Profile</span>
            </div>
            <div class="step">
                <div class="step-icon"><img src="images/booklogo-removebg-preview.png" alt="Book Icon"></div>
                <span class="step-text">Brief Background</span>
            </div>
            <div class="step">
                <div class="step-icon"><img src="images/contact-removebg-preview.png" alt="Briefcase Icon"></div>
                <span class="step-text">Who to Contact?</span>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".p1, .p2, .p3");
    const stepIndicators = document.querySelectorAll(".step");
    let current = 0;

    function showPage(n) {
        pages.forEach(p => p.classList.remove("active"));
        stepIndicators.forEach(s => s.classList.remove("active-step"));
        
        pages[n].classList.add("active");
        stepIndicators[n].classList.add("active-step");
    }
    showPage(current);

    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            if (current < pages.length - 1) {
                current++;
                showPage(current);
            }
        });
    });

    document.querySelectorAll(".btn-back").forEach(btn => {
        btn.addEventListener("click", () => {
            if (current > 0) {
                current--;
                showPage(current);
            }
        });
    });
});
</script>

</body>
</html>