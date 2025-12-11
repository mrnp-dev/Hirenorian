document.addEventListener('DOMContentLoaded', function() {
    
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

    const chartCanvas = document.getElementById('applicantsChart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');

        const chartData = [50, 40];
        const chartLabels = ['Verified', 'Unverified'];
        const chartColors = ['#f1c40f', '#7b1113']; 

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
                cutout: '70%', 
                plugins: {
                    legend: {
                        display: false 
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