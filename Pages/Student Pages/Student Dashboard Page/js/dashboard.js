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

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
    if (profileBtn && dropdown && !profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});
