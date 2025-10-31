<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Styles -->
    <link href="..\css\landing_page.css" rel="stylesheet">

    <!-- Fonts links -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <title>Document</title>
</head>

<body>

    <header>

        <nav id="navbar">

            <section id="navbar-left">
                <img src="..\Images\dhvsulogo.png" id="imglogo" alt="hirenorian-logo">
                <h1 id="navbar-title">Hirenorian</h1>
            </section>

            <section id="navbar-right">
                <button id="sign-in">Sign In</button>
            </section>

        </nav>

        <section id="find-career-section">

            <section id="find-your-career-left-section">
                <h1 id="get-hired-today">GET HIRED<br>TODAY</h1>
                <p id="hirenorian-info">Hirenorian is a career hub designed for DHVSU<br>students to explore job postings and internship<br>opportunities. Discover openings tailored to<br>your skills, connect with employers, and take<br>the next step toward your future career—all in<br>one place.</p>
                <div id="find-your-career-div"><button id="find-your-career-button">Find your Career</button></div>
                <div></div>
            </section>

            <section id="find-your-career-right-section">
                <div id="circle-left"></div>
                <div id="circle-right"></div>
                <img src="..\Images\gradpic2.png" id="gradpic" alt="">
            </section>


        </section>
        <div id="left-circle-yellow"></div>

    </header>

    <main>

        <section id="headline-section">
            <section id="headline-left-section"></section>

            <section id="headline-right-section">
                <h1 id="headline">Headline</h1>
                <h2 id="sub-headline">sub headline</h2>
                <p id="headline-info">This text serves as a placeholder<br>while no actual text or<br>information is posted yet.</p>
            </section>
        </section>

        <section id="socmed-bar">

            <section id="socmed-left-bar">
                <button class="icon" onclick="window.open('https://www.facebook.com', '_blank')"><img src="../Images/fbicon.png" alt="Facebook" class="icon" id="fb"></button>
                <button class="icon" onclick="window.open('https://www.linkedin.com', '_blank')"><img src="../Images/linkedin.png" alt="Youtube" class="icon" id="in"></button>
                <button class="icon" onclick="window.open('https://www.youtube.com', '_blank')"><img src="../Images/yticon.png" alt="Youtube" class="icon" id="yt"></button>
                <button class="icon" onclick="window.open('https://www.instagram.com', '_blank')"><img src="../Images/igicon.png" alt="Instagram" class="icon" id="ig"></button>
            </section>

            <section>
                <p id="hirenoriantext">hirenorian.com</p>
            </section>

        </section>

        
        <section id = whole-section>

        <section id="job-section"> 
           
        <section class="job">
             
                <h3 class="job-one-right"> Job Number One</h3>
                <img src="..\Images\job.png" class="job-image" >
                <p class="info">Body text for whatever you’d like<br>to add more to the subheading.  </p>
            
        </section>
                <section class="job">
                 <h3 class="job-one-right"> Job Number Two</h3>
                <img src="..\Images\job.png" class="job-image" >
                <p class="info">Body text for whatever you’d like<br>to add more to the subheading.  </p>
        </section>
        
        <section class="job">
                 <h3 class="job-one-right"> Job Number Three </h3>
                <img src="..\Images\job.png" class="job-image" >
                <p class="info">Body text for whatever you’d like<br>to add more to the subheading.  </p>
        </section>
           
        </section>
       
        <section id="job-more">
                 <button id="more-button">More</button>
        </section>

        </section>




<section id="whole">
    <section id="top-employers">    
        <h2 id="top-employer">TOP EMPLOYERS</h2>
        <p id="dicover">Discover companies offering great opportunities for students and graduates</p>
     </section>
    <section class="employer-container">

      <section class="employer-card">
        <section class="rank">1</section>
        <img src="../Images/hyundai-removebg-preview.png " id="Hyundai Logo">
        <h3>Hyundai</h3>
        <p>Car company</p>
        <button id="button-job-one"> View Job</button>
      </section>

      <section class="employer-card">
        <section class="rank" >2</section>
        <img src="../Images/samsung-removebg-preview.png" id="Samsung Logo">
        <h3>Samsung</h3>
        <p>Technology</p>
        <button id="button-job-two"> View Job </button>
      </section>

      <section class="employer-card">
        <section class="rank" >3</section>
        <img src="../Images/google-removebg-preview.png" id="Google Logo">
        <h3>Google</h3>
        <p>Technology</p>
         <button id="button-job-three"> View Job </button>
      </section>

    </section>
  
</section>
    </main>


</body>

</html>