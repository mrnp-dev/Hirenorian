<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Fonts links -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <!-- Styles -->

    <link href="../css/landing_page.css" rel="stylesheet">
    <link href="../css/landing_header.css" rel="stylesheet">
    <link href="../css/landing_main_section1.css" rel="stylesheet">
    <link href="../css/landing_main_section2.css" rel="stylesheet">
    <link href="../css/landing_main_section3.css" rel="stylesheet">
    <link href="../css/main_footer.css" rel="stylesheet">

    <script type="module" src="../js/ElementInitializer.js"></script>
    <title>Document</title>

</head>

<body>
    <header id="header-section">
        <nav id="navbar">

            <section id="navbar-left">
                <img src="../Images/dhvsulogo.png" id="imglogo" alt="hirenorian-logo">
                <h1 id="navbar-title">Hirenorian</h1>
            </section>

            <section id="navbar-right">
                <button id="sign-in">Sign In</button>
            </section>

        </nav>

        <section id="find-career-section">

            <section id="find-your-career-left-section">
                <h1 id="get-hired-today" class="fade-up">GET HIRED<br>TODAY</h1>
                <p id="hirenorian-info" class="fade-up" style="animation-delay: .2s;">Hirenorian is a career hub designed for DHVSU<br>students to explore job postings and internship<br>opportunities. Discover openings tailored to<br>your skills, connect with employers, and take<br>the next step toward your future career—all in<br>one place.</p>
                <div id="find-your-career-div" class="fade-up" style="animation-delay: .4s;"><button id="find-your-career-button">Find your Career</button></div>
                <div></div>
            </section>

            <section id="find-your-career-right-section">
                <div id="circle-left"  class="floating parallax" data-speed="3"></div>
                <div id="circle-right"  class="floating parallax" data-speed="2"></div>
                <img src="../Images/gradpic2.png" id="gradpic" class="floating parallax" data-speed="1.5" alt="">
            </section>


        </section>
        <div id="left-circle-yellow" class="floating parallax" data-speed="4"></div>

    </header>

    <main>

        <section id="main-section-1">
            <section id="headline-section">
                <section id="headline-section-top">
                    <section id="headline-left-section"></section>

                    <section id="headline-right-section">
                        <h1 id="headline">Headline</h1>
                        <h2 id="sub-headline">sub headline</h2>
                        <p id="headline-info">This text serves as a placeholder<br>while no actual text or<br>information is posted yet.</p>
                    </section>
                </section>

                <section id="socmed-bar">

                    <section id="socmed-left-bar">
                        <button class="icon"><img src="../Images/fbicon.png" alt="Facebook" class="icon" id="fb"></button>
                        <button class="icon"><img src="../Images/linkedin.png" alt="Youtube" class="icon" id="in"></button>
                        <button class="icon"><img src="../Images/yticon.png" alt="Youtube" class="icon" id="yt"></button>
                        <button class="icon"><img src="../Images/igicon.png" alt="Instagram" class="icon" id="ig"></button>
                    </section>

                    <section>
                        <p id="hirenoriantext">hirenorian.com</p>
                    </section>

                </section>
            </section>
        </section>

        <section id="main-section-2">

            <section id="companies-section">

                <section class="company-card">
                    <div class="company-card-top">
                        <img src="../Images/cloudstaff.jpg" class="company-logo" alt="Cloudstaff logo">
                    </div>

                    <div class="company-card-middle">
                        <h3 class="company-name">Cloudstaff</h3>
                        <h2 class="company-position">UI/UX Web Designer</h2>
                        <p class="company-tagline">Join the #1 workplace in the Philippines and design experiences that matter.</p>
                    </div>

                    <div class="company-card-info">
                        <p><strong>Location:</strong> Angeles City, Pampanga</p>
                        <p><strong>Job Type:</strong> Full-time</p>
                        <p><strong>Salary:</strong> ₱30,000 – ₱45,000/month</p>
                    </div>

                    <div class="company-card-bottom">
                        <button>Apply Now</button>
                    </div>
                </section>

            </section>

            <section id="job-more">
                <button id="more-button">More</button>
            </section>

        </section>

        <section id="employers-section">

            <section id="top-employers-section">
                <h2 id="top-employer">TOP EMPLOYERS</h2>
                <p id="discover">Discover companies offering great opportunities for students and graduates</p>
            </section>

            <section class="employer-container">
                <section class="employer-card">
                    <section id="rank1">1</section>
                    <img src="../Images/hyundai.jpg" id="Hyundai">
                    <h3>Hyundai</h3>
                    <p>Car company</p>
                    <button id="button-job-one"> View Job</button>
                </section>

                <section class="employer-card">
                    <section id="rank2">2</section>
                    <img src="../Images/samsung.jpg" id="Samsung">
                    <h3>Samsung</h3>
                    <p>Technology</p>
                    <button id="button-job-two"> View Job </button>
                </section>

                <section class="employer-card">
                    <section id="rank3">3</section>
                    <img src="../Images/google.jpg" id="Google">
                    <h3>Google</h3>
                    <p>Technology</p>
                    <button id="button-job-three"> View Job </button>
                </section>

            </section>

        </section>

    </main>

    <footer>

        <section id="footer-section">

            <div id="footer-top-redbar"></div>

            <section id="footer-bottom-section">

                <section id="bottom-left">
                    <p id="footer-Hirenorian">Hirenorian</p>

                    <section id="footer-buttons">
                        <button class="icon2"><img src="../Images/fbicon.png" alt="Facebook" class="icon2" id="fb2"></button>
                        <button class="icon2"><img src="../Images/linkedin.png" alt="Youtube" class="icon2" id="in2"></button>
                        <button class="icon2"><img src="../Images/yticon.png" alt="Youtube" class="icon2" id="yt2"></button>
                        <button class="icon2"><img src="../Images/igicon.png" alt="Instagram" class="icon2" id="ig2"></button>
                    </section>
                </section>

                <section id="bottom-right">
                    <section class="topics-section">
                        <p class="topic">Topic</p>
                        <p class="pages">Page</p>
                        <p class="pages">Page</p>
                        <p class="pages">Page</p>
                    </section>

                    <section class="topics-section">
                        <p class="topic">Topic</p>
                        <p class="pages">Page</p>
                        <p class="pages">Page</p>
                        <p class="pages">Page</p>
                    </section>

                    <section class="topics-section">
                        <p class="topic">Topic</p>
                        <p class="pages">Page</p>
                        <p class="pages">Page</p>
                        <p class="pages">Page</p>
                    </section>
                </section>
            </section>

        </section>

    </footer>

    <script>
        document.addEventListener("mousemove", (e) => {
        document.querySelectorAll(".parallax").forEach(el => {
        const speed = parseFloat(el.getAttribute("data-speed"));
        const x = (window.innerWidth - e.pageX * speed) / 120;
        const y = (window.innerHeight - e.pageY * speed) / 120;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});
</script>

</body>

</html>