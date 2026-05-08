import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

/**
 * Creates a Google Calendar event with a unique Google Meet link.
 */
export async function createGoogleMeeting({
  studentEmail,
  tutorEmail,
  startTime,
  endTime,
  summary,
  description
}: {
  studentEmail: string;
  tutorEmail: string;
  startTime: Date;
  endTime: Date;
  summary: string;
  description: string;
}) {
  try {
    // Correct way to initialize JWT with googleapis v100+
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: [
        { email: studentEmail },
        { email: tutorEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking_${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink,
    };
  } catch (error) {
    console.error("Google Calendar API Error:", error);
    return null;
  }
}
