/**
 * EDIT COMPANY PROFILE - JavaScript
 * Handles saving all changes from edit profile page
 * Backend integration points are marked with TODO
 */

/**
 * Saves all changes and returns to profile page
 * TODO: Backend integration - save all fields to database
 */
function saveAllChanges() {
    // Get all form values
    const data = {
        companyName: document.getElementById('companyName').value.trim(),
        tagline: document.getElementById('companyTagline').value.trim(),
        industry: document.getElementById('companyIndustry').value.trim(),
        aboutUs: document.getElementById('aboutUs').value.trim(),
        whyJoinUs: document.getElementById('whyJoinUs').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        location: document.getElementById('contactLocation').value.trim(),
        website: document.getElementById('contactWebsite').value.trim()
    };

    // Validation
    if (!data.companyName || !data.tagline || !data.industry) {
        alert('Please fill in all company information fields');
        return;
    }

    if (!data.aboutUs || !data.whyJoinUs) {
        alert('Please fill in About Us and Why Join Us sections');
        return;
    }

    if (!data.email || !data.location || !data.website) {
        alert('Please fill in all contact information fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return;
    }

    // URL validation
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(data.website)) {
        alert('Please enter a valid website URL (must start with http:// or https://)');
        return;
    }

    // Show confirmation
    if (confirm('Are you sure you want to save all changes?')) {
        // TODO: Backend integration
        // saveCompanyProfile(data);

        console.log('Saving company profile data:', data);

        // Simulate save and redirect
        showNotification('Profile updated successfully!', 'success');
        setTimeout(() => {
            window.location.href = '../../Company Profile Page/php/company_profile.php';
        }, 1000);
    }
}

/**
 * Shows a notification message
 * @param {string} message - Notification text
 * @param {string} type - 'success' or 'error'
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? ' #10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Edit Company Profile JS loaded successfully');
