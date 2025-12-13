// locationFilter.js - Cascading location dropdown functionality

export function initLocationFilter() {
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
        // Dispatch event to notify other dropdowns
        document.dispatchEvent(new CustomEvent('locationDropdownOpened'));
    }

    // Listen for other dropdowns opening
    document.addEventListener('typeDropdownOpened', () => {
        closeLocationDropdown();
    });

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
}
