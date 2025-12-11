/**
 * Photo Modal Module
 * Handles profile photo update functionality
 * Dependencies: ui-controls.js, toast.js (optional but recommended for user feedback)
 */

document.addEventListener('DOMContentLoaded', function () {
    const photoForm = document.querySelector('#editPhotoModal form');
    const photoInput = document.getElementById('profilePhoto');
    const studentIdInput = document.querySelector('#editPhotoModal input[name="student_id"]');
    const currentProfileImg = document.querySelector('.profile-img-container img');
    const navProfileImg = document.querySelector('.user-profile .user-img'); // Top bar image

    if (!photoForm || !photoInput) return;

    // Handle file selection for preview (Optional enhancement)
    photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            // Basic validation
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                photoInput.value = ''; // Clear selection
                return;
            }

            // 2MB limit check (example)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB.');
                photoInput.value = '';
                return;
            }
        }
    });

    // Handle form submission
    photoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const file = photoInput.files[0];
        const studentId = studentIdInput ? studentIdInput.value : '';

        if (!file) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('local_file', file); // Matches client_sender.php logic
        formData.append('student_id', studentId);
        formData.append('submit', 'true'); // Simulate submit button press for PHP check

        // Show loading state
        const submitBtn = photoForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Uploading...';

        fetch('update_photo.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update profile images on the page
                    // Assuming backend returns the new image URL or we use the uploaded file
                    // Ideally, backend returns the new public URL. 
                    // For now, if local, we might need to reload or use data returned.

                    if (data.data && data.data.image_url) {
                        if (currentProfileImg) currentProfileImg.src = data.data.image_url;
                        if (navProfileImg) navProfileImg.src = data.data.image_url;
                    } else {
                        // Fallback: reload to see changes if URL not returned
                        location.reload();
                        return;
                    }

                    if (window.closeModal) {
                        const modal = document.getElementById('editPhotoModal');
                        window.closeModal(modal);
                    }

                    // Use toast if available, else alert
                    if (typeof showToast === 'function') {
                        showToast('Profile photo updated successfully', 'success');
                    } else {
                        alert('Profile photo updated successfully');
                    }

                    photoForm.reset(); // Clear form
                } else {
                    throw new Error(data.message || 'Upload failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (typeof showToast === 'function') {
                    showToast(error.message || 'An error occurred during upload', 'error');
                } else {
                    alert('Error: ' + (error.message || 'An error occurred during upload'));
                }
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
    });
});
