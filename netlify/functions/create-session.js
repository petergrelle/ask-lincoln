export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const apiKey = process.env.RUNWAYML_API_SECRET;
    const avatarId = process.env.RUNWAY_AVATAR_ID;

    if (!apiKey || !avatarId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables' }),
      };
    }

    const response = await fetch('https://api.dev.runwayml.com/v1/realtime_sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify({
        model: 'gwm1_avatars',
        avatar: {
          type: 'custom',
          avatarId: avatarId,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Runway API error:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Runway API error', details: errorText }),
      };
    }

    const session = await response.json();
    console.log('FULL RUNWAY RESPONSE:', JSON.stringify(session));

    // Pass through the entire response — let the SDK pick what it needs
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error('Session creation failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create session', details: error.message }),
    };
  }
}
