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

    // ========== Location Filter Functionality ==========
    const locationTrigger = document.getElementById('locationTrigger');
    const locationDropdown = document.getElementById('locationDropdown');
    const locationValue = document.getElementById('locationValue');
    let locationsData = null;
    let activeSubmenu = null;

    // Fetch locations data
    async function fetchLocations() {
        try {
            const response = await fetch('../json/ph_locations.json');
            locationsData = await response.json();
            buildLocationDropdown();
        } catch (error) {
            console.error('Failed to load locations:', error);
        }
    }

    // Build the dropdown HTML
    function buildLocationDropdown() {
        if (!locationsData || !locationsData.provinces) return;

        const allOption = locationDropdown.querySelector('.all-option');

        locationsData.provinces.forEach((province, index) => {
            const provinceItem = document.createElement('div');
            provinceItem.className = 'province-item';
            provinceItem.dataset.province = province.name;
            provinceItem.innerHTML = `
                <span>${province.name}</span>
                <i class="fa-solid fa-chevron-right"></i>
            `;

            // Create cities submenu
            const citiesSubmenu = document.createElement('div');
            citiesSubmenu.className = 'cities-submenu';
            citiesSubmenu.id = `cities-${index}`;

            province.cities_municipalities.forEach(city => {
                const cityOption = document.createElement('div');
                cityOption.className = 'city-option';
                cityOption.dataset.city = city;
                cityOption.dataset.province = province.name;
                cityOption.textContent = city;
                citiesSubmenu.appendChild(cityOption);
            });

            // Append submenu to body to avoid parent overflow issues
            document.body.appendChild(citiesSubmenu);

            // Handle province hover - position submenu
            provinceItem.addEventListener('mouseenter', (e) => {
                hideAllSubmenus();
                const rect = provinceItem.getBoundingClientRect();
                citiesSubmenu.style.top = `${rect.top}px`;
                citiesSubmenu.style.left = `${rect.right + 5}px`;

                // Check if submenu goes off screen to the right
                const submenuRect = citiesSubmenu.getBoundingClientRect();
                if (rect.right + submenuRect.width > window.innerWidth) {
                    citiesSubmenu.style.left = `${rect.left - submenuRect.width - 5}px`;
                }

                citiesSubmenu.classList.add('active');
                activeSubmenu = citiesSubmenu;
            });

            provinceItem.addEventListener('mouseleave', (e) => {
                // Check if mouse is moving to the submenu
                setTimeout(() => {
                    if (!citiesSubmenu.matches(':hover') && !provinceItem.matches(':hover')) {
                        citiesSubmenu.classList.remove('active');
                        activeSubmenu = null;
                    }
                }, 100);
            });

            // Handle submenu mouseleave
            citiesSubmenu.addEventListener('mouseleave', (e) => {
                setTimeout(() => {
                    if (!citiesSubmenu.matches(':hover') && !provinceItem.matches(':hover')) {
                        citiesSubmenu.classList.remove('active');
                        activeSubmenu = null;
                    }
                }, 100);
            });

            // Handle province click (select entire province)
            provinceItem.addEventListener('click', (e) => {
                if (e.target === provinceItem || e.target.tagName === 'SPAN') {
                    selectLocation(province.name, province.name);
                }
            });

            locationDropdown.appendChild(provinceItem);
        });

        // Handle "All" option click
        allOption.addEventListener('click', () => {
            selectLocation('', 'Location: All');
        });

        // Handle city clicks using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('city-option')) {
                const city = e.target.dataset.city;
                const province = e.target.dataset.province;
                selectLocation(`${city}, ${province}`, city);
            }
        });
    }

    function hideAllSubmenus() {
        document.querySelectorAll('.cities-submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
        });
        activeSubmenu = null;
    }

    function selectLocation(value, displayText) {
        locationValue.value = value;
        locationTrigger.querySelector('span').textContent = displayText;
        closeLocationDropdown();

        // Remove previous selections
        document.querySelectorAll('.province-item.selected, .city-option.selected, .all-option.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selected class to current selection
        if (value === '') {
            locationDropdown.querySelector('.all-option').classList.add('selected');
        }
    }

    function openLocationDropdown() {
        locationDropdown.classList.add('active');
        locationTrigger.classList.add('active');
    }

    function closeLocationDropdown() {
        locationDropdown.classList.remove('active');
        locationTrigger.classList.remove('active');
        hideAllSubmenus();
    }

    function toggleLocationDropdown() {
        if (locationDropdown.classList.contains('active')) {
            closeLocationDropdown();
        } else {
            openLocationDropdown();
        }
    }

    // Event listeners
    if (locationTrigger) {
        locationTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLocationDropdown();
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.location-filter-wrapper') && !e.target.closest('.cities-submenu')) {
            closeLocationDropdown();
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLocationDropdown();
        }
    });

    // Initialize locations
    fetchLocations();

    // ========== Type Filter Functionality ==========
    const typeTrigger = document.getElementById('typeTrigger');
    const typeDropdown = document.getElementById('typeDropdown');
    const typeValue = document.getElementById('typeValue');
    const typeOptions = document.querySelectorAll('.type-option');

    function selectType(value, displayText) {
        typeValue.value = value;
        typeTrigger.querySelector('span').textContent = displayText;
        closeTypeDropdown();

        // Remove previous selections
        typeOptions.forEach(option => option.classList.remove('selected'));

        // Add selected class to current selection
        const selectedOption = Array.from(typeOptions).find(opt => opt.dataset.value === value);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }

    function openTypeDropdown() {
        typeDropdown.classList.add('active');
        typeTrigger.classList.add('active');
    }

    function closeTypeDropdown() {
        typeDropdown.classList.remove('active');
        typeTrigger.classList.remove('active');
    }

    function toggleTypeDropdown() {
        if (typeDropdown.classList.contains('active')) {
            closeTypeDropdown();
        } else {
            openTypeDropdown();
        }
    }

    // Event listeners for Type dropdown
    if (typeTrigger) {
        typeTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTypeDropdown();
        });
    }

    // Handle type option clicks
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const displayText = option.textContent;
            selectType(value, displayText);
        });
    });

    // Close type dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.type-filter-wrapper')) {
            closeTypeDropdown();
        }
    });

    // Close type dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTypeDropdown();
        }
    });
});
