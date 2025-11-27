// Simple dropdown toggle
const profileBtn = document.getElementById('userProfileBtn');
const dropdown = document.getElementById('profileDropdown');

if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });
}

// Chart.js Initialization
const chartCanvas = document.getElementById('applicationChart');
if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pending', 'Accepted', 'Rejected'],
            datasets: [{
                data: [1, 1, 1], // Values from cards
                backgroundColor: [
                    '#ffc107', // Pending (Yellow)
                    '#155724', // Accepted (Green)
                    '#721c24'  // Rejected (Red)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Outfit', sans-serif"
                        }
                    }
                }
            }
        }
    });
}

// Application Summary Popup Logic
const modal = document.getElementById("applicationSummaryModal");
const btn = document.getElementById("viewAllApplicationsBtn");
const span = document.getElementsByClassName("close-modal")[0];

if (btn && modal && span) {
    btn.onclick = function (e) {
        e.preventDefault();
        modal.classList.add("show");
        modal.style.display = "block"; // Fallback
    }

    span.onclick = function () {
        modal.classList.remove("show");
        setTimeout(() => { modal.style.display = "none"; }, 300); // Wait for transition
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.classList.remove("show");
            setTimeout(() => { modal.style.display = "none"; }, 300);
        }
        // Also handle dropdown close here
        if (profileBtn && dropdown && !profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    }
} else {
    // Keep existing window click for dropdown if modal elements aren't present
    window.addEventListener('click', (e) => {
        if (profileBtn && dropdown && !profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}
