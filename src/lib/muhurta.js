// lib/muhurta.js

export const PRESET_CITIES = [
  { name: 'Hyderabad, India', lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: 'Delhi NCR, India', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Vijayawada, India', lat: 16.5062, lon: 80.6480, tz: 5.5 },
  { name: 'Visakhapatnam, India', lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { name: 'Tirupati, India', lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: 'Varanasi, India', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278, tz: 0.0 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060, tz: -5.0 },
  { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194, tz: -8.0 },
];

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
    );
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((item) => {
      const parts = [item.name, item.admin1, item.country].filter(Boolean);
      return {
        name: parts.join(', '),
        lat: item.latitude,
        lon: item.longitude,
        tz: item.utc_offset_seconds ? item.utc_offset_seconds / 3600 : 5.5,
      };
    });
  } catch (err) {
    console.error('Geocoding search failed:', err);
    return [];
  }
}

const rad = Math.PI / 180, dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
const J0 = 0.0009;

function toDays(date) { return date.valueOf() / dayMs - 0.5 + J1970 - J2000; }
function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
function eclipticLongitude(M) {
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  return M + C + rad * 102.9372 + Math.PI;
}
function declination(l) { return Math.asin(Math.sin(l) * Math.sin(rad * 23.4397)); }
function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * Math.PI) + n; }
function solarTransitJ(ds, M, L) { return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L); }
function hourAngle(h, phi, dec) { return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec))); }
function fromJulian(j) { return new Date((j + 0.5 - J1970) * dayMs); }

export function getSunTimes(date, lat, lng) {
  const lw = rad * -lng, phi = rad * lat, d = toDays(date);
  const n = Math.round(d - J0 - lw / (2 * Math.PI));
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds), L = eclipticLongitude(M), dec = declination(L);
  const Jnoon = solarTransitJ(ds, M, L);
  const w = hourAngle(-0.833 * rad, phi, dec);
  const Jset = solarTransitJ(approxTransit(w, lw, n), M, L);
  const Jrise = Jnoon - (Jset - Jnoon);
  return { sunrise: fromJulian(Jrise), sunset: fromJulian(Jset), noon: fromJulian(Jnoon) };
}

const CHOG = ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];
const CHOG_GOOD = { Amrit: true, Shubh: true, Labh: true, Char: true };
const DAY_START = [0, 3, 6, 2, 5, 1, 4];

function chogSpan(start, total, count, startIdx, step) {
  const len = (total - start) / count;
  const out = [];
  for (let i = 0; i < count; i++) {
    const name = CHOG[(((startIdx + step * i) % 7) + 7) % 7];
    out.push({
      name,
      isGood: !!CHOG_GOOD[name],
      from: new Date(start + i * len),
      to: new Date(start + (i + 1) * len),
    });
  }
  return out;
}

export function getChoghadiya(date, lat, lon) {
  const s = getSunTimes(date, lat, lon);
  const nextDay = new Date(date.getTime() + dayMs);
  const sNext = getSunTimes(nextDay, lat, lon);
  const dow = date.getDay();
  const nightStartIdx = DAY_START[(dow + 4) % 7];

  return {
    day: chogSpan(s.sunrise.getTime(), s.sunset.getTime(), 8, DAY_START[dow], 1),
    night: chogSpan(s.sunset.getTime(), sNext.sunrise.getTime(), 8, nightStartIdx, -2),
  };
}

const RAHU_SEG = [8, 2, 7, 5, 6, 4, 3];
const YAMA_SEG = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEG = [7, 6, 5, 4, 3, 2, 1];

function getEighth(sr, ss, n) {
  const len = (ss - sr) / 8;
  return { from: new Date(sr + (n - 1) * len), to: new Date(sr + n * len) };
}

export function getMuhurtaWindows(date, lat, lon) {
  const s = getSunTimes(date, lat, lon);
  const prevDay = new Date(date.getTime() - dayMs);
  const sPrev = getSunTimes(prevDay, lat, lon);

  const dow = date.getDay();
  const sr = s.sunrise.getTime();
  const ss = s.sunset.getTime();
  const mu = (ss - sr) / 15;
  const nightMu = (sr - sPrev.sunset.getTime()) / 15;

  return {
    sunrise: s.sunrise,
    sunset: s.sunset,
    rahu: getEighth(sr, ss, RAHU_SEG[dow]),
    yama: getEighth(sr, ss, YAMA_SEG[dow]),
    gulika: getEighth(sr, ss, GULIKA_SEG[dow]),
    abhijit: { from: new Date(sr + 7 * mu), to: new Date(sr + 8 * mu) },
    brahma: { from: new Date(sr - 2 * nightMu), to: new Date(sr - 1 * nightMu) },
  };
}

export function formatTimeRange(range) {
  if (!range || !range.from || !range.to) return '—';
  const fmt = (d) => {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };
  return `${fmt(range.from)} – ${fmt(range.to)}`;
}