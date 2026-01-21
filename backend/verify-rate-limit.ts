import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testRateLimiting() {
    console.log('🧪 Verifying User-Based Rate Limiting...');

    // 1. Get a token
    console.log('🔑 Logging in to get token...');
    let token = '';
    try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'student@university.edu',
            password: 'SecurePass123'
        });
        token = loginRes.data.data.accessToken;
        console.log('✅ Logged in successfully.');
    } catch (error) {
        console.error('❌ Login failed. Make sure the server is running and user exists.');
        return;
    }

    // 2. Spam requests with token
    console.log('⚡ Spimming authenticated requests...');
    for (let i = 1; i <= 20; i++) {
        try {
            await axios.get(`${API_URL}/accounts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            process.stdout.write('.');
        } catch (error: any) {
            if (error.response?.status === 429) {
                console.log(`\n🛑 Throttled after ${i} authenticated requests! (Correct)`);
                break;
            }
            console.log(`\n❌ Unexpected error: ${error.status}`);
            break;
        }
    }

    // 3. Spam requests without token (different rate limit key)
    console.log('\n⚡ Spimming anonymous requests...');
    for (let i = 1; i <= 20; i++) {
        try {
            await axios.get(`${API_URL}/auth/me`); // Should fail 401 but still hit limiter
            process.stdout.write('.');
        } catch (error: any) {
            if (error.response?.status === 429) {
                console.log(`\n🛑 Anonymous Throttled after ${i} requests!`);
                break;
            }
            if (error.response?.status === 401) {
                process.stdout.write('u'); // unauthorized but okay
                continue;
            }
            console.log(`\n❌ Unexpected error: ${error.status}`);
            break;
        }
    }
}

testRateLimiting();
