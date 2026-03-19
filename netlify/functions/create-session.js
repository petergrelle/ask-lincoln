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

    // Step 1: Create the session
    const createResponse = await fetch('https://api.dev.runwayml.com/v1/realtime_sessions', {
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

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Runway create error:', createResponse.status, errorText);
      return {
        statusCode: createResponse.status,
        body: JSON.stringify({ error: 'Runway create error', details: errorText }),
      };
    }

    const created = await createResponse.json();
    console.log('Created session:', created.id);

    // Step 2: Poll until READY
    for (let i = 0; i < 15; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const getResponse = await fetch(`https://api.dev.runwayml.com/v1/realtime_sessions/${created.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-Runway-Version': '2024-11-06',
        },
      });

      if (getResponse.ok) {
        const session = await getResponse.json();
        console.log(`Poll ${i + 1}:`, session.status);

        if (session.status === 'READY' && session.sessionKey) {
          console.log('Session ready, returning credentials');
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: session.id,
              sessionKey: session.sessionKey,
              expiresAt: session.expiresAt,
            }),
          };
        }
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Session did not become ready in time' }),
    };
  } catch (error) {
    console.error('Session creation failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create session', details: error.message }),
    };
  }
}
