document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const navLinks = document.querySelectorAll('.help-nav-link');
    const sections = document.querySelectorAll('.help-section');
    const sidebar = document.querySelector('.help-sidebar');

    // 1. Smooth Scroll on Click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(nav => nav.classList.remove('active'));

                // Add active to clicked
                link.classList.add('active');

                // Smooth scroll
                // Offset for fixed header
                const topBarHeight = 90; // Approx 70px + padding
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - topBarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 2. ScrollSpy (Highlight active link on scroll)
    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollValues = window.scrollY + 150; // Offset for trigger point

            if (scrollValues >= sectionTop && scrollValues < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });

        // Loop to set active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

});
