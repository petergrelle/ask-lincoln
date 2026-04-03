export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const { code } = JSON.parse(event.body)
    const validCodes = (process.env.ACCESS_CODES || '')
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean)
    const isValid = validCodes.includes(code.toUpperCase())
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: isValid }),
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ valid: false }),
    }
  }
}
