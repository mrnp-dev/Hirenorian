
// ========================================
// UTILS MODULE
// ========================================

/**
 * Format timestamp to relative time or date string
 * @param {String} timestamp 
 * @returns {String}
 */
export function formatTimestamp(timestamp) {
    // MySQL datetime format: "2025-12-11 15:21:26"
    // Database stores in server's LOCAL timezone (PH = UTC+8), NOT in UTC
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

/**
 * generic icon mapper
 * @param {String} actionType 
 * @returns {String} fa-class
 */
export function getIconForAction(actionType) {
    const icons = {
        'CREATE': 'fa-plus',
        'UPDATE': 'fa-pen',
        'DELETE': 'fa-trash'
    };
    return icons[actionType] || 'fa-circle';
}


/**
 * Create user-friendly log description string
 * @param {Object} log 
 * @returns {String} HTML string
 */
export function createLogDescription(log) {
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
