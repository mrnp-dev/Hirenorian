
// profile-data.js - Fetches and populates profile data for the Edit Profile page

export async function initProfileData(email) {
    if (!email) {
        console.error('No student email provided.');
        return;
    }

    try {
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_email: email })
        });

        const result = await response.json();

        if (result.status === 'success') {
            populateProfileUI(result.data);
        } else {
            console.error('API Error:', result.message);
        }

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

function populateProfileUI(data) {
    const info = data.basic_info || {};
    const profile = data.profile || {};
    const educationCurrent = data.education || [];
    const educationHistory = data.education_history || [];
    const experience = data.experience || [];
    const skills = data.skills || [];

    // --- 1. Basic Info & Profile Header ---
    const studentId = info.student_id;
    const fullName = `${info.first_name} ${info.middle_initial ? info.middle_initial + '. ' : ''}${info.last_name} ${info.suffix || ''}`.trim();

    // Determine Role/Headline
    let role = 'Student';
    let uni = '';
    if (educationCurrent.length > 0) {
        role = educationCurrent[0].course;
        uni = educationCurrent[0].university;
    }

    // Profile Pic
    let picUrl = '../../../Landing Page/Images/gradpic2.png';
    if (profile.profile_picture) {
        picUrl = profile.profile_picture.replace('/var/www/html/', 'http://mrnp.site:8080/');
    }

    // Update Header DOM
    setText('display-full-name', fullName);
    setText('profile-role-display', role); // Added check for ID existence in setText
    setText('profile-university-display', uni);
    setImage('profile-img-display', picUrl);

    // Update Header User Profile (Top Bar)
    setText('headerProfileName', info.first_name);
    setImage('headerProfileImg', picUrl);

    // --- 2. Hidden Form Inputs (Student ID) ---
    setVal('student_id', studentId);
    setVal('studentIdPersonal', studentId);
    setVal('studentIdPassword', studentId);
    setVal('studentIdExp', studentId);
    setVal('studentId', studentId); // About Me modal & Add Edu modal might share IDs or match selectors

    // --- 3. Contact Info (Display & Form) ---
    const personalEmail = info.personal_email || '';
    const studentEmail = info.student_email || '';
    const phone = info.phone_number || '';
    const location = profile.location || '';

    // Display
    setText('display-personal-email', personalEmail || 'Not Provided');
    setText('display-student-email', studentEmail || 'Not Provided'); // If element exists
    setText('display-phone', phone || 'Not Provided');
    setText('display-location', location || 'Not Specified');

    // Form Inputs
    setVal('firstName', info.first_name);
    setVal('lastName', info.last_name);
    setVal('middleInitial', info.middle_initial);
    setVal('suffix', info.suffix);
    setVal('personalEmail', personalEmail);
    setVal('studentEmail', studentEmail);
    setVal('phone', phone);
    setVal('location', location);

    // --- 4. About Me ---
    const about = profile.about_me || '';
    const aboutDisplay = document.getElementById('display-about-me');
    if (aboutDisplay) aboutDisplay.innerHTML = about ? about.replace(/\n/g, '<br>') : 'No bio added yet.';
    setVal('aboutMe', about);

    // --- 5. Skills ---
    renderSkills(skills);

    // --- 6. Education Timeline ---
    renderEducation(educationHistory);

    // --- 7. Experience Timeline ---
    renderExperience(experience);
}

// Helpers
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
        el.classList.remove('skeleton', 'skeleton-text');
    }
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function setImage(id, src) {
    const el = document.getElementById(id);
    if (el) {
        el.src = src;
        el.classList.remove('skeleton');
        el.onerror = () => el.src = '../../../Landing Page/Images/gradpic2.png';
    }
}

function renderSkills(skills) {
    const techContainer = document.getElementById('technical-skills-display');
    const softContainer = document.getElementById('soft-skills-display');
    const techModalContainer = document.getElementById('technicalSkillsContainer');
    const softModalContainer = document.getElementById('softSkillsContainer');

    let techHTML = '';
    let softHTML = '';
    let techModalHTML = '';
    let softModalHTML = '';

    const techArr = [];
    const softArr = [];

    skills.forEach(skill => {
        if (skill.skill_category === 'Technical') {
            techArr.push(skill.skill_name);
            techHTML += `<span>${skill.skill_name}</span>`;
            techModalHTML += createSkillTag(skill.skill_name, 'technical');
        } else {
            softArr.push(skill.skill_name);
            softHTML += `<span>${skill.skill_name}</span>`;
            softModalHTML += createSkillTag(skill.skill_name, 'soft');
        }
    });

    if (techContainer) techContainer.innerHTML = techHTML || '<span>No technical skills added</span>';
    if (softContainer) softContainer.innerHTML = softHTML || '<span>No soft skills added</span>';

    // Update Modal Containers
    if (techModalContainer) techModalContainer.innerHTML = techModalHTML;
    if (softModalContainer) softModalContainer.innerHTML = softModalHTML;

    // Update Hidden Inputs for Validation/Submission logic
    // Note: The existing validation.js or skills-modal.js might re-read these from the DOM tags
}

function createSkillTag(name, category) {
    return `
    <span class="skill-tag" data-category="${category}">
        ${name}
        <button type="button" class="remove-skill"><i class="fa-solid fa-times"></i></button>
    </span>`;
}

function renderEducation(history) {
    const container = document.querySelector('.education-section .timeline');
    if (!container) return;

    if (!history || history.length === 0) {
        container.innerHTML = '<p>No education history added.</p>';
        return;
    }

    container.innerHTML = history.map(hist => `
        <div class="timeline-item" data-edu-id="${hist.edu_hist_id}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div class="timeline-info">
                        <h3>${hist.degree}</h3>
                        <p class="institution">${hist.institution}</p>
                        <p class="date">${hist.start_year} - ${hist.end_year}</p>
                    </div>
                    <div class="timeline-actions">
                        <button class="icon-btn-sm edit-education-btn" 
                            data-edu-id="${hist.edu_hist_id}"
                            data-degree="${hist.degree}"
                            data-institution="${hist.institution}"
                            data-start-year="${hist.start_year}"
                            data-end-year="${hist.end_year}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="icon-btn-sm delete-education-btn" 
                            data-edu-id="${hist.edu_hist_id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderExperience(experience) {
    const container = document.querySelector('.experience-section .timeline');
    if (!container) return;

    if (!experience || experience.length === 0) {
        container.innerHTML = '<p>No experience added.</p>';
        return;
    }

    container.innerHTML = experience.map(exp => `
        <div class="timeline-item" data-exp-id="${exp.exp_id}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div class="timeline-info">
                        <h3>${exp.job_title}</h3>
                        <p class="institution">${exp.company_name}</p>
                        <p class="date">${exp.start_date} - ${exp.end_date}</p>
                        <p class="description">${exp.description}</p>
                    </div>
                    <div class="timeline-actions">
                        <button class="icon-btn-sm edit-experience-btn" 
                            data-exp-id="${exp.exp_id}"
                            data-job-title="${exp.job_title}"
                            data-company="${exp.company_name}"
                            data-start-date="${exp.start_date}"
                            data-end-date="${exp.end_date}"
                            data-description="${exp.description}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="icon-btn-sm delete-experience-btn" 
                            data-exp-id="${exp.exp_id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
