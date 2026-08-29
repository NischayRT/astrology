// lib/panchang.js

// 1. Core Astronomical Math
function julianDay(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

function fmt12(h) {
  h = ((h % 24) + 24) % 24;
  const hh24 = Math.floor(h);
  const mm = Math.round((h - hh24) * 60);
  const period = hh24 >= 12 ? 'PM' : 'AM';
  let hh12 = hh24 % 12;
  if (hh12 === 0) hh12 = 12;
  const adjMm = mm === 60 ? 0 : mm;
  const adjHh = mm === 60 ? hh12 + 1 : hh12;
  return adjHh + ':' + String(adjMm).padStart(2, '0') + ' ' + period;
}

function sunEvent(jd, event, lat, lon, tz) {
  const n = jd - 2451545.0 + 0.0008;
  const M = ((357.5291 + 0.98560028 * n) % 360 + 360) % 360;
  const Mr = M * Math.PI / 180;
  const C = 1.9148 * Math.sin(Mr) + 0.0200 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
  const L = ((M + C + 180 + 102.9372) % 360 + 360) % 360;
  const Lr = L * Math.PI / 180;
  let Jt = 2451545.0 + 0.0009 + (-lon / 360) + n;
  Jt += 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * Lr);
  const delta = Math.asin(Math.sin(Lr) * Math.sin(23.44 * Math.PI / 180));
  const latR = lat * Math.PI / 180;
  let cosOmega = (Math.sin(-0.83 * Math.PI / 180) - Math.sin(latR) * Math.sin(delta)) / (Math.cos(latR) * Math.cos(delta));
  cosOmega = Math.max(-1, Math.min(1, cosOmega));
  const omega = Math.acos(cosOmega) * 180 / Math.PI;
  const Je = event === 'sunrise' ? Jt - omega / 360 : Jt + omega / 360;
  const hUtc = (Je - jd + 0.5) * 24;
  return ((hUtc + tz) % 24 + 24) % 24;
}

function getMoonSunLongitudes(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lmoon = ((218.3164477 + 481267.88123421 * T) % 360 + 360) % 360;
  const Mmoon = ((134.9633964 + 477198.8675055 * T) % 360 + 360) % 360;
  const Msun  = ((357.5291092 + 35999.0502909 * T) % 360 + 360) % 360;
  const D     = ((297.8501921 + 445267.1114034 * T) % 360 + 360) % 360;
  const Mmr = Mmoon * Math.PI / 180;
  const Msr = Msun * Math.PI / 180;
  const Dr  = D * Math.PI / 180;
  const corr = 6.289 * Math.sin(Mmr) - 1.274 * Math.sin(Mmr - 2 * Dr) + 0.658 * Math.sin(2 * Dr) - 0.186 * Math.sin(Msr) - 0.059 * Math.sin(2 * Mmr - 2 * Dr) - 0.057 * Math.sin(Mmr - 2 * Dr + Msr) + 0.053 * Math.sin(Mmr + 2 * Dr) + 0.046 * Math.sin(2 * Dr - Msr) + 0.041 * Math.sin(Mmr - Msr) - 0.035 * Math.sin(Dr) - 0.031 * Math.sin(Mmr + Msr);
  const moonLon = ((Lmoon + corr) % 360 + 360) % 360;
  const sunM = ((357.5291 + 0.98560028 * (jd - 2451545.0)) % 360 + 360) % 360;
  const sunMr = sunM * Math.PI / 180;
  const sunC = 1.9148 * Math.sin(sunMr) + 0.0200 * Math.sin(2 * sunMr) + 0.0003 * Math.sin(3 * sunMr);
  const sunLon = ((sunM + sunC + 102.9372 + 180) % 360 + 360) % 360;
  
  // Approximate Lahiri ayanamsa
  const yearsFrom2026 = (jd - 2461041.5) / 365.25;
  const ayanamsa = 24.18 + (50.3 / 3600) * yearsFrom2026;
  
  return {
    sunSid: ((sunLon - ayanamsa) % 360 + 360) % 360,
    moonSid: ((moonLon - ayanamsa) % 360 + 360) % 360,
  };
}

function getTithi(sunSid, moonSid) {
  const diff = ((moonSid - sunSid) % 360 + 360) % 360;
  const num = Math.floor(diff / 12) + 1;
  const names = ['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima'];
  let name, paksha;
  if (num === 15) { name = 'Purnima'; paksha = 'Shukla'; }
  else if (num === 30) { name = 'Amavasya'; paksha = 'Krishna'; }
  else if (num <= 14) { name = names[num - 1]; paksha = 'Shukla'; }
  else { name = names[num - 16]; paksha = 'Krishna'; }
  return paksha + ' ' + name;
}

function getNakshatra(moonSid) {
  const idx = Math.floor(moonSid / (360 / 27));
  const names = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
  return names[idx];
}

// 2. Main Export Function for Next.js
export function getDailyPanchang(date = new Date(), lat = 17.385, lon = 78.4867, tz = 5.5) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jd = julianDay(y, m, d);

  const sunrise = sunEvent(jd, 'sunrise', lat, lon, tz);
  const sunset = sunEvent(jd, 'sunset', lat, lon, tz);
  const dayLen = sunset - sunrise;
  const segH = dayLen / 8;

  const weekday = date.getDay(); // 0 = Sunday
  const rahuSeg = {0:8, 1:2, 2:7, 3:5, 4:6, 5:4, 6:3}[weekday];
  const yamaSeg = {0:5, 1:4, 2:3, 3:2, 4:1, 5:7, 6:6}[weekday];
  const gulSeg  = {0:7, 1:6, 2:5, 3:4, 4:3, 5:2, 6:1}[weekday];

  const segTime = (n) => [sunrise + (n - 1) * segH, sunrise + n * segH];
  const [rs, re] = segTime(rahuSeg);
  const [ys, ye] = segTime(yamaSeg);
  const [gs, ge] = segTime(gulSeg);

  const noon = (sunrise + sunset) / 2;
  const abhStart = noon - 24/60;
  const abhEnd = noon + 24/60;

  const { sunSid, moonSid } = getMoonSunLongitudes(jd);

  return {
    tithi: getTithi(sunSid, moonSid),
    nakshatra: getNakshatra(moonSid),
    sunrise: fmt12(sunrise),
    sunset: fmt12(sunset),
    rahukalam: fmt12(rs) + ' – ' + fmt12(re),
    yamagandam: fmt12(ys) + ' – ' + fmt12(ye),
    gulika: fmt12(gs) + ' – ' + fmt12(ge),
    abhijit: fmt12(abhStart) + ' – ' + fmt12(abhEnd),
    dateStr: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}