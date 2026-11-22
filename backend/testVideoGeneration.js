#!/usr/bin/env node
/**
 * Test Video Generation APIs (Gemini + Blotato)
 * Tests the video generation flow without needing the full backend running
 */

require('dotenv').config();
const axios = require('axios');

const BLOTATO_API_KEY = process.env.BLOTATO_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BLOTATO_BASE_URL = 'https://backend.blotato.com/v2';

console.log('🎬 Testing Video Generation APIs\n');
console.log('Configuration:');
console.log('- Blotato API Key:', BLOTATO_API_KEY ? '✅ Set (' + BLOTATO_API_KEY.substring(0, 10) + '...)' : '❌ Missing');
console.log('- Gemini API Key:', GEMINI_API_KEY ? '✅ Set (' + GEMINI_API_KEY.substring(0, 12) + '...)' : '❌ Missing');
console.log('');

if (!BLOTATO_API_KEY || !GEMINI_API_KEY) {
  console.error('❌ Missing API keys in .env file');
  process.exit(1);
}

async function testGemini() {
  console.log('📝 Step 1: Testing Gemini Prompt Enhancement...');
  
  const prompt = 'A beautiful sunset over mountains';
  const enhancementPrompt = `You are a professional video prompt engineer. Transform this user prompt into a detailed, cinematic video description suitable for AI video generation. Focus on visual details, atmosphere, camera movements, and mood. Keep it under 500 characters but make it vivid and engaging.

User prompt: "${prompt}"

Enhanced prompt:`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: enhancementPrompt }]
        }]
      },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const enhancedPrompt = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!enhancedPrompt) {
      console.error('❌ Gemini API returned empty response');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return null;
    }

    console.log('✅ Gemini Success!');
    console.log('Original:', prompt);
    console.log('Enhanced:', enhancedPrompt);
    console.log('');
    
    return enhancedPrompt;

  } catch (err) {
    console.error('❌ Gemini API Error:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Error:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    return null;
  }
}

async function testBlotato(enhancedPrompt) {
  console.log('🎥 Step 2: Testing Blotato Video Generation...');
  
  try {
    // First, get the template
    console.log('Fetching "AI Video with AI Voice" template...');
    const templatesRes = await axios.get(
      `${BLOTATO_BASE_URL}/videos/templates?search=AI Video with AI Voice&fields=id,name,description,inputs`,
      { 
        headers: { 'blotato-api-key': BLOTATO_API_KEY },
        timeout: 30000
      }
    );

    const template = templatesRes.data?.items?.[0];
    if (!template || !template.id) {
      console.error('❌ Template not found');
      console.log('Response:', JSON.stringify(templatesRes.data, null, 2));
      return null;
    }

    console.log('✅ Template found:', template.name, '(ID:', template.id + ')');
    console.log('');

    // Create video
    console.log('Creating video with Blotato...');
    const createPayload = {
      templateId: template.id,
      inputs: {},
      prompt: enhancedPrompt,
      render: true,
      title: `Test Video - ${new Date().toISOString()}`
    };

    const createRes = await axios.post(
      `${BLOTATO_BASE_URL}/videos/from-templates`,
      createPayload,
      { 
        headers: { 
          'blotato-api-key': BLOTATO_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const videoId = createRes.data?.video?.id;
    const status = createRes.data?.video?.status;
    
    if (!videoId) {
      console.error('❌ Video creation failed - no video ID returned');
      console.log('Response:', JSON.stringify(createRes.data, null, 2));
      return null;
    }

    console.log('✅ Video Created!');
    console.log('Video ID:', videoId);
    console.log('Status:', status);
    console.log('');
    
    return videoId;

  } catch (err) {
    console.error('❌ Blotato API Error:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Error:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    return null;
  }
}

async function checkVideoStatus(videoId) {
  console.log('⏳ Step 3: Checking Video Status...');
  console.log('Video ID:', videoId);
  
  try {
    const statusRes = await axios.get(
      `${BLOTATO_BASE_URL}/videos/${videoId}`,
      { 
        headers: { 'blotato-api-key': BLOTATO_API_KEY },
        timeout: 30000
      }
    );

    const video = statusRes.data?.video;
    if (!video) {
      console.error('❌ No video data returned');
      return;
    }

    console.log('✅ Video Status Retrieved!');
    console.log('Status:', video.status);
    console.log('Progress:', video.progress || 'N/A');
    if (video.downloadUrl) {
      console.log('Download URL:', video.downloadUrl);
    }
    if (video.streamUrl) {
      console.log('Stream URL:', video.streamUrl);
    }
    console.log('');

    return video;

  } catch (err) {
    console.error('❌ Status Check Error:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Error:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

async function main() {
  console.log('Starting tests...\n');
  
  // Test 1: Gemini
  const enhancedPrompt = await testGemini();
  if (!enhancedPrompt) {
    console.error('\n❌ Test failed at Gemini step');
    process.exit(1);
  }

  // Test 2: Blotato
  const videoId = await testBlotato(enhancedPrompt);
  if (!videoId) {
    console.error('\n❌ Test failed at Blotato step');
    process.exit(1);
  }

  // Test 3: Status
  await checkVideoStatus(videoId);

  console.log('✅ All tests completed!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Video is being generated (ID: ' + videoId + ')');
  console.log('2. Check status again in 30 seconds with:');
  console.log('   node testVideoGeneration.js --check ' + videoId);
  console.log('3. Or visit Blotato dashboard to monitor progress');
}

// Check if we're checking status of existing video
const args = process.argv.slice(2);
if (args[0] === '--check' && args[1]) {
  checkVideoStatus(args[1])
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
} else {
  main().catch(err => {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  });
}
