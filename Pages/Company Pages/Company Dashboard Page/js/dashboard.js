document.addEventListener('DOMContentLoaded', () => {
    const userProfileBtn = document.getElementById('userProfileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    // Toggle Dropdown
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userProfileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });
});
