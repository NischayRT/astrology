import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. Extract the sign from the incoming request (e.g., /api/horoscope?sign=aries)
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');

  if (!sign) {
    return NextResponse.json({ error: "Zodiac sign is required" }, { status: 400 });
  }

  // 2. Grab your secret credentials from the .env.local file
  const userId = process.env.VEDIC_RISHI_USER_ID;
  const apiKey = process.env.VEDIC_RISHI_API_KEY;

  // 3. Vedic Rishi requires Basic Auth (Base64 encoded string of "userId:apiKey")
  const authString = Buffer.from(`${userId}:${apiKey}`).toString('base64');

  try {
    // 4. Make the secure fetch to Vedic Rishi's server
    // Note: Verify this exact endpoint URL in your Vedic Rishi documentation
    const response = await fetch(`https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`, {
      method: 'POST', // Vedic Rishi typically requires POST for these requests
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      // NEW: Tell Next.js to cache this specific request for 12 hours (43200 seconds)
      next: { revalidate: 43200 } 
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 5. Send the clean data back to your frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error("Horoscope API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch horoscope data" }, { status: 500 });
  }
}