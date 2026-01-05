// Function to get current date/time string
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

// Simulate user data storage (using localStorage for persistence across pages)
function getUserData() {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
}

function setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));


// Function to populate the dashboard with user data
function populateDashboard() {
    const userData = getUserData();
    if (!userData) {
        window.location.href = 'login.html'; // Redirect if not logged in
        return;
    }

    // Welcome Message
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userData.name}!`;

    // User Name
    document.getElementById('userName').textContent = userData.name;

    // Join Date
    document.getElementById('joinDate').textContent = userData.joinDate;

    // Last Login
    document.getElementById('lastLogin').textContent = userData.lastLogin;

    // User Avatar (using placeholder based on initials)
    const avatar = document.getElementById('userAvatar');
    avatar.style.backgroundImage = `url('https://via.placeholder.com/80?text=${userData.name.split(' ').map(n => n[0]).join('')}')`;
    avatar.setAttribute('aria-label', `${userData.name}'s Avatar`);
}

// Function to show/hide sections in dashboard
function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.style.display = (section.id === sectionId) ? 'block' : 'none';
    });
}

// Quick Action Functions (placeholders)
function updateProfile() {
    alert('Update Profile functionality coming soon!');
}

function changePassword() {
    alert('Change Password functionality coming soon!');
}

function viewActivity() {
    alert('View Recent Activity functionality coming soon!');
}

// Dark Mode Toggle
function toggleDarkMode(isEnabled) {
    document.body.classList.toggle('dark-mode', isEnabled);
    localStorage.setItem('darkMode', isEnabled);
}

// Load Preferences (dark mode, etc.)
function loadPreferences() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.checked = darkMode;
    }
    toggleDarkMode(darkMode);

    // Example for additional settings
    const emailNotifications = localStorage.getItem('emailNotifications') === 'true';
    const emailToggle = document.getElementById('emailNotifications');
    if (emailToggle) {
        emailToggle.checked = emailNotifications;
    }
}

// Save Settings
function saveSettings() {
    const emailNotifications = document.getElementById('emailNotifications').checked;
    localStorage.setItem('emailNotifications', emailNotifications);
    alert('Settings saved!');
}

// Logout Function
function logout() {
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
}

// Handle Login Form
function handleLogin() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementById('loginUsername').value.trim().toLowerCase(); // Trim and lowercase
            const password = document.getElementById('loginPassword').value.trim();
            console.log(`Attempting login with username: ${username}, password: ${password}`); // Debug log

            const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
            console.log('Stored users:', storedUsers); // Debug log to see all users

            if (storedUsers[username] && storedUsers[username].password === password) {
                console.log('Login successful!'); // Debug log
                const userData = {
                    name: storedUsers[username].originalUsername || username, // Preserve original case if needed
                    email: storedUsers[username].email,
                    joinDate: storedUsers[username].joinDate,
                    lastLogin: getCurrentDateTime(),
                    avatarUrl: 'https://via.placeholder.com/80' // Placeholder
                };
                setUserData(userData);
                window.location.href = 'dashboard.html';
            } else {
                console.log('Login failed: Invalid credentials'); // Debug log
                alert('Invalid username or password.');
            }
        });
    }
}

// Handle Signup Form
function handleSignup() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalUsername = document.getElementById('signupUsername').value.trim();
            let username = originalUsername.toLowerCase(); // Lowercase for storage
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
            console.log(`Attempting signup with username: ${username}, email: ${email}`); // Debug log

            if (password !== confirmPassword) {
                console.log('Signup failed: Passwords do not match'); // Debug log
                alert('Passwords do not match.');
                return;
            }

            const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
            if (storedUsers[username]) {
                console.log('Signup failed: Username exists'); // Debug log
                alert('Username already exists.');
                return;
            }

            storedUsers[username] = {
                originalUsername, // Store original case
                email,
                password, // Note: In real apps, hash passwords!
                joinDate: getCurrentDateTime()
            };
            localStorage.setItem('users', JSON.stringify(storedUsers));
            console.log('Signup successful, stored users:', storedUsers); // Debug log

            alert('Signup successful! Please login.');
            window.location.href = 'login.html';
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();

    if (document.getElementById('dashboardSection')) {
        populateDashboard();
        showSection('dashboardSection');
    }

    handleLogin();
    handleSignup();
});