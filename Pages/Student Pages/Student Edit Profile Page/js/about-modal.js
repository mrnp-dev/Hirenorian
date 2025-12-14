/**
 * About Me Modal Module
 * Handles about me modal functionality
 * Dependencies: ui-controls.js, toast.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const aboutModal = document.getElementById('editAboutModal');

    if (aboutModal) {
        const aboutMeInput = aboutModal.querySelector('#aboutMe');
        const aboutForm = aboutModal.querySelector('form');
        const studentIdInput = aboutModal.querySelector('#studentId');

        if (aboutForm) {
            aboutForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const studentId = studentIdInput ? studentIdInput.value : "";
                const aboutMe = aboutMeInput ? aboutMeInput.value.trim() : "";

                console.log('aboutMe:', aboutMe);
                console.log('studentId:', studentId);

                fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/student_aboutme_update.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        aboutme: aboutMe,
                        studentId: studentId
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            ToastSystem.show('About Me updated successfully', "success");
                            closeModal(aboutModal);

                            // SPA Update
                            const displayAboutMe = document.getElementById('display-about-me');
                            if (displayAboutMe) {
                                // Convert newlines to breaks for display
                                displayAboutMe.innerHTML = aboutMe ? aboutMe.replace(/\n/g, '<br>') : "No bio added yet.";
                            }
                        } else {
                            ToastSystem.show('Failed to update About Me', "error");
                        }
                    })
                    .catch(err => {
                        console.error("Fetch error:", err);
                        ToastSystem.show('Network error', "error");
                    });
            });
        }
    }
});
