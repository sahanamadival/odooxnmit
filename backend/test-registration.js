// test-registration.js - Test the registration endpoint directly
import axios from 'axios';

async function testRegistration() {
  try {
    console.log("🧪 Testing registration endpoint...");
    
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "testpass123",
      role: "User"
    };
    
    console.log("📤 Sending registration request:", testUser);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log("✅ Registration successful!");
    console.log("📥 Response:", response.data);
    
  } catch (error) {
    console.error("❌ Registration failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testRegistration();