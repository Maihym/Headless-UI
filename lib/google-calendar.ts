import { google } from 'googleapis';

async function getGoogleAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  
  return oauth2Client;
}

export async function createCalendarEvent({
  name,
  email,
  phone,
  serviceType,
  dateTime,
  message,
  address,
  duration = 120,
}: {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  dateTime: string;
  message?: string;
  address?: string;
  duration?: number; // in minutes
}) {
  try {
    const auth = await getGoogleAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    
    const startDateTime = new Date(dateTime);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

    const event = {
      summary: `${serviceType} - ${name}`,
      description: `
Service: ${serviceType}
Client: ${name}
Phone: ${phone}
Email: ${email}
${address ? `Address: ${address}` : ''}
${message ? `\nNotes: ${message}` : ''}
      `.trim(),
      location: address || '',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      attendees: [{ email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 min before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
      sendUpdates: 'all',
    });

    return { success: true, event: response.data, eventId: response.data.id };
  } catch (error) {
    console.error('Calendar event creation error:', error);
    return { success: false, error };
  }
}

