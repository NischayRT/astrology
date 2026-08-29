import { NextResponse } from 'next/server';
import { calculateChart, ashtakootMatching, mangalDoshaCheck, lookupCity } from '@/lib/vedicMath';

export async function POST(request) {
  try {
    const { p1, p2 } = await request.json();

    // Helper to parse the incoming date/time strings into JS Dates
    const parseDate = (dob, time) => {
      const [y, m, d] = dob.split('-').map(Number);
      const [h, mn] = (time || '12:00').split(':').map(Number);
      return new Date(y, m - 1, d, h, mn);
    };

    const date1 = parseDate(p1.dob, p1.time);
    const date2 = parseDate(p2.dob, p2.time);

    // Default to Hyderabad coordinates if city lookup fails or isn't provided
    const coords1 = lookupCity(p1.place) || [17.385, 78.4867];
    const coords2 = lookupCity(p2.place) || [17.385, 78.4867];

    // Calculate both birth charts (using standard 5.5 IST offset)
    const chart1 = await calculateChart(date1, coords1[0], coords1[1], 5.5);
    const chart2 = await calculateChart(date2, coords2[0], coords2[1], 5.5);

    // Run the matching algorithms
    const matching = ashtakootMatching(chart1.moon.longitude, chart2.moon.longitude);
    const mangal1 = mangalDoshaCheck(chart1);
    const mangal2 = mangalDoshaCheck(chart2);

    // Determine the verdict
    const total = matching.total;
    let verdict, verdictColor;
    if (total >= 28) { verdict = 'Excellent Match'; verdictColor = '#2ecc71'; }
    else if (total >= 24) { verdict = 'Very Good Match'; verdictColor = '#27ae60'; }
    else if (total >= 18) { verdict = 'Good Match'; verdictColor = '#f0c849'; }
    else if (total >= 12) { verdict = 'Average — Remedies Recommended'; verdictColor = '#e67e22'; }
    else { verdict = 'Poor — Consultation Strongly Advised'; verdictColor = '#ff6b6b'; }

    return NextResponse.json({
      success: true,
      total,
      max: matching.max,
      verdict,
      verdictColor,
      koots: matching.koots,
      partner1: {
        name: p1.name || 'Partner 1',
        rashi: chart1.moon.rashi, // You can map this to the Rashi name on the frontend
        mangal: mangal1
      },
      partner2: {
        name: p2.name || 'Partner 2',
        rashi: chart2.moon.rashi,
        mangal: mangal2
      }
    });

  } catch (error) {
    console.error("Matching Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to calculate match.' }, { status: 500 });
  }
}