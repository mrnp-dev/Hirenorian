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
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        maroon: {
                            DEFAULT: '#7b1113',
                            dark: '#5a0c0e',
                        },
                        yellow: {
                            DEFAULT: '#ffc107',
                            dark: '#e0a800',
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        .carousel-item.active {
            opacity: 1;
            visibility: visible;
        }
        .carousel-item {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.8s ease-in-out, visibility 0.8s;
        }
    </style>
    <!-- Ionicons -->
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body class="font-sans antialiased text-gray-900 bg-slate-50">

    <!-- Navbar -->
    <nav class="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <div class="flex items-center gap-3">
                    <img src="../../Landing Page/Images/dhvsulogo.png" alt="Hirenorian Logo" class="h-12 w-auto">
                    <span class="text-2xl font-extrabold text-maroon uppercase tracking-wide">Hirenorian</span>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#" class="text-gray-700 hover:text-maroon font-medium transition-colors">Home</a>
                    <a href="#companies" class="text-gray-700 hover:text-maroon font-medium transition-colors">Companies</a>
                    <a href="#jobs" class="text-gray-700 hover:text-maroon font-medium transition-colors">Jobs</a>
                    <a href="../Account Registration Pages/Account Selection Page/php/account_selection.php" class="bg-maroon text-white px-6 py-2.5 rounded-full font-semibold border-2 border-maroon hover:bg-transparent hover:text-maroon transition-all">Sign In</a>
                </div>
                <div class="md:hidden flex items-center">
                    <button class="text-3xl text-gray-700 focus:outline-none">
                        <ion-icon name="menu-outline"></ion-icon>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative h-screen overflow-hidden">
        <div class="absolute inset-0 w-full h-full" id="heroCarousel">
            
            <!-- Slide 1 -->
            <div class="carousel-item active absolute inset-0 w-full h-full bg-cover bg-center" 
                style="background-image: linear-gradient(rgba(123, 17, 19, 0.8), rgba(123, 17, 19, 0.6)), url('../Landing Page/Images/dhvsu-bg-image.jpg');">
                <div class="max-w-7xl mx-auto px-4 h-full flex items-center text-white">
                    <div class="max-w-2xl pt-20 animate-[fadeUp_1s_ease-out_forwards]">
                        <h1 class="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg leading-tight">Get Hired Today</h1>
                        <p class="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">Unlock your potential with premium internships and job opportunities exclusively for DHVSU students.</p>
                        <div class="flex flex-wrap gap-4">
                            <a href="../Account Registration Pages/Account Selection Page/php/account_selection.php" class="bg-yellow text-gray-900 px-8 py-3.5 rounded-full text-lg font-bold hover:bg-yellow-dark transition-colors">Find Your Career</a>
                            <a href="#how-it-works" class="border-2 border-white text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-white hover:text-maroon transition-colors">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-item absolute inset-0 w-full h-full bg-cover" 
                 style="background-image: linear-gradient(rgba(123, 17, 19, 0.8), rgba(123, 17, 19, 0.6)), url('../Landing Page/Images/gradpic2.png'); background-position: center top;">
                <div class="max-w-7xl mx-auto px-4 h-full flex items-center text-white">
                    <div class="max-w-2xl pt-20">
                        <h1 class="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg leading-tight">Connect with Top Employers</h1>
                        <p class="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">Bridge the gap between your academic journey and professional success.</p>
                        <div>
                            <a href="../Account Registration Pages/Account Selection Page/php/account_selection.php" class="bg-yellow text-gray-900 px-8 py-3.5 rounded-full text-lg font-bold hover:bg-yellow-dark transition-colors">Join Now</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Controls -->
            <button class="prev-btn absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-maroon hover:border-maroon transition-all">
                <ion-icon name="chevron-back-outline" class="text-2xl"></ion-icon>
            </button>
            <button class="next-btn absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-maroon hover:border-maroon transition-all">
                <ion-icon name="chevron-forward-outline" class="text-2xl"></ion-icon>
            </button>
        </div>

        <!-- Stats Bar -->
        <div class="absolute bottom-0 w-full bg-maroon/90 backdrop-blur-sm border-t border-white/10 py-8">
            <div class="max-w-7xl mx-auto px-4 flex justify-around md:justify-center md:gap-32 text-center text-white">
                <div>
                    <span class="block text-3xl md:text-4xl font-bold text-yellow">500+</span>
                    <span class="text-xs md:text-sm uppercase tracking-wider opacity-80">Daily Jobs</span>
                </div>
                <div>
                    <span class="block text-3xl md:text-4xl font-bold text-yellow">100+</span>
                    <span class="text-xs md:text-sm uppercase tracking-wider opacity-80">Partners</span>
                </div>
                <div>
                    <span class="block text-3xl md:text-4xl font-bold text-yellow">1k+</span>
                    <span class="text-xs md:text-sm uppercase tracking-wider opacity-80">Hired Students</span>
                </div>
            </div>
        </div>
    </header>

    <!-- News Section -->
    <section class="py-24 bg-white" id="news">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-maroon mb-4">Latest News</h2>
                <p class="text-lg text-gray-600">Stay updated with the latest announcements and career tips.</p>
            </div>

            <!-- News Slider Container -->
            <div class="relative max-w-6xl mx-auto group news-slider-group px-16">
                 <!-- Prev Button -->
                <button id="newsPrev" class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-maroon hover:bg-maroon hover:text-white transition-all z-10 border border-gray-100">
                    <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
                </button>

                <!-- Slider Wrapper -->
                <div class="overflow-hidden rounded-2xl shadow-xl bg-slate-50">
                    <div id="newsSlider" class="flex transition-transform duration-500 ease-in-out">
                         
                        <!-- News 1 -->
                        <div class="min-w-full flex flex-col md:flex-row h-auto md:h-[500px]">
                            <div class="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                                <img src="../../Landing Page/Images/dhvsu-bg-image.jpg" alt="Dhvsu" class="absolute inset-0 w-full h-full object-cover">
                            </div>
                            <div class="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                                <span class="text-sm font-bold text-gray-400 mb-4 block">Oct 24, 2025</span>
                                <h3 class="text-3xl lg:text-4xl font-bold text-maroon mb-6 leading-tight">DHVSU Career Fair 2025</h3>
                                <p class="text-gray-600 mb-8 text-lg leading-relaxed">Join us for the biggest career event of the year. Meet top employers face-to-face and discover opportunities that match your skills.</p>
                                <a href="#" class="inline-flex items-center text-maroon font-bold text-base uppercase tracking-wide hover:text-maroon-dark hover:underline">Read More <ion-icon name="arrow-forward-outline" class="ml-2"></ion-icon></a>
                            </div>
                        </div>

                        <!-- News 2 -->
                        <div class="min-w-full flex flex-col md:flex-row h-auto md:h-[500px]">
                            <div class="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                                <img src="../../Landing Page/Images/gradpic2.png" alt="Graduation" class="absolute inset-0 w-full h-full object-cover">
                            </div>
                            <div class="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                                <span class="text-sm font-bold text-gray-400 mb-4 block">Oct 18, 2025</span>
                                <h3 class="text-3xl lg:text-4xl font-bold text-maroon mb-6 leading-tight">Resume Writing Workshop</h3>
                                <p class="text-gray-600 mb-8 text-lg leading-relaxed">Learn how to craft a winning resume with our expert career counselors. Get tips on formatting, content, and how to stand out.</p>
                                <a href="#" class="inline-flex items-center text-maroon font-bold text-base uppercase tracking-wide hover:text-maroon-dark hover:underline">Read More <ion-icon name="arrow-forward-outline" class="ml-2"></ion-icon></a>
                            </div>
                        </div>

                        <!-- News 3 -->
                        <div class="min-w-full flex flex-col md:flex-row h-auto md:h-[500px]">
                            <div class="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                                <img src="../../Landing Page/Images/job.png" alt="Job" class="absolute inset-0 w-full h-full object-cover">
                            </div>
                            <div class="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                                <span class="text-sm font-bold text-gray-400 mb-4 block">Oct 10, 2025</span>
                                <h3 class="text-3xl lg:text-4xl font-bold text-maroon mb-6 leading-tight">New Internship Policies</h3>
                                <p class="text-gray-600 mb-8 text-lg leading-relaxed">Important updates regarding internship requirements for the upcoming semester. Make sure you are compliant with the new guidelines.</p>
                                <a href="#" class="inline-flex items-center text-maroon font-bold text-base uppercase tracking-wide hover:text-maroon-dark hover:underline">Read More <ion-icon name="arrow-forward-outline" class="ml-2"></ion-icon></a>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Next Button -->
                <button id="newsNext" class="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-maroon hover:bg-maroon hover:text-white transition-all z-10 border border-gray-100">
                    <ion-icon name="arrow-forward-outline" class="text-xl"></ion-icon>
                </button>
            </div>

        </div>
    </section>

    <!-- Recommended Section -->
    <section class="py-24 bg-slate-50" id="recommended">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-maroon mb-4">Recommended For You</h2>
                <p class="text-lg text-gray-600">Curated opportunities matching your potential.</p>
            </div>

            <div class="relative px-4 md:px-12 group">
                <button id="recPrev" class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-maroon hover:bg-maroon hover:text-white transition-all z-10 invisible group-hover:visible translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-300">
                    <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
                </button>
                
                <div id="recSlider" class="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth" style="scrollbar-width: none;">
                    
                    <!-- Card 1 -->
                    <div class="min-w-[320px] bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-maroon/10 snap-start">
                        <div class="flex justify-between items-start mb-6">
                            <img src="../../Landing Page/Images/Companies/cloudstaff_logo.jpg" alt="Cloudstaff" class="h-10 w-auto object-contain">
                            <span class="bg-yellow/20 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Internship</span>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-1">Creative Design Intern</h3>
                            <p class="text-gray-500 text-sm">Cloudstaff</p>
                        </div>
                        <div class="flex gap-2 mb-6">
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Design</span>
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Multimedia</span>
                        </div>
                        <div class="mt-auto">
                            <a href="#" class="inline-flex items-center text-maroon font-semibold text-sm hover:underline">View Details <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon></a>
                        </div>
                    </div>

                    <!-- Card 2 -->
                    <div class="min-w-[320px] bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-maroon/10 snap-start">
                        <div class="flex justify-between items-start mb-6">
                            <img src="../../Landing Page/Images/Companies/samsung_logo.png" alt="Samsung" class="h-10 w-auto object-contain">
                            <span class="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Full Time</span>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-1">Software Engineer</h3>
                            <p class="text-gray-500 text-sm">Samsung</p>
                        </div>
                        <div class="flex gap-2 mb-6">
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Dev</span>
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Java</span>
                        </div>
                        <div class="mt-auto">
                            <a href="#" class="inline-flex items-center text-maroon font-semibold text-sm hover:underline">View Details <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon></a>
                        </div>
                    </div>

                     <!-- Card 3 -->
                     <div class="min-w-[320px] bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-maroon/10 snap-start">
                        <div class="flex justify-between items-start mb-6">
                            <img src="../../Landing Page/Images/google.jpg" alt="Google" class="h-10 w-auto object-contain">
                            <span class="bg-yellow/20 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Internship</span>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-1">UX Research Intern</h3>
                            <p class="text-gray-500 text-sm">Google</p>
                        </div>
                        <div class="flex gap-2 mb-6">
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Research</span>
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">UI/UX</span>
                        </div>
                        <div class="mt-auto">
                            <a href="#" class="inline-flex items-center text-maroon font-semibold text-sm hover:underline">View Details <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon></a>
                        </div>
                    </div>

                     <!-- Card 4 -->
                     <div class="min-w-[320px] bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-maroon/10 snap-start">
                        <div class="flex justify-between items-start mb-6">
                            <img src="../../Landing Page/Images/hyundai.jpg" alt="Hyundai" class="h-10 w-auto object-contain">
                            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Part Time</span>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-1">Mechanical Intern</h3>
                            <p class="text-gray-500 text-sm">Hyundai</p>
                        </div>
                        <div class="flex gap-2 mb-6">
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Engineering</span>
                            <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-medium">Auto</span>
                        </div>
                        <div class="mt-auto">
                            <a href="#" class="inline-flex items-center text-maroon font-semibold text-sm hover:underline">View Details <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon></a>
                        </div>
                    </div>

                </div>

                <button id="recNext" class="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-maroon hover:bg-maroon hover:text-white transition-all z-10 invisible group-hover:visible -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-300">
                    <ion-icon name="arrow-forward-outline" class="text-xl"></ion-icon>
                </button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white" id="features">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="group text-center bg-slate-50 p-10 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div class="w-20 h-20 bg-white group-hover:bg-yellow rounded-full flex items-center justify-center text-4xl text-maroon group-hover:text-gray-900 shadow-sm mx-auto mb-6 transition-all">
                        <ion-icon name="search-outline"></ion-icon>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Smart Search</h3>
                    <p class="text-gray-600 leading-relaxed">Filter opportunities by your specific skills, preferred location, and career interests.</p>
                </div>
                <div class="group text-center bg-slate-50 p-10 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div class="w-20 h-20 bg-white group-hover:bg-yellow rounded-full flex items-center justify-center text-4xl text-maroon group-hover:text-gray-900 shadow-sm mx-auto mb-6 transition-all">
                        <ion-icon name="briefcase-outline"></ion-icon>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Top Companies</h3>
                    <p class="text-gray-600 leading-relaxed">Connect directly with industry leaders and trusted partners looking for DHVSU talent.</p>
                </div>
                <div class="group text-center bg-slate-50 p-10 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div class="w-20 h-20 bg-white group-hover:bg-yellow rounded-full flex items-center justify-center text-4xl text-maroon group-hover:text-gray-900 shadow-sm mx-auto mb-6 transition-all">
                        <ion-icon name="rocket-outline"></ion-icon>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Fast Track</h3>
                    <p class="text-gray-600 leading-relaxed">Apply with your optimized profile and get hired faster than standard job boards.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Outro Section -->
    <section class="py-24 bg-maroon text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('../Landing Page/Images/dhvsu-bg-image.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight">Ready to Launch Your Career?</h2>
            <p class="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of DHVSU students who have already discovered their dream careers.
                Whether you're looking for internships, part-time opportunities, or full-time positions,
                Hirenorian connects you with top employers ready to welcome fresh talent.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <button class="bg-yellow text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-dark transition-transform hover:-translate-y-1 shadow-lg shadow-yellow/20">Get Started Now</button>
                <button class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-maroon transition-transform hover:-translate-y-1">Learn More</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-12">
                <div>
                    <div class="text-4xl font-bold text-yellow mb-2">500+</div>
                    <div class="text-sm uppercase tracking-widest opacity-70">Job Postings</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-yellow mb-2">100+</div>
                    <div class="text-sm uppercase tracking-widest opacity-70">Partner Companies</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-yellow mb-2">1000+</div>
                    <div class="text-sm uppercase tracking-widest opacity-70">Students Hired</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#1a1a1a] text-white">
        <!-- Red Bar -->
        <div class="h-2 bg-maroon w-full"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <!-- Brand & Socials -->
                <div class="lg:col-span-2">
                    <h2 class="text-4xl font-black text-white mb-8 tracking-wide">Hirenorian</h2>
                    
                    <div class="flex gap-4">
                        <button class="hover:scale-110 transition-transform">
                            <img src="../../Landing Page/Images/fbicon.png" alt="Facebook" class="w-10 h-10 object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all">
                        </button>
                        <button class="hover:scale-110 transition-transform">
                            <img src="../../Landing Page/Images/linkedin.png" alt="LinkedIn" class="w-10 h-10 object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all">
                        </button>
                        <button class="hover:scale-110 transition-transform">
                            <img src="../../Landing Page/Images/yticon.png" alt="YouTube" class="w-10 h-10 object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all">
                        </button>
                        <button class="hover:scale-110 transition-transform">
                            <img src="../../Landing Page/Images/igicon.png" alt="Instagram" class="w-10 h-10 object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all">
                        </button>
                    </div>
                </div>

                <!-- Links Columns -->
                <div class="lg:col-span-3 grid grid-cols-3 gap-8">
                    <!-- Column 1 -->
                    <div>
                        <h4 class="text-yellow font-bold uppercase tracking-wider mb-6 text-sm">Topic</h4>
                        <ul class="space-y-4">
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                        </ul>
                    </div>

                    <!-- Column 2 -->
                    <div>
                        <h4 class="text-yellow font-bold uppercase tracking-wider mb-6 text-sm">Topic</h4>
                        <ul class="space-y-4">
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                        </ul>
                    </div>

                     <!-- Column 3 -->
                     <div>
                        <h4 class="text-yellow font-bold uppercase tracking-wider mb-6 text-sm">Topic</h4>
                        <ul class="space-y-4">
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Page</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </div>
    </footer>

    <script src="../js/script.js"></script>
</body>
</html>
