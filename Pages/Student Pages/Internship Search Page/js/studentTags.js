// studentTags.js - Student-specific tag auto-selection functionality

let studentTags = [];

export async function loadStudentTags() {
    try {
        // Get student email from session storage
        const studentEmail = sessionStorage.getItem('email');
        if (!studentEmail) {
            console.log('No student email found in session');
            return;
        }

        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_email: studentEmail })
        });

        const result = await response.json();

        if (result.status === 'success' && result.data.basic_info) {
            const basic = result.data.basic_info;
            // Get the three tags from Students table
            studentTags = [
                basic.tag1,
                basic.tag2,
                basic.tag3
            ].filter(tag => tag && tag.trim() !== ''); // Remove null/empty tags

            console.log('Student tags loaded:', studentTags);
            autoCheckStudentTags();
        }
    } catch (error) {
        console.error('Failed to load student tags:', error);
    }
}

export function autoCheckStudentTags() {
    if (studentTags.length === 0) return;

    // Find all career tag checkboxes
    const careerTagCheckboxes = document.querySelectorAll('#careerTagsContainer input[type="checkbox"]');

    careerTagCheckboxes.forEach(checkbox => {
        const tagValue = checkbox.value;
        // Check if this tag matches any of the student's tags (case-insensitive)
        const isMatch = studentTags.some(studentTag =>
            studentTag.toLowerCase() === tagValue.toLowerCase()
        );

        if (isMatch) {
            checkbox.checked = true;
        }
    });

    // Trigger update of selected filters
    const changeEvent = new Event('change', { bubbles: true });
    if (careerTagCheckboxes.length > 0) {
        careerTagCheckboxes[0].dispatchEvent(changeEvent);
    }
}
