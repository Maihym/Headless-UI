/**
 * Google Calendar Configuration Checker
 * 
 * Run this script to verify your Google Calendar setup:
 * node verify-google-setup.js
 */

const fs = require('fs');
const path = require('path');

const requiredVars = [
  'GOOGLE_CALENDAR_ID',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
];

console.log('\n🔍 Checking Google Calendar Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`📁 .env.local file: ${envExists ? '✅ Found' : '❌ Not found'}\n`);

if (!envExists) {
  console.log('❌ .env.local file does not exist!\n');
  console.log('📝 To fix this:\n');
  console.log('1. Create a .env.local file in the root directory:');
  console.log('   C:\\Users\\Maihym\\Desktop\\First-Electric\\Website\\Something\\.env.local\n');
  console.log('2. Copy contents from .env.local.example (created for you)');
  console.log('3. Replace placeholder values with real credentials from:');
  console.log('   • Google Cloud Console (console.cloud.google.com)');
  console.log('   • OAuth 2.0 Playground (developers.google.com/oauthplayground)\n');
  console.log('4. See SETUP.md lines 66-96 for detailed step-by-step instructions\n');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Simple parser
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    value = value.replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

console.log('📋 Environment Variables:\n');

let allPresent = true;
let hasPlaceholders = false;

for (const varName of requiredVars) {
  const value = envVars[varName];
  
  if (!value) {
    console.log(`❌ ${varName}: MISSING`);
    allPresent = false;
  } else if (value.includes('your_') || value.includes('_here')) {
    console.log(`⚠️  ${varName}: ${value} (placeholder detected)`);
    hasPlaceholders = true;
  } else {
    // Show first/last few characters for verification
    const masked = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
      : `${value.substring(0, 5)}...`;
    console.log(`✅ ${varName}: ${masked}`);
  }
}

console.log('\n📋 Summary:\n');

if (!allPresent) {
  console.log('❌ Missing environment variables in .env.local!\n');
  console.log('📝 Add these missing variables to .env.local:');
  requiredVars.forEach(varName => {
    if (!envVars[varName]) {
      console.log(`   ${varName}=your_value_here`);
    }
  });
  console.log('\n💡 See SETUP.md for instructions on getting these values\n');
} else if (hasPlaceholders) {
  console.log('⚠️  All variables present but some are still placeholders!\n');
  console.log('📝 Next steps:');
  console.log('1. Follow SETUP.md (lines 66-96) to get real credentials');
  console.log('2. Replace the placeholder values in .env.local');
  console.log('3. Restart your dev server\n');
} else {
  console.log('✅ All Google Calendar environment variables are configured!\n');
  console.log('📝 Next steps:');
  console.log('1. Restart your dev server if it\'s running');
  console.log('2. The "Google Calendar not configured" message should disappear');
  console.log('3. Visit http://localhost:3001/calendar-test to verify\n');
  console.log('💡 If you still see the message, the credentials might be invalid.');
  console.log('   Check the console for specific error messages.\n');
}

