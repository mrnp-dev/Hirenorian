
document.addEventListener('DOMContentLoaded', () => {
    // Dropdown Logic
    initDropdown();

    const email = window.STUDENT_EMAIL;
    if (email) {
        fetchStudentData(email);
    } else {
        console.error('No student email found.');
    }
});

function initDropdown() {
    const profileBtn = document.getElementById('userProfileBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
}

async function fetchStudentData(email) {
    try {
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_email: email })
        });

        const result = await response.json();
        if (result.status === 'success') {
            renderProfile(result.data);
        } else {
            console.error('API Error:', result.message);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

function renderProfile(data) {
    const info = data.basic_info;
    const profile = data.profile || {};
    const educationCurrent = data.education || [];

    // --- Header & Main Profile ---
    const fullName = `${info.first_name} ${info.middle_initial ? info.middle_initial + ' ' : ''}${info.last_name} ${info.suffix || ''}`.trim();

    // Determine Headline (Course at University)
    let headline = 'Student';
    if (educationCurrent.length > 0) {
        headline = `${educationCurrent[0].course} Student at ${educationCurrent[0].university}`;
    }

    // Profile Picture
    let picUrl = '../../../Landing Page/Images/gradpic2.png';
    if (profile.profile_picture) {
        picUrl = profile.profile_picture.replace('/var/www/html/', 'http://mrnp.site:8080/');
    }

    // Header Elements
    updateText('headerProfileName', fullName.split(' ')[0]); // First name only for small header
    updateImage('headerProfileImg', picUrl);

    // Main Profile Elements
    updateImage('mainProfileAvatar', picUrl);
    updateText('mainProfileName', fullName);
    updateText('mainProfileHeadline', headline);

    // Location
    const loc = profile.location || 'Not Specified';
    const locEl = document.getElementById('mainProfileLocation');
    if (locEl) {
        locEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${loc}`; // Removing skeleton logic manually if needed or replace content
    }

    // --- Contact Info ---
    updateText('contactPersonalEmail', info.personal_email || 'Not Provided');
    updateText('contactStudentEmail', info.student_email || 'Not Provided');
    updateText('contactPhone', info.phone_number || 'Not Provided');

    // --- About Me ---
    const aboutContent = profile.about_me ? profile.about_me.replace(/\n/g, '<br>') : 'Write something about yourself...';
    const aboutEl = document.getElementById('aboutMeContent');
    if (aboutEl) {
        aboutEl.innerHTML = aboutContent;
        aboutEl.classList.remove('skeleton', 'skeleton-block');
    }

    // --- Skills ---
    renderSkills(data.skills);

    // --- Experience ---
    renderTimeline('experienceTimeline', data.experience, 'experience');

    // --- Education ---
    // Combine current and history for display
    const allEducation = [...(data.education || []), ...(data.education_history || [])];
    renderTimeline('educationTimeline', allEducation, 'education');
}

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
        el.classList.remove('skeleton', 'skeleton-text');
        el.style.width = 'auto';
    }
}

function updateImage(id, src) {
    const el = document.getElementById(id);
    if (el) {
        el.src = src;
        el.onload = () => el.classList.remove('skeleton');
        el.onerror = () => {
            el.src = '../../../Landing Page/Images/gradpic2.png';
            el.classList.remove('skeleton');
        };
    }
}

function renderSkills(skills) {
    const techContainer = document.getElementById('techSkillsContainer');
    const softContainer = document.getElementById('softSkillsContainer');

    if (!skills || skills.length === 0) {
        if (techContainer) techContainer.innerHTML = '<span style="color:#999; font-style:italic;">No skills added</span>';
        if (softContainer) softContainer.innerHTML = '<span style="color:#999; font-style:italic;">No skills added</span>';
        return;
    }

    let techHTML = '';
    let softHTML = '';

    skills.forEach(skill => {
        if (skill.skill_category === 'Technical') {
            techHTML += `<span>${skill.skill_name}</span>`;
        } else {
            softHTML += `<span>${skill.skill_name}</span>`;
        }
    });

    if (techContainer) techContainer.innerHTML = techHTML || '<span style="color:#999; font-style:italic;">No technical skills</span>';
    if (softContainer) softContainer.innerHTML = softHTML || '<span style="color:#999; font-style:italic;">No soft skills</span>';
}

function renderTimeline(containerId, data, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = `<p>No ${type} listed.</p>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        if (type === 'experience') {
            html += `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fa-solid fa-briefcase"></i></div>
                    <div class="timeline-content">
                        <h3>${item.job_title}</h3>
                        <p class="institution">${item.company_name}</p>
                        <p class="date">${item.start_date} - ${item.end_date}</p>
                        <p class="description">${item.description}</p>
                    </div>
                </div>
            `;
        } else {
            // Education
            // Normalize fields because current edu and history might differ slightly in naming if not careful, 
            // but API return seems to use 'university'/'course' for current and 'institution'/'degree' for history.
            // Let's handle both.
            const institution = item.university || item.institution;
            const degree = item.course || item.degree;
            const period = item.start_year ? `${item.start_year} - ${item.end_year}` : 'Present';

            html += `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fa-solid fa-${item.start_year ? 'school' : 'graduation-cap'}"></i></div>
                    <div class="timeline-content">
                        <h3>${degree}</h3>
                        <p class="institution">${institution}</p>
                        <p class="date">${period}</p>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;
}
