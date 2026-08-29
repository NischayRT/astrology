// src/lib/vedicMath.js
// Pure JavaScript implementation — Server Safe (No DOM/Window references)

let AYANAMSA_SYSTEM = 'lahiri';

function getLahiriAyanamsa(jd) {
  const T_y = (jd - 2451545.0) / 365.25; 
  return 23.85275 + (50.290966 / 3600) * T_y;
}

function getKPAyanamsa(jd) {
  return getLahiriAyanamsa(jd) - (6 / 60); 
}

function getAyanamsa(jd) {
  return AYANAMSA_SYSTEM === 'kp' ? getKPAyanamsa(jd) : getLahiriAyanamsa(jd);
}

function gregorianToJD(year, month, day, hour) {
  let a, b, jd;
  if (month <= 2) { year -= 1; month += 12; }
  a = Math.floor(year / 100);
  b = 2 - a + Math.floor(a / 4);
  jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  return jd + hour / 24;
}

function calcSun(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  return normalize(L0 + C);
}

function calcMoon(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  const Drad = D * Math.PI / 180;
  const Mrad = M * Math.PI / 180;
  const Mprad = Mp * Math.PI / 180;
  const Frad = F * Math.PI / 180;
  const sigma_l = 6288774 * Math.sin(Mprad) +
                  1274027 * Math.sin(2 * Drad - Mprad) +
                  658314 * Math.sin(2 * Drad) +
                  213618 * Math.sin(2 * Mprad) +
                  -185116 * Math.sin(Mrad) +
                  -114332 * Math.sin(2 * Frad) +
                  58793 * Math.sin(2 * Drad - 2 * Mprad) +
                  57066 * Math.sin(2 * Drad - Mrad - Mprad) +
                  53322 * Math.sin(2 * Drad + Mprad) +
                  45758 * Math.sin(2 * Drad - Mrad);
  return normalize(L + sigma_l / 1000000);
}

function calcPlanet(jd, planet) {
  if (planet === 'Sun') return calcSun(jd);
  if (planet === 'Moon') return calcMoon(jd);

  const T = (jd - 2451545.0) / 36525;
  const elems = {
    Mercury: { L0: 252.250906, n: 149472.6746358, e: 0.20563593, M0: 174.7948, omega: 77.45645 },
    Venus:   { L0: 181.979801, n: 58517.8156760,  e: 0.00677672, M0: 50.4161,  omega: 131.53298 },
    Mars:    { L0: 355.433000, n: 19140.2993039,  e: 0.09340065, M0: 19.3870,  omega: 336.04084 },
    Jupiter: { L0: 34.351519,  n: 3034.9056606,   e: 0.04849793, M0: 20.0202,  omega: 14.72847 },
    Saturn:  { L0: 50.077444,  n: 1222.1138488,   e: 0.05554814, M0: 317.0207, omega: 92.43194 }
  };
  if (!elems[planet]) return 0;
  const el = elems[planet];
  const L = normalize(el.L0 + el.n * T);
  const M = normalize(L - el.omega);
  const Mrad = M * Math.PI / 180;
  const e = el.e;
  const C = (2 * e - e*e*e/4) * Math.sin(Mrad) +
            (5*e*e/4 - 11*e*e*e*e/24) * Math.sin(2 * Mrad) +
            (13*e*e*e/12) * Math.sin(3 * Mrad);
  return normalize(L + C * 180 / Math.PI);
}

function calcRahu(jd) {
  const T = (jd - 2451545.0) / 36525;
  return normalize(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
}

function calcAscendant(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
             0.000387933 * T * T - T * T * T / 38710000;
  gmst = normalize(gmst);
  const ramc = normalize(gmst + lon);
  const ramcRad = ramc * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  const eps = 23.4392911 * Math.PI / 180; 
  const y = Math.cos(ramcRad);
  const x = -(Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(ramcRad));
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  return normalize(asc);
}

async function calculateChart(birthDate, lat, lon, tzOffsetHours) {
  const utcDate = new Date(birthDate.getTime() - tzOffsetHours * 3600 * 1000);
  const y = utcDate.getUTCFullYear();
  const m = utcDate.getUTCMonth() + 1;
  const d = utcDate.getUTCDate();
  const hourFloat = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60 + utcDate.getUTCSeconds() / 3600;
  const jd = gregorianToJD(y, m, d, hourFloat);

  const sunTrop = calcPlanet(jd, 'Sun');
  const moonTrop = calcPlanet(jd, 'Moon');
  const mercTrop = calcPlanet(jd, 'Mercury');
  const venusTrop = calcPlanet(jd, 'Venus');
  const marsTrop = calcPlanet(jd, 'Mars');
  const jupTrop = calcPlanet(jd, 'Jupiter');
  const satTrop = calcPlanet(jd, 'Saturn');
  const rahuTrop = calcRahu(jd);
  const ketuTrop = normalize(rahuTrop + 180);
  const ascTrop = calcAscendant(jd, lat, lon);

  const ayanamsa = getAyanamsa(jd);
  const toSidereal = (deg) => normalize(deg - ayanamsa);

  const sunLon = toSidereal(sunTrop);
  const moonLon = toSidereal(moonTrop);
  const marsLon = toSidereal(marsTrop);
  const ascLon = toSidereal(ascTrop);

  const planets = { Sun: sunLon, Moon: moonLon, Mars: marsLon, Mercury: toSidereal(mercTrop),
                    Jupiter: toSidereal(jupTrop), Venus: toSidereal(venusTrop), Saturn: toSidereal(satTrop), Rahu: toSidereal(rahuTrop), Ketu: toSidereal(ketuTrop) };
  const lagnaRashi = getRashi(ascLon);
  const moonNak = getNakshatra(moonLon);
  const d1 = {};
  for (const p in planets) {
    const lng = planets[p];
    d1[p] = {
      longitude: lng, rashi: getRashi(lng), rashiDeg: getRashiDegrees(lng),
      nakshatra: getNakshatra(lng), houseFromLagna: ((getRashi(lng) - lagnaRashi + 12) % 12) + 1
    };
  }
  
  return {
    jd, ascendant: ascLon,
    lagna: { rashi: lagnaRashi, longitude: ascLon },
    planets, d1,
    moon: { rashi: getRashi(moonLon), nakshatra: moonNak, longitude: moonLon },
    sun: { rashi: getRashi(sunLon), longitude: sunLon }
  };
}

const RASHI_NAMES = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];
const RASHI_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const NAK_NAMES = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

