document.getElementById('sendBtn').addEventListener('click', function () {
    const email = document.getElementById('recipientEmail').value;
    const statusDiv = document.getElementById('status');

    if (!email) {
        statusDiv.textContent = 'Please enter an email address.';
        statusDiv.style.color = 'red';
        return;
    }

    statusDiv.textContent = 'Sending...';
    statusDiv.style.color = 'blue';

    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                statusDiv.textContent = data.message;
                statusDiv.style.color = 'green';
            } else {
                statusDiv.textContent = 'Error: ' + data.message;
                statusDiv.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusDiv.textContent = 'An error occurred. Check console.';
            statusDiv.style.color = 'red';
        });
});
