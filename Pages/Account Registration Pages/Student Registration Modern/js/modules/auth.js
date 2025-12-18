// Authentication Functions

async function check_LogIn_Fields() {
    const signUp_Inputs = document.querySelectorAll('.sign-in-container input');
    const loginBtn = document.getElementById('signIn_Btn');
    let isValid = true;
    signUp_Inputs.forEach(input => {
        if (input.value.trim() == "") {
            showError(input, `${input.name} cannot empty.`);
            isValid = false;
        } else if (input.name == "Student Email") {
            if (!checkLogged_Email(input)) isValid = false;
        }
    });

    if (isValid) {
        // Show loading state on login button
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.classList.add('loading');
            if (!loginBtn.dataset.originalText) {
                loginBtn.dataset.originalText = loginBtn.textContent.trim();
            }
            loginBtn.textContent = 'Logging in...';
        }

        const email = document.querySelector('#signup-email').value.trim();
        const password = document.querySelector('#signup-password').value.trim();
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/student_login_process.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (response.ok && data.status === "success") {
                ToastSystem.show('Login Successfully', "success");
                const resp = await fetch("store_cred_session.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email
                        })
                    }
                );
                const dt = await resp.json();
                if (resp.ok && dt.status === "success") {
                    console.log(dt.debug);
                    ToastSystem.show('Session stored successfully', "success");
                    setTimeout(() => {
                        ToastSystem.show("Redirecting to Student Dashboard", "info");
                        setTimeout(() => {
                            window.location.href = "../../../Student%20Pages/Student%20Dashboard%20Page/php/student_dashboard.php";
                        }, 1500);
                    }, 1500);
                } else {
                    ToastSystem.show('Session storage failed', "error");
                }
            } else {
                ToastSystem.show('Login Failed', "error");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Unable to connect to server");
        } finally {
            // Hide loading state if still on the page
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
                if (loginBtn.dataset.originalText) {
                    loginBtn.textContent = loginBtn.dataset.originalText;
                }
            }
        }
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

function checkLogged_Email(input) {
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;
    if (validSchoolEmail_RegEx.test(input.value.trim())) {
        return true;
    } else {
        return false;
    }
}
