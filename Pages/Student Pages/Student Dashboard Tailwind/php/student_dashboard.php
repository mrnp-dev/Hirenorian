<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    $student_id = $_SESSION['student_id'];
    
    // Fetch student information from API
    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php";
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "student_email" => $student_email
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Initialize default values
    $first_name = "Student";
    $last_name = "";
    $profile_picture = "";
    
    if ($response !== false) {
        $data = json_decode($response, true);
        
        if (isset($data['status']) && $data['status'] === "success") {
            $basic_info = $data['data']['basic_info'];
            $profile = $data['data']['profile'];
            
            $first_name = $basic_info['first_name'];
            $last_name = $basic_info['last_name'];
            $profile_picture_db = $profile['profile_picture'];
            
            // Convert VPS absolute path to HTTP URL
            if (!empty($profile_picture_db)) {
                $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
            }
        }
    }
}
else
{
    // Redirect or handle unauthenticated state
    echo "<script>console.log('email not in session');</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Hirenorian</title>
    
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

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9; 
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
        }
    </style>
</head>
<body class="font-sans antialiased bg-slate-50 text-gray-800">

    <div class="flex h-screen overflow-hidden">
        
        <!-- Sidebar -->
        <aside class="w-64 bg-maroon text-white flex-shrink-0 hidden md:flex flex-col transition-all duration-300">
            <div class="h-20 flex items-center gap-3 px-6 border-b border-white/10">
                <img src="../../../Landing Page/Images/dhvsulogo.png" alt="Logo" class="h-10 w-auto bg-white rounded-full p-0.5">
                <span class="font-bold text-lg tracking-wide">Hirenorian</span>
            </div>

            <nav class="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <a href="#" class="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 text-yellow font-medium transition-all">
                    <i class="fa-solid fa-table-columns w-5"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../Student Profile Page/php/student_profile.php" class="flex items-center gap-4 px-4 py-3 rounded-xl text-white/80 hover:bg-white/5 hover:text-white transition-all">
                    <i class="fa-solid fa-user w-5"></i>
                    <span>Profile</span>
                </a>
                <a href="../../Internship Search Page/php/internship_search.php" class="flex items-center gap-4 px-4 py-3 rounded-xl text-white/80 hover:bg-white/5 hover:text-white transition-all">
                    <i class="fa-solid fa-magnifying-glass w-5"></i>
                    <span>Internships</span>
                </a>
            </nav>

            <div class="p-4 border-t border-white/10">
                <button class="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors">
                    <i class="fa-solid fa-right-from-bracket w-5"></i>
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
            
            <!-- Top Bar -->
            <header class="h-20 bg-white shadow-sm flex items-center justify-between px-8 relative z-10">
                <div class="flex items-center gap-4 md:hidden">
                    <button class="text-gray-600 hover:text-maroon">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                    <span class="font-bold text-maroon text-lg">Hirenorian</span>
                </div>

                <div class="ml-auto relative">
                    <button id="userProfileBtn" class="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors focus:outline-none">
                        <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Profile" class="w-10 h-10 rounded-full object-cover border-2 border-slate-200">
                        <div class="hidden md:block text-left">
                            <span class="block text-sm font-bold text-gray-900 leading-tight"><?php echo htmlspecialchars($first_name); ?></span>
                            <span class="block text-xs text-gray-500">Student</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-400 text-xs ml-1"></i>
                    </button>

                    <!-- Dropdown -->
                    <div id="profileDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 hidden transform transition-all origin-top-right z-50">
                        <a href="../../Student Profile Page/php/student_profile.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">
                            <i class="fa-solid fa-user mr-2 text-gray-400"></i> Profile
                        </a>
                        <a href="../../../Account Registration Pages/Account Selection Page/php/account_selection.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">
                            <i class="fa-solid fa-users mr-2 text-gray-400"></i> Switch Account
                        </a>
                        <div class="border-t border-gray-100 my-1"></div>
                        <a href="../../../APIs/Company DB APIs/logout.php" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <i class="fa-solid fa-sign-out-alt mr-2"></i> Logout
                        </a>
                    </div>
                </div>
            </header>

            <!-- Scrollable Content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
                
                <!-- Hero -->
                <div class="bg-white rounded-3xl shadow-sm md:flex items-center justify-between p-8 mb-8 relative overflow-hidden group">
                    <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow/10 to-transparent -skew-x-12 translate-x-12"></div>
                    
                    <div class="relative z-10 max-w-2xl">
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Good afternoon, <span class="text-maroon"><?php echo htmlspecialchars($first_name); ?></span>!
                        </h1>
                        <p class="text-gray-500 text-lg mb-8">Here's your internship journey at a glance.</p>
                        
                        <div class="flex flex-wrap gap-4">
                            <a href="../../Internship Search Page/php/internship_search.php" class="bg-maroon text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-maroon/20 hover:shadow-maroon/40 hover:-translate-y-1 transition-all flex items-center gap-2">
                                <i class="fa-solid fa-magnifying-glass"></i> Find Internships
                            </a>
                            <a href="../../Student Edit Profile Page/php/edit_profile.php" class="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                                <i class="fa-solid fa-user-pen"></i> Edit Profile
                            </a>
                        </div>
                    </div>

                    <div class="hidden md:block relative z-10 p-6 bg-slate-50 rounded-2xl border border-dashed border-gray-300 min-w-[300px]">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-sm font-bold text-gray-600 uppercase tracking-wide">Profile Strength</span>
                            <span class="text-lg font-bold text-yellow">75%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                            <div class="bg-yellow h-3 rounded-full" style="width: 75%"></div>
                        </div>
                        <p class="text-xs text-center text-gray-400">Complete your profile to get noticed!</p>
                    </div>
                </div>

                <!-- Metrics Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Total Applications -->
                    <div class="metric-card total bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-dark hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 rounded-full bg-yellow/10 flex items-center justify-center text-yellow-dark">
                                <i class="fa-solid fa-file-lines text-xl"></i>
                            </div>
                            <div class="text-green-600 text-sm font-bold flex items-center bg-green-50 px-2 py-1 rounded-lg">
                                <i class="fa-solid fa-arrow-up mr-1 text-xs"></i> 12%
                            </div>
                        </div>
                        <h3 class="text-4xl font-bold text-gray-900 mb-1 metric-value">0</h3>
                        <p class="text-gray-500 text-sm font-medium">Total Applications</p>
                    </div>

                    <!-- Accepted -->
                    <div class="metric-card active bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-check-circle text-xl"></i>
                            </div>
                            <div class="text-green-600 text-sm font-bold flex items-center bg-green-50 px-2 py-1 rounded-lg">
                                <i class="fa-solid fa-arrow-up mr-1 text-xs"></i> 1
                            </div>
                        </div>
                        <h3 class="text-4xl font-bold text-gray-900 mb-1 metric-value">0</h3>
                        <p class="text-gray-500 text-sm font-medium">Accepted</p>
                    </div>

                     <!-- Review -->
                     <div class="metric-card review bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-hourglass-half text-xl"></i>
                            </div>
                        </div>
                        <h3 class="text-4xl font-bold text-gray-900 mb-1 metric-value">0</h3>
                        <p class="text-gray-500 text-sm font-medium">Under Review</p>
                    </div>

                     <!-- Rejected -->
                     <div class="metric-card offers bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <i class="fa-solid fa-times-circle text-xl"></i>
                            </div>
                        </div>
                        <h3 class="text-4xl font-bold text-gray-900 mb-1 metric-value">0</h3>
                        <p class="text-gray-500 text-sm font-medium">Rejected</p>
                    </div>
                </div>

                <!-- Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <!-- Left Column: Pipeline -->
                    <div class="lg:col-span-2 space-y-8">
                        
                        <!-- Application Pipeline -->
                        <div class="bg-white rounded-2xl shadow-sm p-6">
                            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <i class="fa-solid fa-list-check text-maroon"></i>
                                    Application Pipeline
                                </h2>
                                <div class="flex bg-slate-100 p-1 rounded-lg">
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium bg-white text-gray-900 shadow-sm transition-all">All</button>
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">Pending</button>
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">Interview</button>
                                </div>
                            </div>

                            <div class="applications-list space-y-4">
                                <!-- JS will populate this -->
                                <div class="animate-pulse flex space-x-4 p-4 border rounded-xl">
                                    <div class="rounded-full bg-slate-200 h-10 w-10"></div>
                                    <div class="flex-1 space-y-2 py-1">
                                        <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                                        <div class="space-y-3">
                                            <div class="h-4 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <!-- Recommendations Section -->
                         <div class="bg-transparent">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <i class="fa-solid fa-star text-yellow"></i>
                                    Recommended for You
                                </h2>
                                <a href="#" class="text-maroon text-sm font-medium hover:underline">View All</a>
                            </div>

                            <div class="recommendations-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- JS will populate this -->
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Activity & Widgets -->
                    <div class="space-y-6">
                        
                        <!-- Recent Activity -->
                        <div class="bg-white rounded-2xl shadow-sm p-6">
                            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <i class="fa-solid fa-history text-gray-400"></i> Recent Activity
                            </h3>
                            
                            <div id="auditLogContainer" class="max-h-[500px] overflow-y-auto pr-2">
                                <!-- JS will populate this -->
                            </div>
                        </div>

                        <!-- Profile Strength (Mobile only, or extra widget) -->
                         <div class="bg-maroon text-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
                            <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            
                            <h3 class="font-bold text-lg mb-2">Upgrade Your Profile</h3>
                            <p class="text-white/80 text-sm mb-4">Add skills and experience to increase your visibility by 50%.</p>
                            
                            <ul class="space-y-2 text-sm text-white/90 mb-6">
                                <li class="flex items-center gap-2"><i class="fa-solid fa-check-circle text-green-400"></i> Upload Resume</li>
                                <li class="flex items-center gap-2"><i class="fa-regular fa-circle"></i> Add 3 Skills</li>
                                <li class="flex items-center gap-2"><i class="fa-regular fa-circle"></i> Verify Email</li>
                            </ul>

                            <button class="w-full bg-white text-maroon font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm">Update Profile</button>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    </div>

    <!-- Pass PHP data to JS -->
    <script>
        const STUDENT_ID = <?php echo json_encode($student_id); ?>;
    </script>
    <script src="../js/dashboard.js"></script>
</body>
</html>
