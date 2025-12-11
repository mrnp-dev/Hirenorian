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

// Function to create user-friendly log description
function createLogDescription(log) {
    const table = log.table_affected;
    const field = log.field_name;

    // CREATE operations
    if (log.action_type === 'CREATE') {
        if (table === 'StudentSkills') {
            const skillName = log.new_value ? log.new_value.split(' (')[0] : 'a skill';
            return `Added <strong>${skillName}</strong> to your skills`;
        }
        if (table === 'StudentEducationHistory') {
            return `Added new education entry`;
        }
        if (table === 'StudentExperience') {
            return `Added new work experience`;
        }
        return `Added new information to your profile`;
    }

    // DELETE operations
    if (log.action_type === 'DELETE') {
        if (table === 'StudentSkills') {
            const skillName = log.old_value ? log.old_value.split(' (')[0] : 'a skill';
            return `Removed <strong>${skillName}</strong> from your skills`;
        }
        if (table === 'StudentEducationHistory') {
            return `Removed an education entry`;
        }
        if (table === 'StudentExperience') {
            return `Removed a work experience`;
        }
        return `Removed information from your profile`;
    }

    // UPDATE operations
    if (log.action_type === 'UPDATE') {
        // Personal information updates
        if (table === 'Students') {
            if (field === 'first_name') return `Changed your first name to <strong>${log.new_value}</strong>`;
            if (field === 'last_name') return `Changed your last name to <strong>${log.new_value}</strong>`;
            if (field === 'middle_initial') return `Updated your middle initial`;
            if (field === 'suffix') {
                if (!log.new_value) return `Removed your suffix`;
                return `Updated your suffix to <strong>${log.new_value}</strong>`;
            }
            if (field === 'personal_email') return `Changed your email address`;
            if (field === 'phone_number') return `Updated your phone number`;
            if (field === 'password_hash') return `Changed your password`;
        }

        // Profile updates
        if (table === 'StudentProfile') {
            if (field === 'location') return `Updated your location to <strong>${log.new_value}</strong>`;
            if (field === 'about_me') return `Updated your bio`;
            if (field === 'profile_picture') return `Changed your profile picture`;
        }

        // Education updates
        if (table === 'StudentEducationHistory') {
            if (field === 'degree') return `Updated degree information`;
            if (field === 'institution') return `Updated school name`;
            if (field === 'start_year' || field === 'end_year') return `Updated education dates`;
        }

        // Experience updates
        if (table === 'StudentExperience') {
            if (field === 'job_title') return `Updated job title`;
            if (field === 'company_name') return `Updated company name`;
            if (field === 'description') return `Updated job description`;
            if (field === 'start_date' || field === 'end_date') return `Updated work dates`;
        }

        return `Updated your profile`;
    }

    return `Modified your profile`;
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
