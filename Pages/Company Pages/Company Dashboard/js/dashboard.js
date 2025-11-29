document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            const content = document.getElementById(`${tabId}-content`);
            if (content) {
                content.classList.add('active');
            }
        });
    });

    // User Profile Dropdown Logic
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.getElementById('profileDropdown');

    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to document
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });

        // Prevent closing when clicking inside the dropdown itself
        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Optional: Add hover class to sidebar for JS-controlled animations if needed
    // The CSS hover effect is usually sufficient, but this can be added for more complex interactions
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            sidebar.classList.add('expanded');
        });
        sidebar.addEventListener('mouseleave', () => {
            sidebar.classList.remove('expanded');
        });
    }

    // Questions Section - Yes/No Checkbox Logic
    const questionRows = document.querySelectorAll('.question-row');

    questionRows.forEach(row => {
        const optionBoxes = row.querySelectorAll('.option-box');

        optionBoxes.forEach((box, index) => {
            box.addEventListener('click', () => {
                // Remove 'checked' class from all boxes in this row
                optionBoxes.forEach(b => b.classList.remove('checked'));

                // Add 'checked' class to the clicked box
                box.classList.add('checked');

                // Optional: Add a checkmark icon if not already present
                if (!box.querySelector('i')) {
                    box.innerHTML = '<i class="fa-solid fa-check"></i>';
                } else {
                    // Re-add icon to all boxes
                    optionBoxes.forEach(b => {
                        if (!b.classList.contains('checked')) {
                            b.innerHTML = '';
                        } else {
                            b.innerHTML = '<i class="fa-solid fa-check"></i>';
                        }
                    });
                }
            });
        });
    });
});
