<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hirenorian - Your Career Starts Here</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Ionicons -->
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="container">
            <div class="logo">
                <img src="../Landing Page/Images/dhvsulogo.png" alt="Hirenorian Logo">
                <span>Hirenorian</span>
            </div>
            <div class="nav-links">
                <a href="#" class="nav-item">Home</a>
                <a href="#companies" class="nav-item">Companies</a>
                <a href="#jobs" class="nav-item">Jobs</a>
                <a href="../Account Registration Pages/Account Selection Page/php/account_selection.php" class="btn btn-primary">Sign In</a>
            </div>
            <div class="mobile-menu-btn">
                <ion-icon name="menu-outline"></ion-icon>
            </div>
        </div>
    </nav>

    <!-- Hero Section with Headline Carousel -->
    <header class="hero">
        <div class="hero-carousel" id="heroCarousel">
            <!-- Carousel Items injected via JS or static -->
            <div class="carousel-item active" style="background-image: linear-gradient(rgba(123, 17, 19, 0.8), rgba(123, 17, 19, 0.6)), url('../Landing Page/Images/dhvsu-bg-image.jpg');">
                <div class="container">
                    <div class="hero-content fade-up">
                        <h1>Get Hired Today</h1>
                        <p>Unlock your potential with premium internships and job opportunities exclusively for DHVSU students.</p>
                        <div class="hero-btns">
                            <a href="../Account Registration Pages/Account Selection Page/php/account_selection.php" class="btn btn-lg btn-secondary">Find Your Career</a>
                            <a href="#how-it-works" class="btn btn-lg btn-outline">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-item" style="background-image: linear-gradient(rgba(123, 17, 19, 0.8), rgba(123, 17, 19, 0.6)), url('../Landing Page/Images/gradpic2.png'); background-position: center top;">
                <div class="container">
                    <div class="hero-content fade-up">
                        <h1>Connect with Top Employers</h1>
                        <p>Bridge the gap between your academic journey and professional success.</p>
                        <div class="hero-btns">
                            <a href="../Account Registration Pages/Account Selection Page/php/account_selection.php" class="btn btn-lg btn-secondary">Join Now</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-controls">
                <button class="prev-btn"><ion-icon name="chevron-back-outline"></ion-icon></button>
                <button class="next-btn"><ion-icon name="chevron-forward-outline"></ion-icon></button>
            </div>
        </div>
        
        <!-- Stats Decoration -->
        <div class="stats-bar">
            <div class="stat">
                <span class="number">500+</span>
                <span class="label">Daily Jobs</span>
            </div>
            <div class="stat">
                <span class="number">100+</span>
                <span class="label">Partners</span>
            </div>
            <div class="stat">
                <span class="number">1k+</span>
                <span class="label">Hired Students</span>
            </div>
        </div>
    </header>

    <!-- News Section -->
    <section class="section news" id="news">
        <div class="container">
            <div class="section-header">
                <h2>Latest News</h2>
                <p>Stay updated with the latest announcements and career tips.</p>
            </div>
            
            <div class="news-slider-container">
                <button class="slider-btn prev" id="newsPrev"><ion-icon name="arrow-back-outline"></ion-icon></button>
                
                <div class="news-slider-wrapper">
                    <div class="news-slider" id="newsSlider">
                        <!-- News Item 1 -->
                        <article class="news-slide">
                            <div class="news-card">
                                <div class="news-image">
                                    <img src="../Landing Page/Images/dhvsu-bg-image.jpg" alt="News Image">
                                </div>
                                <div class="news-content">
                                    <span class="news-date">Oct 24, 2025</span>
                                    <h3>DHVSU Career Fair 2025</h3>
                                    <p>Join us for the biggest career event of the year. Meet top employers face-to-face and discover opportunities that match your skills.</p>
                                    <a href="#" class="read-more">Read More</a>
                                </div>
                            </div>
                        </article>
                        <!-- News Item 2 -->
                        <article class="news-slide">
                            <div class="news-card">
                                <div class="news-image">
                                    <img src="../Landing Page/Images/gradpic2.png" alt="News Image">
                                </div>
                                <div class="news-content">
                                    <span class="news-date">Oct 18, 2025</span>
                                    <h3>Resume Writing Workshop</h3>
                                    <p>Learn how to craft a winning resume with our expert career counselors. Get tips on formatting, content, and how to stand out.</p>
                                    <a href="#" class="read-more">Read More</a>
                                </div>
                            </div>
                        </article>
                        <!-- News Item 3 -->
                        <article class="news-slide">
                            <div class="news-card">
                                <div class="news-image">
                                    <img src="../Landing Page/Images/job.png" alt="News Image">
                                </div>
                                <div class="news-content">
                                    <span class="news-date">Oct 10, 2025</span>
                                    <h3>New Internship Policies</h3>
                                    <p>Important updates regarding internship requirements for the upcoming semester. Make sure you are compliant with the new guidelines.</p>
                                    <a href="#" class="read-more">Read More</a>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

                <button class="slider-btn next" id="newsNext"><ion-icon name="arrow-forward-outline"></ion-icon></button>
            </div>
        </div>
    </section>

    <!-- Recommended / Featured Section -->
    <section class="section recommended" id="recommended">
        <div class="container">
            <div class="section-header">
                <h2>Recommended For You</h2>
                <p>Curated opportunities matching your potential.</p>
            </div>
            
            <div class="cards-slider-wrapper">
                <button class="slider-btn prev" id="recPrev"><ion-icon name="arrow-back-outline"></ion-icon></button>
                <div class="cards-slider" id="recSlider">
                    <!-- Card 1 -->
                    <div class="job-card">
                        <div class="card-header">
                            <img src="../Landing Page/Images/Companies/cloudstaff_logo.jpg" alt="Cloudstaff">
                            <span class="badge">Internship</span>
                        </div>
                        <div class="card-body">
                            <h3>Creative Design Intern</h3>
                            <p class="company">Cloudstaff</p>
                            <div class="tags">
                                <span>Design</span>
                                <span>Multimedia</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="link">View Details</a>
                        </div>
                    </div>
                    <!-- Card 2 -->
                    <div class="job-card">
                        <div class="card-header">
                            <img src="../Landing Page/Images/Companies/samsung_logo.png" alt="Samsung">
                            <span class="badge">Full Time</span>
                        </div>
                        <div class="card-body">
                            <h3>Software Engineer</h3>
                            <p class="company">Samsung</p>
                            <div class="tags">
                                <span>Development</span>
                                <span>Java</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="link">View Details</a>
                        </div>
                    </div>
                    <!-- Card 3 -->
                    <div class="job-card">
                        <div class="card-header">
                            <img src="../Landing Page/Images/google.jpg" alt="Google">
                            <span class="badge">Internship</span>
                        </div>
                        <div class="card-body">
                            <h3>UX Research Intern</h3>
                            <p class="company">Google</p>
                            <div class="tags">
                                <span>Research</span>
                                <span>UI/UX</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="link">View Details</a>
                        </div>
                    </div>
                    <!-- Card 4 -->
                    <div class="job-card">
                        <div class="card-header">
                            <img src="../Landing Page/Images/hyundai.jpg" alt="Hyundai">
                            <span class="badge">Part Time</span>
                        </div>
                        <div class="card-body">
                            <h3>Mechanical Intern</h3>
                            <p class="company">Hyundai</p>
                            <div class="tags">
                                <span>Engineering</span>
                                <span>Auto</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="link">View Details</a>
                        </div>
                    </div>
                    <!-- Card 5 -->
                     <div class="job-card">
                        <div class="card-header">
                            <div class="logo-placeholder">A</div>
                            <span class="badge">Internship</span>
                        </div>
                        <div class="card-body">
                            <h3>Data Analyst Intern</h3>
                            <p class="company">Accenture</p>
                            <div class="tags">
                                <span>Data</span>
                                <span>Analytics</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="link">View Details</a>
                        </div>
                    </div>
                </div>
                <button class="slider-btn next" id="recNext"><ion-icon name="arrow-forward-outline"></ion-icon></button>
            </div>
        </div>
    </section>

    <!-- Value Proposition -->
    <section class="section features" id="how-it-works">
        <div class="container">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="icon-box">
                        <ion-icon name="search-outline"></ion-icon>
                    </div>
                    <h3>Smart Search</h3>
                    <p>Filter opportunities by your specific skills, preferred location, and career interests.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">
                        <ion-icon name="briefcase-outline"></ion-icon>
                    </div>
                    <h3>Top Companies</h3>
                    <p>Connect directly with industry leaders and trusted partners looking for DHVSU talent.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">
                        <ion-icon name="rocket-outline"></ion-icon>
                    </div>
                    <h3>Fast Track</h3>
                    <p>Apply with your optimized profile and get hired faster than standard job boards.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h2>Hirenorian</h2>
                    <p>The official career portal for DHVSU students.</p>
                    <div class="socials">
                        <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                        <a href="#"><ion-icon name="logo-linkedin"></ion-icon></a>
                        <a href="#"><ion-icon name="logo-instagram"></ion-icon></a>
                    </div>
                </div>
                <div class="footer-links">
                    <div class="link-group">
                        <h4>Platform</h4>
                        <a href="#">Browse Jobs</a>
                        <a href="#">Companies</a>
                        <a href="#">Login</a>
                    </div>
                    <div class="link-group">
                        <h4>Support</h4>
                        <a href="#">Help Center</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Hirenorian. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>
