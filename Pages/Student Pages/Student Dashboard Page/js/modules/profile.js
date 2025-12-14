
// modules/profile.js

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
    const heroName = document.getElementById('heroGreetingName');

    // Data Extraction
    const fullName = `${basic_info.first_name} ${basic_info.last_name}`;
    const firstName = basic_info.first_name;
    let profilePicUrl = '../../../Landing Page/Images/gradpic2.png'; // Default

    if (profile && profile.profile_picture) {
        // Fix path
        profilePicUrl = profile.profile_picture.replace('/var/www/html/', 'http://mrnp.site:8080/');
    }

    // Update Head Profile Name
    if (headerName) {
        headerName.textContent = fullName;
        headerName.classList.remove('skeleton', 'skeleton-text');
        headerName.style.width = 'auto';
    }

    // Update Header Profile Image
    if (headerImg) {
        headerImg.src = profilePicUrl;
        headerImg.onload = () => {
            headerImg.classList.remove('skeleton');
        };
        // Fallback if image fails
        headerImg.onerror = () => {
            headerImg.src = '../../../Landing Page/Images/gradpic2.png';
            headerImg.classList.remove('skeleton');
        }
    }

    // Update Hero Greeting
    if (heroName) {
        heroName.textContent = firstName;
        heroName.classList.remove('skeleton', 'skeleton-text');
        heroName.style.width = 'auto'; // Reset fixed width
    }

    console.log('[Profile] UI Updated successfully.');
}
