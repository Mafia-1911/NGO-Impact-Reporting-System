// ===== Auth Modal Logic =====
function showAuthModal(formType) {
    document.getElementById("authModal").style.display = "flex"; // flex for centering
    switchAuthForm(formType);
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

function switchAuthForm(formType) {
    document.getElementById("signinForm").style.display = formType === "signin" ? "block" : "none";
    document.getElementById("signupForm").style.display = formType === "signup" ? "block" : "none";
}

// ===== Sign Up =====
function handleSignUp(event) {
    event.preventDefault();

    const firstName = document.getElementById("signupFirstName").value;
    const lastName = document.getElementById("signupLastName").value;
    const org = document.getElementById("signupOrganization").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.email === email)) {
        alert("User already exists! Please sign in.");
        switchAuthForm("signin");
        return;
    }

    // Save new user
    users.push({ firstName, lastName, org, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert(`Account created for ${firstName} ${lastName} (${org})! You can now sign in.`);

    // Auto-fill sign-in form
    document.getElementById("signinEmail").value = email;
    document.getElementById("signinPassword").value = password;

    switchAuthForm("signin");
}

// ===== Sign In =====
function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save login state
        localStorage.setItem("authToken", "dummy-token"); // You can generate a random token
        localStorage.setItem("userEmail", email);

        // Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}

// ===== Hamburger menu toggle =====
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});
