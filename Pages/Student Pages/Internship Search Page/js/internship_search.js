document.addEventListener('DOMContentLoaded', function () {
    const jobCards = document.querySelectorAll('.job-card');

    // Mock Data for Job Details (In a real app, this would fetch from API)
    const jobData = {
        1: {
            title: "Junior UI/UX Designer",
            company: "Cloudstaff, Pampanga",
            logo: "../../../Landing Page/Images/Companies/cloudstaff_logo.jpg",
            description: "We are looking for a talented fresher UI/UX Designer who is passionate about designing custom websites with proficiency in Photoshop. The candidate will work closely with our development and design teams to create visually appealing and user-friendly custom website designs for our clients.",
            roles: [
                "Gather and evaluate user requirements in collaboration with product managers and engineers",
                "Illustrate design ideas using storyboards, process flows and sitemaps",
                "Design graphic user interface elements, like menus, tabs and widgets",
                "Build page navigation buttons and search fields",
                "Develop UI mockups and prototypes that clearly illustrate how sites function and look like"
            ]
        },
        2: {
            title: "Software Engineer Intern",
            company: "Google, Manila (Hybrid)",
            logo: "../../../Landing Page/Images/google.jpg",
            description: "Join our engineering team to build scalable software solutions and learn from the best. You will work on real-world projects, collaborate with experienced engineers, and contribute to products used by millions of people.",
            roles: [
                "Write clean, maintainable, and efficient code",
                "Collaborate with cross-functional teams to define, design, and ship new features",
                "Participate in code reviews and technical discussions",
                "Debug and resolve technical issues",
                "Learn and apply best practices in software development"
            ]
        },
        3: {
            title: "Data Analyst",
            company: "Samsung, Taguig",
            logo: "../../../Landing Page/Images/samsung.jpg",
            description: "Analyze complex datasets to drive business decisions and improve product performance. You will be responsible for collecting, processing, and performing statistical analyses on large datasets.",
            roles: [
                "Interpret data, analyze results using statistical techniques and provide ongoing reports",
                "Develop and implement databases, data collection systems, data analytics and other strategies that optimize statistical efficiency and quality",
                "Acquire data from primary or secondary data sources and maintain databases/data systems",
                "Identify, analyze, and interpret trends or patterns in complex data sets"
            ]
        },
        4: {
            title: "Mechanical Engineering Intern",
            company: "Hyundai, Laguna",
            logo: "../../../Landing Page/Images/hyundai.jpg",
            description: "Assist in the design and testing of automotive components in a state-of-the-art facility. This internship provides hands-on experience in the automotive industry.",
            roles: [
                "Support the engineering team in design and development projects",
                "Conduct tests and analyze data to ensure product quality and performance",
                "Assist in the preparation of engineering documentation and reports",
                "Collaborate with other departments to resolve technical issues",
                "Participate in team meetings and design reviews"
            ]
        }
    };

    jobCards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove active class from all cards
            jobCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');

            // Get Job ID
            const jobId = this.getAttribute('data-id');
            const data = jobData[jobId];

            if (data) {
                updateJobDetails(data);
            }
        });
    });

    function updateJobDetails(data) {
        // Update DOM elements
        document.getElementById('detail-title').textContent = data.title;
        document.getElementById('detail-company').textContent = data.company;
        document.getElementById('detail-logo').src = data.logo;
        document.getElementById('detail-desc').textContent = data.description;

        const rolesList = document.getElementById('detail-roles');
        rolesList.innerHTML = ''; // Clear existing list

        data.roles.forEach(role => {
            const li = document.createElement('li');
            li.textContent = role;
            rolesList.appendChild(li);
        });

        // Add animation class for smooth transition
        const detailsCard = document.querySelector('.job-details-card');
        detailsCard.classList.add('fade-in');
        setTimeout(() => detailsCard.classList.remove('fade-in'), 300);
    }
});
