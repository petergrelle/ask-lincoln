export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const { sessionId } = JSON.parse(event.body)
    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false }),
      }
    }
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      }
    )
    const session = await res.json()
    const valid = session.payment_status === 'paid'
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid }),
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ valid: false }),
    }
  }
}
