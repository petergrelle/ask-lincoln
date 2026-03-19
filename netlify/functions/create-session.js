import Runway from '@runwayml/sdk';

const runway = new Runway(); // Uses RUNWAYML_API_SECRET env var

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const avatarId = process.env.RUNWAY_AVATAR_ID;

    if (!avatarId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'RUNWAY_AVATAR_ID not configured' }),
      };
    }

    const session = await runway.realtime.sessions.create({
      model: 'gwm1_avatars',
      options: {
        avatar: avatarId,
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        serverUrl: session.url,
        token: session.token,
        roomName: session.room_name,
      }),
    };
  } catch (error) {
    console.error('Session creation failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create session', details: error.message }),
    };
  }
}
