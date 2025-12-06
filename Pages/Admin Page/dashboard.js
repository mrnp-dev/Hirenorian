const profileBtn = document.getElementById('userProfileBtn');
const dropdown = document.getElementById('profileDropdown');

if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });
}

window.addEventListener('click', (e) => {
    if (profileBtn && dropdown && !profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

const chartCanvas = document.getElementById('applicantsChart');
if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    
    const chartData = [50, 40, 10]; 
    const chartLabels = ['Accepted', 'Pending', 'Rejected'];
    
    const chartColors = ['#38761D', '#f1c40f', '#7b1113']; 

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: chartColors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
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
                            label += context.raw + '%';
                            return label;
                        }
                    }
                }
            }
        }
    });
}