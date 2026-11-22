#!/usr/bin/env node
/**
 * Test different Blotato status endpoint URLs
 */

require('dotenv').config();
const axios = require('axios');

const BLOTATO_API_KEY = process.env.BLOTATO_API_KEY;
const BLOTATO_BASE_URL = 'https://backend.blotato.com/v2';
const TEST_VIDEO_ID = '32f71848-47e3-478e-a4f0-624b86d3c0cb'; // From our earlier test

console.log('🧪 Testing Blotato Status Endpoints\n');

const endpoints = [
  `/videos/${TEST_VIDEO_ID}`,
  `/videos/creations/${TEST_VIDEO_ID}`,
  `/videos/items/${TEST_VIDEO_ID}`,
  `/creations/${TEST_VIDEO_ID}`,
  `/items/${TEST_VIDEO_ID}`
];

async function testEndpoint(path) {
  try {
    console.log(`Testing: ${BLOTATO_BASE_URL}${path}`);
    const res = await axios.get(
      `${BLOTATO_BASE_URL}${path}`,
      { 
        headers: { 'blotato-api-key': BLOTATO_API_KEY },
        timeout: 10000
      }
    );
    
    console.log('✅ SUCCESS! Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return true;
  } catch (err) {
    if (err.response) {
      console.log(`❌ ${err.response.status} -`, err.response.statusText);
    } else {
      console.log('❌ Error:', err.message);
    }
    return false;
  }
}

async function main() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
