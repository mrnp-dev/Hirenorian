document.addEventListener('DOMContentLoaded', function () {
    // ScrollSpy Implementation
    const sections = document.querySelectorAll('.help-section');
    const navLinks = document.querySelectorAll('.help-nav-link');
    const sidebar = document.querySelector('.help-sidebar');
    const contentWrapper = document.querySelector('.content-wrapper');
    // Offset for visual spacing (no sticky header inside the scroll container)
    const headerOffset = 20;

    function highlightNavigation() {
        let currentSection = '';

        if (!contentWrapper) return;

        const wrapperRect = contentWrapper.getBoundingClientRect();

        // Check if we've reached the bottom of the content
        // If (scrollTop + clientHeight) is close to scrollHeight, activate the last section
        if (contentWrapper.scrollTop + contentWrapper.clientHeight >= contentWrapper.scrollHeight - 20) {
            if (sections.length > 0) {
                currentSection = sections[sections.length - 1].getAttribute('id');
            }
        } else {
            // Standard ScrollSpy Logic
            sections.forEach(section => {
                const sectionRect = section.getBoundingClientRect();

                // Check if section top is near the top of the wrapper
                if (sectionRect.top <= wrapperRect.top + headerOffset + 50) {
                    currentSection = section.getAttribute('id');
                }
            });
        }

        // If no section is found (e.g., at the very top), default to the first one
        if (!currentSection && sections.length > 0) {
            currentSection = sections[0].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');

                // Optional: Scroll sidebar to keep active link in view on desktop
                if (window.innerWidth > 992 && sidebar) {
                    const dropdownTop = link.offsetTop;
                    const sidebarHeight = sidebar.clientHeight;
                    const scrollTop = sidebar.scrollTop;

                    if (dropdownTop > (scrollTop + sidebarHeight - 50)) {
                        sidebar.scrollTo({ top: dropdownTop - sidebarHeight + 100, behavior: 'smooth' });
                    } else if (dropdownTop < scrollTop) {
                        sidebar.scrollTo({ top: dropdownTop - 50, behavior: 'smooth' });
                    }
                }
            }
        });
    }

    if (contentWrapper) {
        contentWrapper.addEventListener('scroll', highlightNavigation);
        highlightNavigation(); // Initial check
    } else {
        // Fallback for unexpected layouts
        window.addEventListener('scroll', highlightNavigation);
    }

    // Smooth Scrolling for Sidebar Links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection && contentWrapper) {
                const relativeTop = targetSection.getBoundingClientRect().top - contentWrapper.getBoundingClientRect().top;
                const targetScroll = contentWrapper.scrollTop + relativeTop - headerOffset;

                contentWrapper.scrollTo({
                    top: targetScroll,
                    behavior: "smooth"
                });
            } else if (targetSection) {
                // Fallback
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // FAQ Accordion
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const item = this.parentElement;
            const body = item.querySelector('.faq-body');
            const icon = this.querySelector('.faq-icon');

            // Close other items (Optional - Single Open Mode)
            // document.querySelectorAll('.faq-item.active').forEach(activeItem => {
            //     if (activeItem !== item) {
            //         activeItem.classList.remove('active');
            //         activeItem.querySelector('.faq-body').style.height = 0;
            //     }
            // });

            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                body.style.height = body.scrollHeight + 'px';
            } else {
                body.style.height = 0;
            }
        });
    });
});