function normalize(deg) { return ((deg % 360) + 360) % 360; }
function getRashi(deg) { return Math.floor(normalize(deg) / 30); }
function getRashiDegrees(deg) { return normalize(deg) % 30; }
function getNakshatra(deg) {
  const idx = Math.floor(normalize(deg) / (360/27));
  const inNak = normalize(deg) % (360/27);
  return { idx, name: NAK_NAMES[idx], pada: Math.floor(inNak / (360/108)) + 1 };
}

const VARNA = {0:4,1:1,2:2,3:3,4:4,5:1,6:2,7:3,8:4,9:1,10:2,11:3};
const VASHYA = {0:'chatushpada',1:'chatushpada',2:'manushya',3:'jalachara',4:'vanachara',5:'manushya',6:'manushya',7:'keeta',8:'manushya_chatushpada',9:'chatushpada_jalachara',10:'manushya',11:'jalachara'};
const YONI = {0:['Horse','M'],1:['Elephant','M'],2:['Sheep','M'],3:['Serpent','M'],4:['Serpent','F'],5:['Dog','F'],6:['Cat','F'],7:['Sheep','F'],8:['Cat','M'],9:['Rat','M'],10:['Rat','F'],11:['Cow','M'],12:['Buffalo','F'],13:['Tiger','F'],14:['Buffalo','M'],15:['Tiger','M'],16:['Deer','F'],17:['Deer','M'],18:['Dog','M'],19:['Monkey','M'],20:['Mongoose','M'],21:['Monkey','F'],22:['Lion','F'],23:['Horse','F'],24:['Lion','M'],25:['Cow','F'],26:['Elephant','F']};
const GANA = {0:'Deva',4:'Deva',6:'Deva',7:'Deva',12:'Deva',13:'Deva',16:'Deva',21:'Deva',26:'Deva',1:'Manushya',3:'Manushya',10:'Manushya',11:'Manushya',17:'Manushya',19:'Manushya',20:'Manushya',24:'Manushya',25:'Manushya',2:'Rakshasa',5:'Rakshasa',8:'Rakshasa',9:'Rakshasa',14:'Rakshasa',15:'Rakshasa',18:'Rakshasa',22:'Rakshasa',23:'Rakshasa'};

function getNadi(nakIdx) {
  const c = nakIdx % 9;
  if ([0,5,6].includes(c)) return 'Adi';
  if ([1,4,7].includes(c)) return 'Madhya';
  return 'Antya';
}

