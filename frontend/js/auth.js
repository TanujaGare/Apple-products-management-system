const AUTH_API = 'http://localhost:5000/api/auth';

const Auth = {
    // Save user data and token to localStorage
    saveSession: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    },

    // Get user from localStorage
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Check if user is logged in
    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },

    // Check if user is admin
    isAdmin: () => {
        const user = Auth.getUser();
        return user && user.role === 'admin';
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    },

    // Login API call
    login: async (email, password) => {
        const res = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        Auth.saveSession(data);
        return data;
    },

    // Register API call
    register: async (name, email, password) => {
        const res = await fetch(`${AUTH_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        Auth.saveSession(data);
        return data;
    },

    // Redirect if not authorized
    protectPage: (requireAdmin = false) => {
        if (!Auth.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        if (requireAdmin && !Auth.isAdmin()) {
            window.location.href = 'index.html';
            return;
        }
    },

    // Get Auth Header
    getAuthHeader: () => {
        const token = Auth.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// Update navigation UI based on auth state
function updateNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const user = Auth.getUser();
    const loginLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.includes('Login'));
    const adminLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.includes('Admin'));
    
    // Remove existing auth elements if any
    const existingUserBtn = document.getElementById('user-menu-btn');
    if (existingUserBtn) existingUserBtn.remove();

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        
        // Show/Hide Admin link
        if (adminLink) {
            adminLink.style.display = user.role === 'admin' ? 'inline-block' : 'none';
        } else if (user.role === 'admin') {
            const a = document.createElement('a');
            a.href = 'admin.html';
            a.textContent = 'Admin';
            nav.appendChild(a);
        }

        // Add User Profile / Logout
        const userDiv = document.createElement('div');
        userDiv.id = 'user-menu-btn';
        userDiv.style.display = 'inline-block';
        userDiv.style.marginLeft = '20px';
        userDiv.innerHTML = `
            <span style="font-size: 13px; color: #1d1d1f; cursor: pointer;">Hi, ${user.name.split(' ')[0]} ▾</span>
            <div id="user-dropdown" style="display: none; position: absolute; background: white; border: 1px solid #d2d2d7; border-radius: 8px; padding: 10px; margin-top: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 1000;">
                <a href="#" id="logout-btn" style="margin: 0; color: #ff3b30; display: block; font-size: 13px;">Logout</a>
            </div>
        `;
        nav.appendChild(userDiv);

        userDiv.onclick = () => {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };

        document.getElementById('logout-btn').onclick = (e) => {
            e.preventDefault();
            Auth.logout();
        };

    } else {
        if (adminLink) adminLink.style.display = 'none';
        if (!loginLink) {
            const a = document.createElement('a');
            a.href = 'login.html';
            a.textContent = 'Login';
            nav.appendChild(a);
        } else {
            loginLink.style.display = 'inline-block';
        }
    }
}

// Auto-run updateNav if nav exists
document.addEventListener('DOMContentLoaded', updateNav);
