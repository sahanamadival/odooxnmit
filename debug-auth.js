// Debug script to test authentication flow
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function debugAuth() {
  console.log('🔍 Debugging Authentication Flow...\n');

  try {
    // Test 1: Register a user
    console.log('1. Testing user registration...');
    const registerData = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'testpass123'
    };
    
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration response:', registerResponse.data);
    
    // Test 2: Login with the same user
    console.log('\n2. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'testpass123'
    };
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('✅ Login response:', loginResponse.data);
    
    // Test 3: Check if token works
    console.log('\n3. Testing protected endpoint with token...');
    const token = loginResponse.data.token;
    
    const protectedResponse = await axios.get(`${API_BASE_URL}/manufacturing`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected endpoint response:', protectedResponse.data);
    
    console.log('\n🎉 Authentication flow is working correctly!');
    console.log('\n📋 Frontend should work with:');
    console.log('   Email: test@example.com');
    console.log('   Password: testpass123');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400 && error.response.data.error === 'Email already registered') {
      console.log('\n🔄 User already exists, testing login directly...');
      
      try {
        const loginData = {
          email: 'test@example.com',
          password: 'testpass123'
        };
        
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        console.log('✅ Login response:', loginResponse.data);
        
        console.log('\n🎉 Login is working! The issue might be in the frontend.');
        
      } catch (loginError) {
        console.error('❌ Login error:', loginError.response?.data || loginError.message);
      }
    }
  }
}

debugAuth();
