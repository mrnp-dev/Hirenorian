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

// ============================================================================
// AUDIT LOG FUNCTIONALITY
// ============================================================================

// Helper function to format timestamp
function formatTimestamp(timestamp) {
    // MySQL datetime format: "2025-12-11 07:21:26"
    // Replace space with 'T' for ISO format, or add timezone
    const date = new Date(timestamp.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper function to get action icon
function getActionIcon(actionType) {
    const icons = {
        'CREATE': 'fa-plus',
        'UPDATE': 'fa-pen',
        'DELETE': 'fa-trash'
    };
    return icons[actionType] || 'fa-circle';
}

// Helper function to get friendly table names
function getFriendlyTableName(tableName) {
    const names = {
        'Students': 'Personal Info',
        'StudentProfile': 'Profile',
        'StudentSkills': 'Skills',
        'StudentEducationHistory': 'Education',
        'StudentExperience': 'Experience'
    };
    return names[tableName] || tableName;
}

// Helper function to get friendly field names
function getFriendlyFieldName(fieldName) {
    if (!fieldName) return 'field'; // Handle null/undefined

    const names = {
        'first_name': 'First Name',
        'last_name': 'Last Name',
        'middle_initial': 'Middle Initial',
        'suffix': 'Suffix',
        'personal_email': 'Personal Email',
        'phone_number': 'Phone Number',
        'password_hash': 'Password',
        'location': 'Location',
        'about_me': 'About Me',
        'profile_picture': 'Profile Picture',
        'skill_name': 'Skill'
    };
    return names[fieldName] || fieldName.replace('_', ' ');
}

// Function to create log description
function createLogDescription(log) {
    const table = getFriendlyTableName(log.table_affected);
    const field = getFriendlyFieldName(log.field_name);

    if (log.action_type === 'CREATE') {
        if (log.table_affected === 'StudentSkills') {
            return `Added ${log.new_value} to <span class="log-table">${table}</span>`;
        }
        return `Created new entry in <span class="log-table">${table}</span>`;
    }

    if (log.action_type === 'DELETE') {
        if (log.table_affected === 'StudentSkills') {
            return `Removed ${log.old_value} from <span class="log-table">${table}</span>`;
        }
        return `Deleted entry from <span class="log-table">${table}</span>`;
    }

    if (log.action_type === 'UPDATE') {
        if (log.field_name) {
            // Truncate long values
            let oldVal = log.old_value || '(empty)';
            let newVal = log.new_value || '(empty)';

            if (oldVal.length > 40) oldVal = oldVal.substring(0, 40) + '...';
            if (newVal.length > 40) newVal = newVal.substring(0, 40) + '...';

            return `
                Updated <span class="log-field">${field}</span> in <span class="log-table">${table}</span><br>
                <span class="log-value old">${oldVal}</span> → <span class="log-value new">${newVal}</span>
            `;
        }
        return `Updated <span class="log-table">${table}</span>`;
    }

    return `${log.action_type} on <span class="log-table">${table}</span>`;
}

// Function to render audit logs
function renderAuditLogs(logs) {
    const container = document.getElementById('auditLogContainer');
    const countEl = document.getElementById('logCount');

    if (!logs || logs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <p>No activity logged yet</p>
            </div>
        `;
        countEl.textContent = '0 activities';
        return;
    }

    countEl.textContent = `${logs.length} ${logs.length === 1 ? 'activity' : 'activities'}`;

    const timeline = document.createElement('div');
    timeline.className = 'audit-log-timeline';

    logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'audit-log-item';

        const actionClass = log.action_type.toLowerCase();
        const icon = getActionIcon(log.action_type);

        item.innerHTML = `
            <div class="log-icon ${actionClass}">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="log-content">
                <div class="log-header">
                    <div class="log-action">${log.action_type}</div>
                    <div class="log-timestamp">${formatTimestamp(log.action_timestamp)}</div>
                </div>
                <div class="log-details">
                    ${createLogDescription(log)}
                </div>
            </div>
        `;

        timeline.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(timeline);
}

// Function to fetch audit logs
async function fetchAuditLogs() {
    const container = document.getElementById('auditLogContainer');

    // Check if STUDENT_ID is available
    if (!STUDENT_ID) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Unable to load activity logs. Please log in.</p>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_audit_logs.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: STUDENT_ID,
                limit: 20
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            renderAuditLogs(data.data);
        } else {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <p>Failed to load activity logs: ${data.message}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        container.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Error loading activity logs. Please try again later.</p>
            </div>
        `;
    }
}

// Load audit logs when page loads
document.addEventListener('DOMContentLoaded', () => {
    const auditContainer = document.getElementById('auditLogContainer');
    if (auditContainer) {
        fetchAuditLogs();
    }
});
