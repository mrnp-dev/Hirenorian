document.addEventListener('DOMContentLoaded', function () {


    const data = window.dashboardData || {
        students: { verified: 0, unverified: 0 },
        companies: { verified: 0, unverified: 0 }
    };


    console.log('Chart initialization - Data received:', data);


    const studentChartCanvas = document.getElementById('studentVerificationChart');
    if (studentChartCanvas) {
        new Chart(studentChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Verified Students', 'Unverified Students'],
                datasets: [{
                    data: [data.students.verified, data.students.unverified],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 8,
                    borderRadius: 4
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            family: "'Outfit', sans-serif",
                            weight: '600'
                        },
                        bodyFont: {
                            size: 13,
                            family: "'Outfit', sans-serif"
                        },
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }


    const companyChartCanvas = document.getElementById('companyVerificationChart');
    if (companyChartCanvas) {
        new Chart(companyChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Verified Companies', 'Unverified Companies'],
                datasets: [{
                    data: [data.companies.verified, data.companies.unverified],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 8,
                    borderRadius: 4
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            family: "'Outfit', sans-serif",
                            weight: '600'
                        },
                        bodyFont: {
                            size: 13,
                            family: "'Outfit', sans-serif"
                        },
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }


    const auditSearch = document.getElementById('auditSearch');
    const auditTable = document.getElementById('auditTable');

    if (auditSearch && auditTable) {
        auditSearch.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const rows = auditTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }


    function auditLogs(actionType, decription) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/audit.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action_type: actionType,
                description: decription,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Audit log added successfully');
                } else {
                    console.error('Failed to add audit log:', data.message);
                    alert('Error adding audit log: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error logging audit log.');
            });
    }
});