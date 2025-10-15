import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to check Google Calendar environment variables
 * GET /api/check-env
 */
export async function GET() {
  const envVars = {
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  };

  // Check which variables are present
  const status = {
    GOOGLE_CALENDAR_ID: Boolean(envVars.GOOGLE_CALENDAR_ID),
    GOOGLE_CLIENT_ID: Boolean(envVars.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: Boolean(envVars.GOOGLE_CLIENT_SECRET),
    GOOGLE_REFRESH_TOKEN: Boolean(envVars.GOOGLE_REFRESH_TOKEN),
    allConfigured: Boolean(
      envVars.GOOGLE_CALENDAR_ID &&
      envVars.GOOGLE_CLIENT_ID &&
      envVars.GOOGLE_CLIENT_SECRET &&
      envVars.GOOGLE_REFRESH_TOKEN
    ),
  };

  // Mask sensitive values for security
  const maskedValues = {
    GOOGLE_CALENDAR_ID: envVars.GOOGLE_CALENDAR_ID || '(not set)',
    GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID 
      ? `${envVars.GOOGLE_CLIENT_ID.substring(0, 15)}...` 
      : '(not set)',
    GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET 
      ? `${envVars.GOOGLE_CLIENT_SECRET.substring(0, 10)}...` 
      : '(not set)',
    GOOGLE_REFRESH_TOKEN: envVars.GOOGLE_REFRESH_TOKEN 
      ? `${envVars.GOOGLE_REFRESH_TOKEN.substring(0, 10)}...` 
      : '(not set)',
  };

  return NextResponse.json({
    status,
    maskedValues,
    message: status.allConfigured 
      ? '✅ All Google Calendar environment variables are configured!' 
      : '❌ Some environment variables are missing',
  });
}

