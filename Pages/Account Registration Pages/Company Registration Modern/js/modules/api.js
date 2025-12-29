// API and Data Fetching Functions

async function loadCompanyTypesAndIndustries() {
    try {
        const [typesResponse, industriesResponse] = await Promise.all([
            fetch('../json/CompanyType.json'),
            fetch('../json/industry.json')
        ]);

        const typesData = await typesResponse.json();
        const industriesData = await industriesResponse.json();

        companyTypes = typesData.typesOfCompanies;
        industries = industriesData.industries;

        // Setup dropdowns (call UI functions if needed, or helper in main)
        return { types: companyTypes, industries: industries };
    } catch (error) {
        console.error('Failed to load dropdown data:', error);
        if (typeof ToastSystem !== 'undefined') ToastSystem.show('Failed to load dropdown options', 'error');
        return { types: [], industries: [] };
    }
}

async function checkCompanyEmail(email) {
    try {
        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/check_company_email.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });
        const result = await response.json();
        return result.status !== "exists";
    } catch (error) {
        console.error("Network error checking email:", error);
        return false; // Assume error means unsafe to proceed or handle gracefully
    }
}

async function Register_Company(button) {
    console.log("Registering Company:", userInformation);

    // Disable button to prevent double submit
    if (button) {
        button.disabled = true;
        button.innerHTML = 'Finishing... <i class="fa fa-spinner fa-spin"></i>';
    }

    fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/company_registration_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInformation)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
            if (data.status === "success") {
                ToastSystem.show("You’ve been registered successfully", "success");
                setTimeout(() => {
                    ToastSystem.show("Redirecting to the landing page", "info");
                    setTimeout(() => {
                        // Reset form or clear session if needed
                        window.location.href = "../../../Landing Page Tailwind/php/index.php";
                    }, 2000);
                }, 1500);
            } else {
                ToastSystem.show(data.message || "Something went wrong, try again later.", "error");
                if (button) {
                    button.disabled = false;
                    button.innerHTML = 'Finish';
                }
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            ToastSystem.show("Network error occurred.", "error");
            if (button) {
                button.disabled = false;
                button.innerHTML = 'Finish';
            }
        });
}
