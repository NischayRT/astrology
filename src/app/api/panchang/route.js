import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!day || !month || !year) {
    return NextResponse.json({ error: "Missing date parameters" }, { status: 400 });
  }

  const userId = process.env.VEDIC_RISHI_USER_ID;
  const apiKey = process.env.VEDIC_RISHI_API_KEY;
  const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');

  try {
    const response = await fetch("https://json.astrologyapi.com/v1/advanced_panchang", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        hour: 6, 
        min: 0,
        lat: 17.3850, // Hyderabad
        lon: 78.4867,
        tzone: 5.5
      })
    });

    if (!response.ok) throw new Error("API responded with an error");
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Panchang API Error:", error);
    return NextResponse.json({ error: "Failed to fetch Panchang" }, { status: 500 });
  }
}