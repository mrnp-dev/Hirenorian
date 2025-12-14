
// profile.js - Fetch student data & tags for Internship Search

import { initStudentTags } from './studentTags.js';

export async function initStudentProfile(email) {
    if (!email) {
        console.warn('[Profile] No student email provided.');
        return;
    }

    console.log('[Profile] Fetching student data for:', email);

    try {
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_email: email })
        });

        const result = await response.json();

        if (result.status === 'success') {
            updateProfileUI(result.data);
            handleStudentTags(result.data.basic_info);
        } else {
            console.error('[Profile] API Error:', result.message);
        }

    } catch (error) {
        console.error('[Profile] Fetch Error:', error);
    }
}

function updateProfileUI(data) {
    const { basic_info, profile } = data;

    // DOM Elements
    const headerName = document.getElementById('headerProfileName');
    const headerImg = document.getElementById('headerProfileImg');

    // Data Extraction
    const fullName = `${basic_info.first_name} ${basic_info.last_name}`;
    let profilePicUrl = '../../../Landing Page/Images/gradpic2.png'; // Default

    if (profile && profile.profile_picture) {
        // Fix path
        profilePicUrl = profile.profile_picture.replace('/var/www/html/', 'http://mrnp.site:8080/');
    }

    // Update Header
    if (headerName) {
        headerName.textContent = fullName;
        headerName.classList.remove('skeleton', 'skeleton-text');
        headerName.style.width = 'auto';
    }

    if (headerImg) {
        headerImg.src = profilePicUrl;
        headerImg.onload = () => headerImg.classList.remove('skeleton');
        headerImg.onerror = () => {
            headerImg.src = '../../../Landing Page/Images/gradpic2.png';
            headerImg.classList.remove('skeleton');
        };
    }
}

function handleStudentTags(basicInfo) {
    const tags = [];
    if (basicInfo.tag1) tags.push(basicInfo.tag1);
    if (basicInfo.tag2) tags.push(basicInfo.tag2);
    if (basicInfo.tag3) tags.push(basicInfo.tag3);

    console.log('[Profile] Extracted tags:', tags);

    // Store in SessionStorage for other modules (consistent with PHP approach)
    if (tags.length > 0) {
        sessionStorage.setItem('studentTags', JSON.stringify(tags));
        // Init tags auto-search now that we have them
        initStudentTags();
    }
}
