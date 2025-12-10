document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Dropdown Menu Toggle ---
    const profileBtn = document.getElementById('userProfileBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // --- 2. Admin Chart Initialization (Total Applicants Number) ---
    const chartCanvas = document.getElementById('applicantsChart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');

        // Data based on screenshot: Accepted (50%), Pending (40%), Rejected (10%)
        const chartData = [50, 40, 10];
        const chartLabels = ['Accepted', 'Pending', 'Rejected'];
        // Colors from the screenshot / admin stat cards
        const chartColors = ['#38761D', '#f1c40f', '#7b1113']; 

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    data: chartData,
                    backgroundColor: chartColors,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', // Make it a doughnut chart
                plugins: {
                    legend: {
                        display: false // Hide default legend as custom HTML legend is used
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
});