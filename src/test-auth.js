// Simple test script to verify authentication endpoints
const API_BASE_URL = 'http://127.0.0.1:8001/api';

async function testRegister() {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: 'testuser2',
                full_name: 'Test User 2',
                email: 'test2@example.com',
                password: 'password123',
                password_confirmation: 'password123'
            })
        });

        const data = await response.json();
        console.log('Register Response:', data);
    } catch (error) {
        console.error('Register Error:', error);
    }
}

async function testLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: 'test2@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Login Response:', data);
    } catch (error) {
        console.error('Login Error:', error);
    }
}

// Run tests
console.log('Testing Student Authentication...');
testRegister().then(() => {
    console.log('\nTesting login...');
    setTimeout(() => testLogin(), 1000);
});