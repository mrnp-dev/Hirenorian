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
                <div id="circle-left" class="floating parallax" data-speed="3"></div>
                <div id="circle-right" class="floating parallax" data-speed="2"></div>
                <img src="../Images/gradpic2.png" class="fade-up" id="gradpic" alt="">
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
                        <h1 id="headline" class="fade-up">Headline</h1>
                        <h2 id="sub-headline" class="fade-up" style="animation-delay: .2s;">sub headline</h2>
                        <p id="headline-info" class="fade-up" style="animation-delay: .4s;">This text serves as a placeholder<br>while no actual text or<br>information is posted yet.</p>
                    </section>
                </section>

                <section id="socmed-bar" class="fade-up" style="animation-delay: .1s;">

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

            <div class="main-section-2-overlay" aria-hidden="true"></div>

            <section id="companies-section">
                <div id="internships-header">
                    <h2 id="internships-title">Internships</h2>
                    <p id="internships-subheading">Explore fresh opportunities from trusted employer partners.</p>
                </div>

                <section class="companies-cards-holder">
                    <article class="company-card">
                        <div class="company-card__image-wrapper">
                            <img src="../Images/Companies/cloudstaff_workplace.jpg" alt="Cloudstaff workplace" class="company-card__image">
                        </div>
                        <div class="company-card__logo">
                            <img src="../Images/Companies/cloudstaff_logo.jpg" alt="Cloudstaff logo">
                        </div>
                        <div class="company-card__content">
                            <h3 class="company-card__name">Cloudstaff</h3>
                            <p class="company-card__position">Creative Design Intern</p>
                        </div>
                        <button class="company-card__footer">
                            View Internship
                        </button>
                    </article>
                    <article class="company-card">
                        <div class="company-card__image-wrapper">
                            <img src="../Images/Companies/samsung_workplace.webp" alt="Samsung workplace" class="company-card__image">
                        </div>
                        <div class="company-card__logo">
                            <img src="../Images/Companies/samsung_logo.png" alt="Samsung logo">
                        </div>
                        <div class="company-card__content">
                            <h3 class="company-card__name">Samsung</h3>
                            <p class="company-card__position">Software Engineering Intern</p>
                        </div>
                        <button class="company-card__footer">
                            View Internship
                        </button>
                    </article>
                    <article class="company-card">
                        <div class="company-card__image-wrapper">
                            <img src="../Images/Companies/cloudstaff_workplace.jpg" alt="Google workplace" class="company-card__image">
                        </div>
                        <div class="company-card__logo">
                            <img src="../Images/google.jpg" alt="Google logo">
                        </div>
                        <div class="company-card__content">
                            <h3 class="company-card__name">Google</h3>
                            <p class="company-card__position">UX Research Intern</p>
                        </div>
                        <button class="company-card__footer">
                            View Internship
                        </button>
                    </article>
                    <article class="company-card">
                        <div class="company-card__image-wrapper">
                            <img src="../Images/Companies/cloudstaff_workplace.jpg" alt="Hyundai workplace" class="company-card__image">
                        </div>
                        <div class="company-card__logo">
                            <img src="../Images/hyundai.jpg" alt="Hyundai logo">
                        </div>
                        <div class="company-card__content">
                            <h3 class="company-card__name">Hyundai</h3>
                            <p class="company-card__position">Mechanical Intern</p>
                        </div>
                        <button class="company-card__footer">
                            View Internship
                        </button>
                    </article>
                    <article class="company-card">
                        <div class="company-card__image-wrapper">
                            <img src="../Images/Companies/cloudstaff_workplace.jpg" alt="Accenture workplace" class="company-card__image">
                        </div>
                        <div class="company-card__logo">
                            <img src="../Images/google.jpg" alt="Accenture logo">
                        </div>
                        <div class="company-card__content">
                            <h3 class="company-card__name">Vertex Labs</h3>
                            <p class="company-card__position">Data Analyst Intern</p>
                        </div>
                        <button class="company-card__footer">
                            View Internship
                        </button>
                    </article>
                </section>

                <section id="job-more">
                    <button id="more-button">More</button>
                </section>
            </section>

        </section>

        <section id="main-section-3">
            <div class="main-section-3-overlay"></div>

            <div id="top-employers-header">
                <h2 id="top-employers-title">Top Employers</h2>
                <p id="top-employers-subheading">Discover leading companies offering exceptional career opportunities</p>
            </div>

            <div id="employer-cards-holder">
                
                <!-- Employer Card 1 -->
                <article class="employer-card">
                    <div class="employer-card__image-section">
                        <img src="../Images/Companies/hyundai_workplace.avif" alt="Hyundai workplace" class="employer-card__workplace-image">
                        <div class="employer-card__logo">
                            <img src="../Images/hyundai.jpg" alt="Hyundai logo">
                        </div>
                    </div>
                    <div class="employer-card__details">
                        <h3 class="employer-card__company-name">Hyundai</h3>
                        <p class="employer-card__company-type">Automotive Manufacturing</p>
                        <div class="employer-card__positions">
                            <div class="employer-card__position-item">Mechanical Engineer Intern</div>
                            <div class="employer-card__position-item">Automotive Designer</div>
                            <div class="employer-card__position-item">Quality Assurance Specialist</div>
                            <div class="employer-card__position-item">Supply Chain Analyst</div>
                            <div class="employer-card__position-item">Manufacturing Technician</div>
                        </div>
                        <button class="employer-card__button">View Company</button>
                    </div>
                </article>

                <!-- Employer Card 2 -->
                <article class="employer-card">
                    <div class="employer-card__image-section">
                        <img src="../Images/Companies/samsung_workplace.webp" alt="Samsung workplace" class="employer-card__workplace-image">
                        <div class="employer-card__logo">
                            <img src="../Images/samsung.jpg" alt="Samsung logo">
                        </div>
                    </div>
                    <div class="employer-card__details">
                        <h3 class="employer-card__company-name">Samsung</h3>
                        <p class="employer-card__company-type">Technology & Electronics</p>
                        <div class="employer-card__positions">
                            <div class="employer-card__position-item">Software Developer Intern</div>
                            <div class="employer-card__position-item">UX/UI Designer</div>
                            <div class="employer-card__position-item">Data Analyst</div>
                            <div class="employer-card__position-item">Product Manager</div>
                            <div class="employer-card__position-item">Hardware Engineer</div>
                        </div>
                        <button class="employer-card__button">View Company</button>
                    </div>
                </article>

                <!-- Employer Card 3 -->
                <article class="employer-card">
                    <div class="employer-card__image-section">
                        <img src="../Images/Companies/google_workplace.jpeg" alt="Google workplace" class="employer-card__workplace-image">
                        <div class="employer-card__logo">
                            <img src="../Images/google.jpg" alt="Google logo">
                        </div>
                    </div>
                    <div class="employer-card__details">
                        <h3 class="employer-card__company-name">Google</h3>
                        <p class="employer-card__company-type">Technology & Internet Services</p>
                        <div class="employer-card__positions">
                            <div class="employer-card__position-item">Software Engineering Intern</div>
                            <div class="employer-card__position-item">Cloud Solutions Architect</div>
                            <div class="employer-card__position-item">Marketing Specialist</div>
                            <div class="employer-card__position-item">Business Analyst</div>
                            <div class="employer-card__position-item">Technical Support Engineer</div>
                        </div>
                        <button class="employer-card__button">View Company</button>
                    </div>
                </article>

            </div>

        </section>

    </main>

    <footer>

        <section id="footer-section">

            <div id="footer-top-redbar"></div>

            <section id="footer-bottom-section">

                <section id="bottom-left">
                    <p id="footer-Hirenorian" class="fade-up">Hirenorian</p>

                    <section id="footer-buttons" class="fade-up">
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




</body>

</html>