function ashtakootMatching(boyMoonLng, girlMoonLng) {
  const boyNak = Math.floor(normalize(boyMoonLng) / (360/27));
  const girlNak = Math.floor(normalize(girlMoonLng) / (360/27));
  const boyRashi = Math.floor(normalize(boyMoonLng) / 30);
  const girlRashi = Math.floor(normalize(girlMoonLng) / 30);
  const result = {};
  let total = 0;

  const varnaPts = VARNA[boyRashi] >= VARNA[girlRashi] ? 1 : 0;
  result.Varna = { points: varnaPts, max: 1, note: varnaPts ? 'Spiritual harmony' : 'Spiritual mismatch' };
  total += varnaPts;

  const vashyaPts = VASHYA[boyRashi] === VASHYA[girlRashi] ? 2 : 1;
  result.Vashya = { points: vashyaPts, max: 2, note: vashyaPts === 2 ? 'Mutual control' : 'Partial control' };
  total += vashyaPts;

  const diff = ((girlNak - boyNak) % 27 + 27) % 27;
  const taraCount = (diff % 9) + 1;
  let taraPts = [2,4,6,8,9].includes(taraCount) ? 3 : ([3,5,7].includes(taraCount) ? 1.5 : 0);
  result.Tara = { points: taraPts, max: 3, note: taraPts === 3 ? 'Auspicious destiny' : taraPts > 0 ? 'Mixed' : 'Inauspicious' };
  total += taraPts;

  const boyY = YONI[boyNak] || ['?','M'];
  const girlY = YONI[girlNak] || ['?','F'];
  let yoniPts = boyY[0] === girlY[0] ? 4 : 3;
  result.Yoni = { points: yoniPts, max: 4, note: yoniPts === 4 ? 'Same yoni — ideal' : 'Compatible' };
  total += yoniPts;

  const boyLord = RASHI_LORDS[boyRashi], girlLord = RASHI_LORDS[girlRashi];
  const friendly = {Sun:['Moon','Mars','Jupiter'],Moon:['Sun','Mercury'],Mars:['Sun','Moon','Jupiter'],Mercury:['Sun','Venus'],Jupiter:['Sun','Moon','Mars'],Venus:['Mercury','Saturn'],Saturn:['Mercury','Venus']};
  let grahaPts;
  if (boyLord === girlLord) grahaPts = 5;
  else if (friendly[boyLord]?.includes(girlLord) && friendly[girlLord]?.includes(boyLord)) grahaPts = 5;
  else if (friendly[boyLord]?.includes(girlLord) || friendly[girlLord]?.includes(boyLord)) grahaPts = 4;
  else grahaPts = 1;
  result['Graha Maitri'] = { points: grahaPts, max: 5, note: grahaPts >= 4 ? 'Friendly' : 'Neutral' };
  total += grahaPts;

  const boyG = GANA[boyNak] || 'Manushya', girlG = GANA[girlNak] || 'Manushya';
  let ganaPts;
  if (boyG === girlG) ganaPts = 6;
  else if ((boyG === 'Deva' && girlG === 'Manushya') || (boyG === 'Manushya' && girlG === 'Deva')) ganaPts = 5;
  else if ((boyG === 'Manushya' && girlG === 'Rakshasa') || (boyG === 'Rakshasa' && girlG === 'Manushya')) ganaPts = 1;
  else ganaPts = 0;
  result.Gana = { points: ganaPts, max: 6, note: ganaPts >= 5 ? 'Compatible temperament' : 'Mismatch' };
  total += ganaPts;

  const diffR = Math.abs(boyRashi - girlRashi);
  let bhaPts = [0,3,6,9].includes(diffR) ? 7 : ([2,5,8,11].includes(diffR) ? 0 : 4);
  result.Bhakoot = { points: bhaPts, max: 7, note: bhaPts === 7 ? 'Strong bond' : bhaPts > 0 ? 'Workable' : 'Bhakoot dosha' };
  total += bhaPts;

  const nadiPts = getNadi(boyNak) === getNadi(girlNak) ? 0 : 8;
  result.Nadi = { points: nadiPts, max: 8, note: nadiPts === 8 ? 'Healthy progeny' : 'Nadi dosha' };
  total += nadiPts;

  return { koots: result, total, max: 36 };
}

function mangalDoshaCheck(chart) {
  const marsRashi = chart.d1.Mars.rashi;
  const lagnaRashi = chart.lagna.rashi;
  const moonRashi = chart.moon.rashi;
  const fromLagna = ((marsRashi - lagnaRashi + 12) % 12) + 1;
  const fromMoon = ((marsRashi - moonRashi + 12) % 12) + 1;
  const dh = [1, 2, 4, 7, 8, 12];
  return {
    hasDosha: dh.includes(fromLagna) || dh.includes(fromMoon),
    fromLagna: dh.includes(fromLagna), fromMoon: dh.includes(fromMoon),
    marsHouseFromLagna: fromLagna, marsHouseFromMoon: fromMoon,
    severity: (dh.includes(fromLagna) && dh.includes(fromMoon)) ? 'Strong' :
              (dh.includes(fromLagna) || dh.includes(fromMoon)) ? 'Mild' : 'None'
  };
}

const CITY_DB = {'hyderabad':[17.385,78.4867],'delhi':[28.6139,77.209],'mumbai':[19.076,72.8777],'bangalore':[12.9716,77.5946],'chennai':[13.0827,80.2707],'kolkata':[22.5726,88.3639],'pune':[18.5204,73.8567],'ahmedabad':[23.0225,72.5714],'jaipur':[26.9124,75.7873],'surat':[21.1702,72.8311]};

function lookupCity(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  if (CITY_DB[q]) return CITY_DB[q];
  const firstPart = q.split(',')[0].trim();
  if (CITY_DB[firstPart]) return CITY_DB[firstPart];
  for (const city in CITY_DB) {
    if (city.startsWith(firstPart) || firstPart.startsWith(city)) return CITY_DB[city];
  }
  return null;
}

// Export only what the Next.js API route needs
export { 
  calculateChart, 
  ashtakootMatching, 
  mangalDoshaCheck, 
  lookupCity 
};