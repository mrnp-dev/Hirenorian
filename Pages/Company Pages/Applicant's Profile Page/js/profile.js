// ========================================
// APPLICANT PROFILE - DYNAMIC DATA LOADING
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Get applicant_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const applicantId = urlParams.get('id');

    if (!applicantId) {
        console.error('No applicant ID provided in URL');
        alert('Invalid applicant ID');
        window.location.href = '../../Job Listing Page/php/job_listing.php';
        return;
    }

    try {
        // Fetch student profile data
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_student_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ applicant_id: parseInt(applicantId) })
        });

        const result = await response.json();

        if (result.status === 'success') {
            populateProfile(result.data);
        } else {
            console.error('Failed to fetch profile:', result.message);
            alert('Failed to load applicant profile: ' + result.message);
        }

    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('An error occurred while loading the profile');
    }

    // Sign Out Handler
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/logout.php', {
                    method: 'POST',
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.status === 'success') {
                    window.location.href = '../../../Landing Page/php/landing_page.php';
                }
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '../../../Landing Page/php/landing_page.php';
            }
        });
    }
});

function populateProfile(data) {
    // Profile Picture
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar && data.profilePicture) {
        profileAvatar.src = data.profilePicture;
    }

    // Full Name
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = data.fullName;
    }

    // Headline (Course at University)
    const profileHeadline = document.querySelector('.profile-headline');
    if (profileHeadline) {
        profileHeadline.textContent = `${data.course} Student at ${data.university}`;
    }

    // Location
    const profileLocation = document.querySelector('.profile-location');
    if (profileLocation) {
        if (data.location && data.location.trim() !== '') {
            profileLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
        } else {
            profileLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> Location not set`;
        }
    }
    // Contact Information
    const contactPersonalEmail = document.getElementById('contactPersonalEmail');
    if (contactPersonalEmail) {
        contactPersonalEmail.textContent = data.personalEmail || 'N/A';
    }

    const contactStudentEmail = document.getElementById('contactStudentEmail');
    if (contactStudentEmail) {
        contactStudentEmail.textContent = data.studentEmail || 'N/A';
    }

    const contactPhone = document.getElementById('contactPhone');
    if (contactPhone) {
        contactPhone.textContent = data.phoneNumber || 'N/A';
    }
    // About Me
    const aboutMe = document.querySelector('.section-card:nth-of-type(1) .section-text');
    if (aboutMe) {
        aboutMe.textContent = data.aboutMe || 'No information provided.';
    }

    // Skills
    populateSkills(data.skills);

    // Experience
    populateExperience(data.experience);

    // Education History
    populateEducation(data.educationHistory, data.course, data.university);
}

function populateSkills(skills) {
    // Technical Skills
    const technicalSkillsContainer = document.getElementById('technicalSkillsTags');
    if (technicalSkillsContainer) {
        if (skills.technical && skills.technical.length > 0) {
            technicalSkillsContainer.innerHTML = skills.technical.map(skill =>
                `<span>${skill}</span>`
            ).join('');
        } else {
            technicalSkillsContainer.innerHTML = '<span style="color: #999;">No technical skills listed</span>';
        }
    }

    // Soft Skills
    const softSkillsContainer = document.getElementById('softSkillsTags');
    if (softSkillsContainer) {
        if (skills.soft && skills.soft.length > 0) {
            softSkillsContainer.innerHTML = skills.soft.map(skill =>
                `<span>${skill}</span>`
            ).join('');
        } else {
            softSkillsContainer.innerHTML = '<span style="color: #999;">No soft skills listed</span>';
        }
    }
}

function populateExperience(experiences) {
    const experienceSection = document.querySelector('.section-card:nth-of-type(2) .timeline-v2');

    if (!experienceSection) return;

    if (!experiences || experiences.length === 0) {
        experienceSection.innerHTML = '<p style="color: #999; text-align: center;">No experience listed</p>';
        return;
    }

    experienceSection.innerHTML = experiences.map(exp => {
        const dateRange = exp.end_date ?
            `${exp.start_date} - ${exp.end_date}` :
            `${exp.start_date} - Present`;

        return `
            <div class="timeline-item">
                <div class="timeline-icon"><i class="fa-solid fa-briefcase"></i></div>
                <div class="timeline-content">
                    <h3>${exp.job_title}</h3>
                    <p class="institution">${exp.company_name}</p>
                    <p class="date">${dateRange}</p>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function populateEducation(educationHistory, currentCourse, currentUniversity) {
    const educationSection = document.querySelector('.section-card:nth-of-type(3) .timeline-v2');

    if (!educationSection) return;

    let educationHTML = '';

    // Add current education (from Education table)
    if (currentCourse && currentUniversity) {
        educationHTML += `
            <div class="timeline-item">
                <div class="timeline-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                <div class="timeline-content">
                    <h3>${currentCourse}</h3>
                    <p class="institution">${currentUniversity}</p>
                    <p class="date">Present</p>
                </div>
            </div>
        `;
    }

    // Add education history (from StudentEducationHistory table)
    if (educationHistory && educationHistory.length > 0) {
        educationHTML += educationHistory.map(edu => {
            const dateRange = edu.end_year ?
                `${edu.start_year} - ${edu.end_year}` :
                `${edu.start_year} - Present`;

            return `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fa-solid fa-school"></i></div>
                    <div class="timeline-content">
                        <h3>${edu.degree}</h3>
                        <p class="institution">${edu.institution}</p>
                        <p class="date">${dateRange}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (educationHTML === '') {
        educationSection.innerHTML = '<p style="color: #999; text-align: center;">No education information available</p>';
    } else {
        educationSection.innerHTML = educationHTML;
    }
}
