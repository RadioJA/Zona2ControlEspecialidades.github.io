// Simple test script to verify admin check logic
function isAdmin() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;
        const user = JSON.parse(userStr);
        return user.email === 'ministrylion@gmail.com';
    } catch(e) {
        return false;
    }
}

// Test cases
console.log('Testing isAdmin function:');

// Test 1: Admin user
localStorage.setItem('user', JSON.stringify({ email: 'ministrylion@gmail.com', name: 'Admin' }));
console.log('Admin user:', isAdmin()); // Should be true

// Test 2: Non-admin user
localStorage.setItem('user', JSON.stringify({ email: 'user@example.com', name: 'User' }));
console.log('Non-admin user:', isAdmin()); // Should be false

// Test 3: No user
localStorage.removeItem('user');
console.log('No user:', isAdmin()); // Should be false

// Test 4: Invalid JSON
localStorage.setItem('user', 'invalid json');
console.log('Invalid JSON:', isAdmin()); // Should be false
