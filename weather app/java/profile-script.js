// Load user data from localStorage or use defaults
function loadUserData() {
    const userData = {
        username: localStorage.getItem('username') || 'John Doe',
        email: localStorage.getItem('email') || 'john.doe@email.com',
        location: localStorage.getItem('location') || 'Paris, France',
        memberSince: localStorage.getItem('memberSince') || 'January 2026'
    };

    // Update all username displays
    document.getElementById('username').textContent = userData.username;
    document.getElementById('displayUsername').textContent = userData.username;
    document.getElementById('email').textContent = userData.email;
    document.getElementById('displayEmail').textContent = userData.email;
    document.getElementById('userLocation').textContent = userData.location;
    document.getElementById('memberSince').textContent = userData.memberSince;
}

// Edit Profile
document.getElementById('editProfileBtn').addEventListener('click', () => {
    const username = prompt('Enter new username:', document.getElementById('username').textContent);
    const email = prompt('Enter new email:', document.getElementById('email').textContent);
    const location = prompt('Enter new location:', document.getElementById('userLocation').textContent);

    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('username').textContent = username;
        document.getElementById('displayUsername').textContent = username;
    }

    if (email) {
        localStorage.setItem('email', email);
        document.getElementById('email').textContent = email;
        document.getElementById('displayEmail').textContent = email;
    }

    if (location) {
        localStorage.setItem('location', location);
        document.getElementById('userLocation').textContent = location;
    }

    if (username || email || location) {
        alert('Profile updated successfully!');
    }
});

// Change Password
document.querySelector('.change-password-btn').addEventListener('click', () => {
    const currentPassword = prompt('Enter current password:');
    if (currentPassword) {
        const newPassword = prompt('Enter new password:');
        const confirmPassword = prompt('Confirm new password:');

        if (newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                alert('Password changed successfully!');
            } else {
                alert('Passwords do not match!');
            }
        }
    }
});

// Logout
document.querySelector('.logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any session data if needed
        // localStorage.clear(); // Uncomment to clear all data
        alert('Logged out successfully!');
        window.location.href = 'auth.html';
    }
});

// Load user data on page load
window.addEventListener('load', loadUserData);