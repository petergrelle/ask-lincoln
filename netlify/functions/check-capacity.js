export async function handler(event) {
  const minCredits = parseInt(process.env.MIN_RUNWAY_CREDITS || '1000')

  try {
    const res = await fetch('https://api.dev.runwayml.com/v1/organization', {
      headers: {
        Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}`,
        'X-Runway-Version': '2024-11-06',
      },
    })
    const data = await res.json()
    const available = data.credits === undefined || data.credits >= minCredits

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available }),
    }
  } catch (e) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: true }),
    }
  }
}
