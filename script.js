// Elements
const adminBtn = document.getElementById('admin-login-btn');
const loginModal = document.getElementById('login-modal');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Show modal
adminBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Handle login
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === 'admin' && password === '1234') {
        loginModal.style.display = 'none';
        alert('تم تسجيل الدخول بنجاح!');
        // Redirect to admin page (can be your item management page)
        window.location.href = 'admin.html';
    } else {
        loginError.style.display = 'block';
    }
});

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});