// profile.js

document.addEventListener('DOMContentLoaded', () => {
    // Top Bar Profile Dropdown
    const profileBtn = document.getElementById('userProfileBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // Add any other interactive elements here (e.g. smooth scroll, tabs)
});
