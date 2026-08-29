"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import HinduCalendar from "../components/HinduCalendar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDailyPanchang } from "../lib/panchang";

const SERVICES_WITH_IMG = [
  {
    title: "Janma Kundli",
    subtitle: "The blueprint of your destiny",
    desc: "Your birth chart is a sacred map drawn by the cosmos at the moment of your first breath. It reveals your strengths, your karmic patterns, and the timing of major life events.",
    cta: "View Kundali Analysis",
    href: "/services#janma-kundli",
    accent: "#8B6FA8",
    img: "/janmaKundali.png",
  },
  {
    title: "Vaastu Shastra",
    subtitle: "Harmonize your space with the five elements",
    desc: "Align your home or workspace with cosmic energies. When the five elements—earth, water, fire, air, and space—flow harmoniously, prosperity, health, and peace follow naturally.",
    cta: "Book Consultation",
    href: "/services#vaastu-shastra",
    accent: "#C4845A",
    img: "/vastu.png",
  },
  {
    title: "Poojas & Homas",
    subtitle: "Ancient solutions for modern challenges",
    desc: "When planetary doshas create obstacles, Vedic remedies offer profound solutions. From simple mantras to elaborate homas, the right remedy can shift your trajectory.",
    cta: "Explore Vedic Remedies",
    href: "/services#poojas-homas",
    accent: "#C45A7A",
    img: "/astro.webp",
  },
  {
    title: "Devalaya Pratishta",
    subtitle: "Inviting the divine into your home or temple",
    desc: "The sacred rite of installing and awakening deity presence in a home shrine or temple. Performed with strict agama shastra vidhana, so the murti becomes a true vessel for daily worship and blessings.",
    cta: "Learn About Pratishta",
    href: "/services#deity-installation",
    accent: "#6F8B5A",
    img: "/yantra.webp",
  },
  {
    title: "Gemstone & Rudraksha",
    subtitle: "Stones aligned to your unique chart",
    desc: "Not a generic remedy — a precise prescription based on your birth chart, current dasha, and life situation. Lab-certified gemstones and authentic Rudraksha, energised before delivery.",
    cta: "Explore Gemstone Guidance",
    href: "/services#gems-rudraksha",
    accent: "#5A8B8B",
    img: "/gem.png",
  },
];


// --- VASTU ENGINE CONSTANTS & RULES ---
const VASTU_RULES = {
  main_door: {
    North: { score: 90, status: "positive", note: "Invites prosperity & Kuber energy." },
    East: { score: 100, status: "positive", note: "Most auspicious: brings health, clarity, and vitality." },
    Northeast: { score: 95, status: "positive", note: "Spiritual Ishanya flow brings divine grace." },
    West: { score: 70, status: "neutral", note: "Acceptable with proper energy balancing." },
    Southwest: { score: 30, status: "problem", note: "Avoid: leads to instability and financial leakage." },
    South: { score: 40, status: "problem", note: "Generally avoided: requires specific Vastu remedies." },
    Southeast: { score: 60, status: "neutral", note: "Acceptable, but ensure no conflict with Agni." },
    Northwest: { score: 75, status: "neutral", note: "Workable: favorable for movement and guests." },
  },
  kitchen: {
    Southeast: { score: 100, status: "positive", note: "Ideal Agni (fire) zone; fosters vitality." },
    Northwest: { score: 75, status: "neutral", note: "Second best alternative (Vayu zone)." },
    East: { score: 65, status: "neutral", note: "Acceptable; ensure cooking faces East." },
    South: { score: 50, status: "neutral", note: "Workable with proper fire balancing." },
    North: { score: 30, status: "problem", note: "Avoid: water/wealth zone clashes with fire." },
    Northeast: { score: 20, status: "problem", note: "Severely avoided: blocks spiritual energy." },
    West: { score: 60, status: "neutral", note: "Acceptable with layout adjustments." },
    Southwest: { score: 35, status: "problem", note: "Avoid: causes household stress." },
  },
  bedroom: {
    Southwest: { score: 100, status: "positive", note: "Ideal master suite: stability, grounding, and authority." },
    South: { score: 80, status: "positive", note: "Promotes deep, rejuvenating sleep." },
    West: { score: 75, status: "positive", note: "Suitable for children or family guests." },
    Northwest: { score: 65, status: "neutral", note: "Best for guest rooms or young adults." },
    North: { score: 55, status: "neutral", note: "Acceptable; ensure head does not point North." },
    East: { score: 50, status: "neutral", note: "Better suited for study rooms than master bed." },
    Northeast: { score: 25, status: "problem", note: "Disturbs spiritual tranquility; causes restlessness." },
    Southeast: { score: 35, status: "problem", note: "Fire zone causes tension and sleeplessness." },
  },
  pooja_room: {
    Northeast: { score: 100, status: "positive", note: "Supreme Ishanya sanctuary: maximum positive prana." },
    East: { score: 85, status: "positive", note: "Excellent: facing East during prayer attracts clarity." },
    North: { score: 75, status: "positive", note: "Good alternative when NE is unavailable." },
    West: { score: 50, status: "neutral", note: "Acceptable; keep deities facing East." },
    South: { score: 30, status: "problem", note: "Avoid: disturbs sacred vibrations." },
    Southwest: { score: 25, status: "problem", note: "Heavy Nairutya zone clashes with sattvic energy." },
    Southeast: { score: 35, status: "problem", note: "Agni element clashes with pure contemplation." },
    Northwest: { score: 55, status: "neutral", note: "Workable but requires grounding remedies." },
  },
  toilet: {
    Northwest: { score: 95, status: "positive", note: "Excellent: Vayu zone disposes negativity naturally." },
    West: { score: 80, status: "positive", note: "Good, safe placement." },
    South: { score: 60, status: "neutral", note: "Workable with proper ventilation." },
    Southeast: { score: 50, status: "neutral", note: "Acceptable; avoid sharing kitchen walls." },
    North: { score: 40, status: "problem", note: "Avoid: blocks prosperity and Kuber flow." },
    East: { score: 30, status: "problem", note: "Avoid: blocks morning solar prana." },
    Southwest: { score: 35, status: "problem", note: "Weakens head of household energy." },
    Northeast: { score: 10, status: "problem", note: "CRITICAL: severely drains health and auspiciousness." },
  },
  plot_facing: {
    East: { score: 100, status: "positive", note: "Most auspicious plot orientation." },
    North: { score: 90, status: "positive", note: "Excellent for prosperity and growth." },
    Northeast: { score: 85, status: "positive", note: "Spiritually elevated energy." },
    Northwest: { score: 70, status: "neutral", note: "Favorable for active businesses & travel." },
    West: { score: 65, status: "neutral", note: "Acceptable with internal directional tuning." },
    South: { score: 50, status: "neutral", note: "Manageable with protective Vastu barriers." },
    Southeast: { score: 45, status: "problem", note: "Requires fire yantra remediation." },
    Southwest: { score: 30, status: "problem", note: "Avoid: triggers structural obstacles." },
  }
};

const FIELD_LABELS = {
  main_door: "Main Entrance",
  kitchen: "Kitchen",
  bedroom: "Master Bedroom",
  pooja_room: "Pooja Room",
  toilet: "Primary Toilet",
  plot_facing: "Plot Facing Direction",
};

const RASHI_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const RASHI_NAMES = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];

const LAGNA_LORD_DIRECTIONS = {
  Sun: { fav: "East", unfav: "West", remedy: "Place a copper Surya yantra in the East. Sleep facing East." },
  Moon: { fav: "Northwest", unfav: "Southeast", remedy: "Keep a silver vessel with clean water in Northwest." },
  Mars: { fav: "South", unfav: "North", remedy: "Place red jasper or copper elements in the South. Keep South uncluttered." },
  Mercury: { fav: "North", unfav: "South", remedy: "Keep green plants or study area in the North." },
  Jupiter: { fav: "Northeast", unfav: "Southwest", remedy: "Position sacred study or pooja in Northeast with brass/gold accents." },
  Venus: { fav: "Southeast", unfav: "Northwest", remedy: "Keep aesthetic decor and floral arrangements in Southeast." },
  Saturn: { fav: "West", unfav: "East", remedy: "Place heavy metal/stone elements in the West zone." },
};

// --- PAGE COMPONENTS ---

function CelestialBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 34 }, () => ({
      cx: 10 + Math.random() * 80,
      cy: 8 + Math.random() * 84,
      r: 0.5 + Math.random() * 1.1,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 4,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <svg
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }
        @keyframes ringSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={`${s.cx}%`}
          cy={`${s.cy}%`}
          r={s.r * 1.5}
          fill="#7A5C3A"
          style={{ animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`, transformOrigin: "center" }}
        />
      ))}
      <g style={{ transformOrigin: "680px 80px", animation: "ringSpin 90s linear infinite" }}>
        <circle cx="680" cy="80" r="80" fill="none" stroke="#7A5C3A" strokeWidth="0.7" strokeDasharray="4 6" />
        <circle cx="680" cy="80" r="55" fill="none" stroke="#7A5C3A" strokeWidth="0.5" strokeDasharray="2 4" />
      </g>
      <g style={{ transformOrigin: "100px 380px", animation: "ringSpin 70s linear infinite reverse" }}>
        <circle cx="100" cy="380" r="60" fill="none" stroke="#7A5C3A" strokeWidth="0.7" strokeDasharray="3 5" />
      </g>
      <path d="M640 80 Q680 30 720 80 Q680 130 640 80Z" fill="#7A5C3A" opacity="0.3" />
      <path d="M60 340 Q100 290 140 340 Q100 390 60 340Z" fill="#7A5C3A" opacity="0.2" />
      <text x="370" y="60" textAnchor="middle" fontSize="12" fill="#7A5C3A" opacity="0.5" fontFamily="serif">✦</text>
      <text x="200" y="150" textAnchor="middle" fontSize="8" fill="#7A5C3A" opacity="0.4" fontFamily="serif">✦</text>
      <text x="500" y="200" textAnchor="middle" fontSize="10" fill="#7A5C3A" opacity="0.4" fontFamily="serif">✧</text>
      <text x="580" y="300" textAnchor="middle" fontSize="8" fill="#7A5C3A" opacity="0.35" fontFamily="serif">✦</text>
      <text x="120" y="220" textAnchor="middle" fontSize="10" fill="#7A5C3A" opacity="0.3" fontFamily="serif">✧</text>
    </svg>
  );
}

// Animated count-up used for the stats strip — runs once on mount.
function CountUp({ to, suffix = "", duration = 1400 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let raf;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(ease(progress) * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{value.toLocaleString()}{suffix}</>;
}

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Same parallax/translation math as before — just re-skinned around it ---
  const moonParallaxY = scrollY * 0.45;
  const sunParallaxY  = scrollY * 0.45;
  const moonParallaxX = scrollY * 0.35;
  const sunParallaxX  = scrollY * -0.35;

  const visibilityShift = Math.min(10, scrollY * 0.033);
  const moonMobileY = -60 + visibilityShift;
  const sunMobileY = 60 - visibilityShift;

  const moonRotate = scrollY * 0.06;
  const sunRotate = scrollY * -0.06;

  const gateTiltPos = Math.min(scrollY * 0.08, 85);
  const gateTiltNeg = Math.max(scrollY * -0.08, -85);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #FDF6EC 0%, #F5E8D2 40%, #EDD9B8 100%)",
      overflow: "hidden",
    }}>
      <style>{`
        .hero-gate-wrapper {
          max-width: ${isMobile ? '450px' : '600px'};
        }
        @media (min-width: 900px) and (max-width: 1100px) {
          .hero-gate-wrapper {
            max-width: 420px !important;
          }
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes auroraDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-3%, 4%) scale(1.08); }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scrollCueBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(8px); opacity: 1; }
        }

        .hero-reveal { animation: heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both; }

        .hero-btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          box-shadow: 0 10px 26px rgba(196,132,90,0.35);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(196,132,90,0.45);
          background: #a36e4b !important;
        }
        .hero-btn-secondary {
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .hero-btn-secondary:hover {
          background: rgba(196,132,90,0.1);
          border-color: #C4845A !important;
          transform: translateY(-2px);
        }
      `}</style>

      <CelestialBackground />

      {/* Aurora glow blobs — slow ambient drift, sits behind everything */}
      <div style={{
        position: "absolute", top: "8%", right: "12%", width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,111,168,0.22) 0%, rgba(139,111,168,0) 70%)",
        filter: "blur(10px)", animation: "auroraDrift 14s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "8%", width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(196,132,90,0.22) 0%, rgba(196,132,90,0) 70%)",
        filter: "blur(10px)", animation: "auroraDrift 18s ease-in-out infinite reverse", pointerEvents: "none",
      }} />

      {/* LEFT / TOP GATE (MOON) */}
      <div
        className="hero-gate-wrapper"
        style={{
          position: "absolute", zIndex: 1, width: "100%", willChange: "transform",
          ...(isMobile ? {
            top: 0, left: "50%", transform: `translate(calc(-50% + ${moonParallaxX}px), ${moonMobileY}%) rotate(${moonRotate}deg)`,
          } : {
            left: 0, top: "50%", transform: `translate(-40%, calc(-50% + ${moonParallaxY}px))`,
          })
        }}
      >
        {/* Orbit ring — subtle, continuously rotating, purely decorative */}
        <div style={{
          position: "absolute", inset: "8%", border: "1px dashed rgba(139,111,168,0.35)", borderRadius: "50%",
          animation: "orbitSpin 50s linear infinite", pointerEvents: "none",
        }} />
        <Image src="/hero-moon.webp" alt="Moon" width={600} height={600} priority
          style={{
            width: "100%", height: "auto",
            filter: "drop-shadow(0 0 24px rgba(139, 111, 168, 0.25))",
            transformOrigin: isMobile ? "top center" : "left center",
            transform: `perspective(1200px) ${isMobile ? `rotateX(${gateTiltPos}deg)` : `rotateY(${gateTiltPos}deg)`}`,
            transition: "transform 0.1s ease-out"
          }}
        />
      </div>

      {/* RIGHT / BOTTOM GATE (SUN) */}
      <div
        className="hero-gate-wrapper"
        style={{
          position: "absolute", zIndex: 1, width: "100%", willChange: "transform",
          ...(isMobile ? {
            bottom: 0, left: "50%", transform: `translate(calc(-50% + ${sunParallaxX}px), ${sunMobileY}%) rotate(${sunRotate}deg)`,
          } : {
            right: 0, top: "50%", transform: `translate(30%, calc(-50% + ${sunParallaxY}px))`,
          })
        }}
      >
        <div style={{
          position: "absolute", inset: "8%", border: "1px dashed rgba(196,132,90,0.35)", borderRadius: "50%",
          animation: "orbitSpin 65s linear infinite reverse", pointerEvents: "none",
        }} />
        <Image src="/hero-sun.webp" alt="Sun" width={600} height={600} priority
          style={{
            width: "100%", height: "auto",
            filter: "drop-shadow(0 0 24px rgba(196, 132, 90, 0.25))",
            transformOrigin: isMobile ? "bottom center" : "right center",
            transform: `perspective(1200px) ${isMobile ? `rotateX(${gateTiltNeg}deg)` : `rotateY(${gateTiltNeg}deg)`}`,
            transition: "transform 0.1s ease-out"
          }}
        />
      </div>

      {isMobile && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)",
          background: "rgba(253, 246, 236, 0.4)", pointerEvents: "none",
        }} />
      )}

      {/* Hero Content Wrapper */}
      <div style={{
        maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", width: "100%",
        zIndex: 3,
        paddingTop: isMobile ? 110 : 80,
        paddingBottom: isMobile ? 60 : 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
      }}>
        {/* Badge — replaces the plain dashed eyebrow with a bordered pill */}
        <div className="hero-reveal" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(253,246,236,0.7)", border: "1px solid rgba(196,132,90,0.35)",
          borderRadius: 999, padding: isMobile ? "6px 14px" : "7px 18px",
          marginBottom: isMobile ? 20 : 24, backdropFilter: "blur(4px)",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#C4845A",
            animation: "twinkle 1.8s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 12 : 13, color: "#8B5A2B", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>
            Vedic Jyotish · 20 Years of Practice
          </span>
        </div>

        <h1 className="hero-reveal" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.6rem, 9vw, 4rem)",
          fontWeight: 400, color: "#2C1205", lineHeight: 1.12, margin: "0 0 1.25rem",
          animationDelay: "0.08s",
        }}>
          Find peace of mind,<br />
          <span style={{ fontStyle: "italic", color: "#C4845A" }}>know yourself</span> better
        </h1>

        <p className="hero-reveal" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 17 : 19, color: "#6B4423",
          lineHeight: 1.6, margin: "0 0 2rem", maxWidth: 500, animationDelay: "0.16s",
        }}>
          Rooted in two decades of Vedic tradition, we reveal the cosmic blueprint written at the moment of your birth.
        </p>

        <div className="hero-reveal" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem", alignItems: "center", justifyContent: "center", width: "100%", animationDelay: "0.24s" }}>
          <Link href="/contact" style={{ width: isMobile ? "100%" : "auto", textDecoration: "none" }}>
            <button className="hero-btn-primary" style={{
              width: "100%", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600,
              background: "#C4845A", color: "#FDF6EC", border: "none", padding: "14px 32px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
            }}>Book Consultation</button>
          </Link>
          <Link href="/services" style={{ width: isMobile ? "100%" : "auto", textDecoration: "none" }}>
            <button className="hero-btn-secondary" style={{
              width: "100%", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17,
              background: "transparent", color: "#C4845A", border: "1.5px solid rgba(196,132,90,0.5)", padding: "13px 28px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
            }}>View Services</button>
          </Link>
        </div>

        {/* Stats strip — now a bordered glass card with animated count-up */}
        <div className="hero-reveal" style={{
          display: "flex", flexWrap: "wrap", gap: isMobile ? "1.75rem" : 0, marginTop: "3rem",
          justifyContent: "center", width: isMobile ? "100%" : "auto",
          background: isMobile ? "transparent" : "rgba(253,246,236,0.6)",
          border: isMobile ? "none" : "1px solid rgba(196,132,90,0.2)",
          borderRadius: isMobile ? 0 : 8,
          padding: isMobile ? 0 : "1.25rem 2.5rem",
          backdropFilter: isMobile ? "none" : "blur(6px)",
          animationDelay: "0.32s",
        }}>
          {[
            { num: 50000, suffix: "+", label: "Consultations" },
            { num: 98, suffix: "%", label: "Accuracy Rate" },
            { num: 20, suffix: "+", label: "Years Experience" },
          ].map((stat, idx) => (
            <div key={stat.label} style={{
              minWidth: isMobile ? "120px" : "auto",
              padding: isMobile ? 0 : "0 2rem",
              borderLeft: !isMobile && idx > 0 ? "1px solid rgba(196,132,90,0.25)" : "none",
            }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 28 : 30, fontWeight: 700, color: "#C4845A", marginBottom: 4 }}>
                <CountUp to={stat.num} suffix={stat.suffix} />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423", letterSpacing: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      {!isMobile && (
        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 3, animation: "scrollCueBounce 2s ease-in-out infinite", pointerEvents: "none",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}
    </section>
  );
}

function ServicesSection() {
  const [active, setActive] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleEnter = (i) => { if (!isMobile) setActive(i); };
  const handleLeave = ()  => { if (!isMobile) setActive(null); };
  const handleClick = (i) => { if (isMobile) setActive(prev => prev === i ? null : i); };

  const PANEL_H = 400;

  return (
    <section style={{ background: "#FDF6EC", padding: "6rem 0" }}>
      <style>{`
        .svc-panel {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-color: #F5E8D2;
          transition: flex 0.65s cubic-bezier(0.77,0,0.18,1), height 0.65s cubic-bezier(0.77,0,0.18,1), background-color 0.65s ease;
        }
        .svc-panel.active { background-color: #EDD9B8; }
        
        .svc-img {
          position: absolute; left: 50%; top: 0; width: 320px; height: auto;
          transform: translate(-50%, -45%); opacity: 0.8; mix-blend-mode: multiply; 
          transition: top 0.65s cubic-bezier(0.77,0,0.18,1), opacity 0.65s ease;
          pointer-events: none;
        }
        
        .svc-panel.active .svc-img { 
          top: 50%; 
          opacity: 0.12; 
          animation: spinTilt 18s linear infinite; 
        }
        
        @keyframes spinTilt {
          0% { transform: translate(-50%, -50%) scale(1.2) perspective(800px) rotateX(40deg) rotateZ(0deg); }
          100% { transform: translate(-50%, -50%) scale(1.2) perspective(800px) rotateX(40deg) rotateZ(360deg); }
        }

        .svc-content {
          position: absolute; bottom: 0; left: 0; right: 0; 
          padding: 2.5rem 1.5rem 1.5rem; 
          z-index: 2;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          transform: translateY(20px); 
          transition: transform 0.65s cubic-bezier(0.77,0,0.18,1), background 0.65s ease, padding 0.3s ease;
        }

        /* REMOVE PADDING UP TO 400px */
        @media (max-width: 400px) {
          .svc-content {
            padding: 0 !important;
          }
        }
        
        .svc-panel.active .svc-content { 
          transform: translateY(0); 
          background: linear-gradient(to top, rgba(237,217,184,0.95) 0%, rgba(237,217,184,0.7) 60%, transparent 100%);
        }

        .svc-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          color: #2C1205;
          margin: 0;
          transition: color 0.5s ease, transform 0.5s ease, font-size 0.5s ease;
        }

        .svc-panel.active .svc-title {
          color: #C4845A;
          transform: scale(1.05);
        }

        @media (min-width: 900px) {
          .svc-title { font-size: 26px; }
          .svc-panel.active .svc-title { font-size: 34px; }
        }

        .svc-desc { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.65s cubic-bezier(0.77,0,0.18,1), opacity 0.45s ease; }
        .svc-panel.active .svc-desc { max-height: 200px; opacity: 1; }
        .svc-cta {
          opacity: 0; transform: translateY(8px); transition: opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s;
          display: inline-block; margin-top: 1.5rem;
        }
        .svc-panel.active .svc-cta { opacity: 1; transform: translateY(0); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 1.25rem" : "0 3rem" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "2.5rem" : "4rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Our Services
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Sacred Services for Modern Lives
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 16 : 18, color: "#6B4423", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Twenty years of Vedic practice, distilled into focused consultations and ceremonies that meet you where you are — and guide you toward where you're meant to be.
          </p>
        </div>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SERVICES_WITH_IMG.map((svc, i) => {
              const isActive = active === i;
              return (
                <div key={svc.title} className={`svc-panel${isActive ? " active" : ""}`} onClick={() => handleClick(i)} style={{ height: isActive ? 460 : 260, borderRadius: 4 }}>
                  <Image src={svc.img} alt={svc.title} width={320} height={320} className="svc-img" />
                  <div className="svc-content">
                    <h3 className="svc-title">{svc.title}</h3>
                    <div className="svc-desc"><p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: "#6B4423", lineHeight: 1.6, margin: "1rem 0 0" }}>{svc.desc}</p></div>
                    <Link href={svc.href} onClick={(e) => e.stopPropagation()} className="svc-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#2C1205", textDecoration: "none", borderBottom: `1px solid rgba(44,18,5,0.3)`, paddingBottom: 4 }}>{svc.cta}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", height: PANEL_H, gap: 12, borderRadius: 4, overflow: "hidden" }}>
            {SERVICES_WITH_IMG.map((svc, i) => {
              const isActive = active === i;
              const flexValue = active === null ? 1 : isActive ? 2 : 0.5;
              return (
                <div key={svc.title} className={`svc-panel${isActive ? " active" : ""}`} onMouseEnter={() => handleEnter(i)} onMouseLeave={handleLeave} style={{ flex: flexValue, borderRadius: 4, minWidth: 0 }}>
                  <Image height={600} width={600} src={svc.img} alt={svc.title} className="svc-img" />
                  <div className="svc-content">
                    <h3 className="svc-title">{svc.title}</h3>
                    <div className="svc-desc"><p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: "#6B4423", lineHeight: 1.6, margin: "1rem 0 0" }}>{svc.desc}</p></div>
                    <Link href={svc.href} className="svc-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#2C1205", textDecoration: "none", borderBottom: `1px solid rgba(44,18,5,0.3)`, paddingBottom: 4 }}>{svc.cta}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// --- VASTU & ASTRO-VASTU COMPONENT ---
function VastuCheckerSection() {
  const [mode, setMode] = useState("basic"); // 'basic' | 'astro'
  const [isMobile, setIsMobile] = useState(false);

  // Form states
  const [directions, setDirections] = useState({
    main_door: "",
    kitchen: "",
    bedroom: "",
    pooja_room: "",
    toilet: "",
    plot_facing: "",
  });

  const [astroForm, setAstroForm] = useState({
    lagnaRashi: "1", // 1 to 12
    nakshatraDirection: "East",
    dashaLord: "Jupiter"
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDirChange = (field, value) => {
    setDirections(prev => ({ ...prev, [field]: value }));
  };

  const calculateVastu = () => {
    const fields = Object.keys(directions);
    const selectedFields = fields.filter(f => directions[f]);

    if (selectedFields.length === 0) {
      alert("Please select at least one direction to analyze.");
      return;
    }

    let totalDirScore = 0;
    const positives = [];
    const problems = [];
    const neutrals = [];

    selectedFields.forEach(f => {
      const dir = directions[f];
      const rule = VASTU_RULES[f][dir];
      if (rule) {
        totalDirScore += rule.score;
        const item = { label: `${FIELD_LABELS[f]} (${dir})`, note: rule.note };
        if (rule.status === "positive") positives.push(item);
        else if (rule.status === "problem") problems.push(item);
        else neutrals.push(item);
      }
    });

    const directionalScore = Math.round(totalDirScore / selectedFields.length);

    if (mode === "basic") {
      setResult({
        type: "basic",
        score: directionalScore,
        positives,
        problems,
        neutrals,
      });
    } else {
      // ASTRO-VASTU CALCULATION
      const lagnaIdx = parseInt(astroForm.lagnaRashi) - 1;
      const lagnaLord = RASHI_LORDS[lagnaIdx];
      const lordPrefs = LAGNA_LORD_DIRECTIONS[lagnaLord] || LAGNA_LORD_DIRECTIONS["Sun"];
      const dashaPrefs = LAGNA_LORD_DIRECTIONS[astroForm.dashaLord];

      const supports = [];
      const conflicts = [];

      if (directions.main_door) {
        if (directions.main_door === lordPrefs.fav) {
          supports.push({
            label: `Main Entrance in ${directions.main_door}`,
            note: `Strongly aligns with your Lagna Lord (${lagnaLord}), unlocking unobstructed prosperity flow.`
          });
        } else if (directions.main_door === lordPrefs.unfav) {
          conflicts.push({
            label: `Main Entrance in ${directions.main_door}`,
            note: `Conflicts with Lagna Lord (${lagnaLord}). ${lordPrefs.remedy}`
          });
        }
      }

      if (directions.pooja_room) {
        if (directions.pooja_room === "Northeast") {
          supports.push({
            label: `Pooja Room in Northeast`,
            note: `Supreme Ishanya placement amplifies Jupiter's sattvic wisdom in your life.`
          });
        } else if (directions.pooja_room === "Southwest") {
          conflicts.push({
            label: `Pooja Room in Southwest`,
            note: `Heavy Nairutya zone drains divine vibrations. Relocate altar to NE or East.`
          });
        }
      }

      if (directions.bedroom && directions.bedroom === astroForm.nakshatraDirection) {
        supports.push({
          label: `Master Bedroom in ${directions.bedroom}`,
          note: `Harmonizes directly with your Janma Nakshatra Dik for peace of mind and revitalizing rest.`
        });
      }

      let chartScore = 50 + (supports.length * 15) - (conflicts.length * 15);
      chartScore = Math.max(20, Math.min(98, chartScore));

      const combinedScore = Math.round((directionalScore + chartScore) / 2);

      setResult({
        type: "astro",
        score: combinedScore,
        directionalScore,
        chartScore,
        lagnaLord,
        lordPrefs,
        dashaLord: astroForm.dashaLord,
        dashaPrefs,
        supports,
        conflicts,
        positives,
        problems,
        neutrals,
      });
    }
  };

  const getScoreMeta = (score) => {
    if (score >= 75) return { label: "Harmonious Cosmic Alignment", color: "#2ecc71" };
    if (score >= 50) return { label: "Moderate — Remedial Tuning Advised", color: "#f0c849" };
    return { label: "Significant Energetic Friction", color: "#ff6b6b" };
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
    background: "#F9F0E2", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 2,
    color: "#2C1205", outline: "none", boxSizing: "border-box", marginBottom: "1rem"
  };

  const labelStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423", 
    letterSpacing: 1, display: "block", marginBottom: 4, fontWeight: 600
  };

  return (
    <section id="vastu" style={{ background: "#FDF6EC", padding: "6rem 1.5rem", borderTop: "1px solid rgba(196,132,90,0.15)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Vastu & Astro-Vastu Diagnostic
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Align Your Space with Cosmic Geometry
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
            Every home is an energetic vessel. Discover whether your home structure uplifts your household prosperity or clashes with your birth chart.
          </p>

          {/* Mode Switch Tabs */}
          <div style={{ display: "inline-flex", background: "rgba(196,132,90,0.12)", padding: 4, borderRadius: 30, marginTop: "2rem" }}>
            <button
              onClick={() => { setMode("basic"); setResult(null); }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, padding: "8px 24px",
                borderRadius: 25, border: "none", cursor: "pointer", transition: "all 0.3s ease",
                background: mode === "basic" ? "#C4845A" : "transparent",
                color: mode === "basic" ? "#FDF6EC" : "#6B4423"
              }}
            >
              General Vastu Check
            </button>
            <button
              onClick={() => { setMode("astro"); setResult(null); }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, padding: "8px 24px",
                borderRadius: 25, border: "none", cursor: "pointer", transition: "all 0.3s ease",
                background: mode === "astro" ? "#C4845A" : "transparent",
                color: mode === "astro" ? "#FDF6EC" : "#6B4423"
              }}
            >
              Personalized Astro-Vastu ✦
            </button>
          </div>
        </div>

        {/* Dynamic Container */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : result ? "1fr 1.1fr" : "1fr", gap: "2.5rem", alignItems: "start" }}>
          
          {/* Input Configuration Box */}
          <div style={{ background: "#F5E8D2", padding: isMobile ? "1.5rem" : "2.5rem", borderRadius: 4, border: "1px solid rgba(196,132,90,0.2)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#2C1205", marginBottom: "1.5rem", fontStyle: "italic" }}>
              {mode === "basic" ? "Enter Your Layout Directions" : "Birth Chart & Directional Calibration"}
            </h3>

            {/* Direction Selectors */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              {Object.keys(FIELD_LABELS).map(key => (
                <div key={key}>
                  <label style={labelStyle}>{FIELD_LABELS[key]}</label>
                  <select
                    value={directions[key]}
                    onChange={(e) => handleDirChange(key, e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">-- Select Direction --</option>
                    <option value="North">North (Kuber Zone)</option>
                    <option value="Northeast">Northeast (Ishanya)</option>
                    <option value="East">East (Indra/Surya)</option>
                    <option value="Southeast">Southeast (Agneya)</option>
                    <option value="South">South (Yama Zone)</option>
                    <option value="Southwest">Southwest (Nairutya)</option>
                    <option value="West">West (Varuna Zone)</option>
                    <option value="Northwest">Northwest (Vayu Zone)</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Astro-Vastu Personalized Fields */}
            {mode === "astro" && (
              <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px dashed rgba(196,132,90,0.3)" }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#C4845A", marginBottom: "1rem" }}>
                  ✦ Astrological Calibration Details
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Your Lagna (Ascendant Sign)</label>
                    <select
                      value={astroForm.lagnaRashi}
                      onChange={(e) => setAstroForm({ ...astroForm, lagnaRashi: e.target.value })}
                      style={inputStyle}
                    >
                      {RASHI_NAMES.map((r, i) => (
                        <option key={r} value={i + 1}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Nakshatra Dik (Entry/Sleep Axis)</label>
                    <select
                      value={astroForm.nakshatraDirection}
                      onChange={(e) => setAstroForm({ ...astroForm, nakshatraDirection: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="East">East Zone</option>
                      <option value="North">North Zone</option>
                      <option value="West">West Zone</option>
                      <option value="South">South Zone</option>
                      <option value="Northeast">Northeast Zone</option>
                      <option value="Southwest">Southwest Zone</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                    <label style={labelStyle}>Current Mahadasha Lord</label>
                    <select
                      value={astroForm.dashaLord}
                      onChange={(e) => setAstroForm({ ...astroForm, dashaLord: e.target.value })}
                      style={inputStyle}
                    >
                      {Object.keys(LAGNA_LORD_DIRECTIONS).map(p => (
                        <option key={p} value={p}>{p} Mahadasha</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={calculateVastu}
              style={{
                width: "100%", marginTop: "1rem", fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 17, fontWeight: 600, background: "#C4845A", color: "#FDF6EC",
                border: "none", padding: "14px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
                transition: "background 0.3s ease"
              }}
            >
              {mode === "basic" ? "Calculate Vastu Harmony Score →" : "Generate Astro-Vastu Diagnostic →"}
            </button>
          </div>

          {/* Results Output Screen */}
          {result && (
            <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 4, padding: isMobile ? "1.5rem" : "2.5rem", boxShadow: "0 10px 25px rgba(196,132,90,0.08)" }}>
              
              {/* Radial Meter */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 1rem" }}>
                  <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(196,132,90,0.15)" strokeWidth="8"/>
                    <circle
                      cx="70" cy="70" r="58" fill="none"
                      stroke={getScoreMeta(result.score).color} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 58}
                      strokeDashoffset={(2 * Math.PI * 58) - ((2 * Math.PI * 58) * result.score / 100)}
                      style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 700, color: "#2C1205", lineHeight: 1 }}>{result.score}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423" }}>/ 100</div>
                  </div>
                </div>

                <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: getScoreMeta(result.score).color, fontStyle: "italic", margin: "0 0 6px" }}>
                  {getScoreMeta(result.score).label}
                </h4>
                {result.type === "astro" && (
                  <p style={{ fontSize: 13, color: "#6B4423", margin: 0 }}>
                    Spatial Vastu: <strong>{result.directionalScore}/100</strong> · Chart Synchronization: <strong>{result.chartScore}/100</strong>
                  </p>
                )}
              </div>

              {/* Astro-Vastu Chart Insights */}
              {result.type === "astro" && (
                <div style={{ marginBottom: "1.5rem", background: "rgba(196,132,90,0.06)", padding: "1rem", borderRadius: 4 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Lagna & Dasha Insights</div>
                  <p style={{ fontSize: 14, color: "#2C1205", margin: "0 0 6px", lineHeight: 1.5 }}>
                    • Your Lagna Lord is <strong>{result.lagnaLord}</strong> (Favors: <strong>{result.lordPrefs.fav}</strong>, Restricts: <strong>{result.lordPrefs.unfav}</strong>).
                  </p>
                  <p style={{ fontSize: 14, color: "#2C1205", margin: 0, lineHeight: 1.5 }}>
                    • Under <strong>{result.dashaLord} Mahadasha</strong>: {result.dashaPrefs.remedy}
                  </p>
                </div>
              )}

              {/* Positive Alignments */}
              {((result.supports && result.supports.length > 0) || result.positives.length > 0) && (
                <div style={{ marginBottom: "1.2rem" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: "#2ecc71", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
                    ✓ Favorable Alignments
                  </div>
                  {(result.supports || []).concat(result.positives).map((item, idx) => (
                    <div key={idx} style={{ fontSize: 14, color: "#2C1205", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #2ecc71" }}>
                      <strong>{item.label}:</strong> {item.note}
                    </div>
                  ))}
                </div>
              )}

              {/* Problem Zones & Remedies */}
              {((result.conflicts && result.conflicts.length > 0) || result.problems.length > 0) && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: "#ff6b6b", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
                    ⚠ Remedial Interventions Needed
                  </div>
                  {(result.conflicts || []).concat(result.problems).map((item, idx) => (
                    <div key={idx} style={{ fontSize: 14, color: "#2C1205", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #ff6b6b" }}>
                      <strong>{item.label}:</strong> {item.note}
                    </div>
                  ))}
                </div>
              )}

              {/* WhatsApp Consultation Link */}
              <a
                href={`https://wa.me/91918499881447?text=${encodeURIComponent(
                  `Namaste, I checked my ${result.type === "astro" ? "Astro-Vastu" : "Vastu"} score on your site (${result.score}/100) and would like to book a personalized Vedic correction consultation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", textAlign: "center", background: "#2C1205", color: "#FDF6EC",
                  fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600,
                  padding: "12px", borderRadius: 2, textDecoration: "none", letterSpacing: 1, marginTop: "1rem"
                }}
              >
                Consult Guruji on WhatsApp for Remedy Plan →
              </a>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

function KundaliMatchingCTA() {
  const [partner1, setPartner1] = useState({ name: "", dob: "", time: "", place: "" });
  const [partner2, setPartner2] = useState({ name: "", dob: "", time: "", place: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGenerateMatch = async () => {
    if (!partner1.dob || !partner2.dob) {
      alert("Please enter the Date of Birth for both partners.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ p1: partner1, p2: partner2 })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        alert("Could not generate match. Please check your inputs.");
      }
    } catch (error) {
      console.error("Error fetching match:", error);
      alert("A cosmic interference occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15,
    background: "#F9F0E2", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 2,
    color: "#2C1205", outline: "none", boxSizing: "border-box", marginBottom: "1rem"
  };

  const labelStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, color: "#6B4423", 
    letterSpacing: 1, display: "block", marginBottom: 4 
  };

  return (
    <section style={{ background: "#FDF6EC", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* === STATE 1: THE INPUT FORM === */}
        {!result && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "3rem" : "5rem", alignItems: "center" }}>
            <div style={{ textAlign: isMobile ? "center" : "left" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Kundali Milan</div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
                Check Your Compatibility
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", lineHeight: 1.7, margin: isMobile ? "0 auto 2rem" : "0 0 2rem", maxWidth: 500 }}>
                Will the stars align? Enter birth details for both partners to receive a 36-Guna matching report revealing the cosmic harmony between two souls before marriage.
              </p>
              
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1.5rem", maxWidth: 500, margin: isMobile ? "0 auto" : "0", textAlign: "left" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#C4845A", marginBottom: "1rem" }}>Partner 1</h4>
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder="Name" value={partner1.name} onChange={e => setPartner1({...partner1, name: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Date of Birth</label>
                  <input type="date" value={partner1.dob} onChange={e => setPartner1({...partner1, dob: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Time of Birth</label>
                  <input type="time" value={partner1.time} onChange={e => setPartner1({...partner1, time: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Place of Birth</label>
                  <input type="text" placeholder="e.g. Hyderabad" value={partner1.place} onChange={e => setPartner1({...partner1, place: e.target.value})} style={inputStyle} />
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#C4845A", marginBottom: "1rem" }}>Partner 2</h4>
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder="Name" value={partner2.name} onChange={e => setPartner2({...partner2, name: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Date of Birth</label>
                  <input type="date" value={partner2.dob} onChange={e => setPartner2({...partner2, dob: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Time of Birth</label>
                  <input type="time" value={partner2.time} onChange={e => setPartner2({...partner2, time: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Place of Birth</label>
                  <input type="text" placeholder="e.g. Delhi" value={partner2.place} onChange={e => setPartner2({...partner2, place: e.target.value})} style={inputStyle} />
                </div>
              </div>
              
              <button 
                onClick={handleGenerateMatch}
                disabled={isLoading}
                style={{
                  marginTop: 16, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600,
                  background: isLoading ? "#a36e4b" : "#C4845A", color: "#FDF6EC", border: "none", padding: "14px 24px", borderRadius: 2, 
                  cursor: isLoading ? "wait" : "pointer", letterSpacing: 1, width: isMobile ? "100%" : "auto", transition: "all 0.3s ease"
              }}>
                {isLoading ? "Consulting the Stars..." : "Generate Match Report"}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 360, height: "auto", opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s ease" }}>
                <rect x="10" y="10" width="300" height="300" fill="none" stroke="#C4845A" strokeWidth="1" opacity="0.5"/>
                <rect x="110" y="10" width="100" height="100" fill="rgba(196,132,90,0.06)" stroke="#C4845A" strokeWidth="0.8" opacity="0.6"/>
                <rect x="110" y="110" width="100" height="100" fill="rgba(196,132,90,0.1)" stroke="#C4845A" strokeWidth="0.8" opacity="0.6"/>
                <rect x="110" y="210" width="100" height="100" fill="rgba(196,132,90,0.06)" stroke="#C4845A" strokeWidth="0.8" opacity="0.6"/>
                <rect x="10" y="110" width="100" height="100" fill="rgba(196,132,90,0.06)" stroke="#C4845A" strokeWidth="0.8" opacity="0.6"/>
                <rect x="210" y="110" width="100" height="100" fill="rgba(196,132,90,0.06)" stroke="#C4845A" strokeWidth="0.8" opacity="0.6"/>
                <line x1="10" y1="10" x2="110" y2="110" stroke="#C4845A" strokeWidth="0.6" opacity="0.5"/>
                <line x1="210" y1="10" x2="310" y2="110" stroke="#C4845A" strokeWidth="0.6" opacity="0.5"/>
                <line x1="10" y1="210" x2="110" y2="310" stroke="#C4845A" strokeWidth="0.6" opacity="0.5"/>
                <line x1="210" y1="210" x2="310" y2="310" stroke="#C4845A" strokeWidth="0.6" opacity="0.5"/>
                <text x="160" y="172" textAnchor="middle" fontSize="22" fill="#C4845A" opacity="0.3" fontFamily="serif">ॐ</text>
              </svg>
            </div>
          </div>
        )}

        {/* === STATE 2: THE RESULT DASHBOARD === */}
        {result && (
          <div style={{ 
            animation: "fadeIn 0.6s ease", background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.3)", 
            borderRadius: 4, padding: isMobile ? "2rem 1rem" : "4rem", maxWidth: 800, margin: "0 auto", textAlign: "center" 
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
              Compatibility Report
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginBottom: "3rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: "#2C1205" }}>{result.partner1.name}</div>
              </div>
              <div style={{ fontSize: 32, color: "#C4845A", opacity: 0.5 }}>⚭</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: "#2C1205" }}>{result.partner2.name}</div>
              </div>
            </div>

            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 1.5rem" }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(196,132,90,0.15)" strokeWidth="8"/>
                <circle cx="80" cy="80" r="70" fill="none" stroke={result.verdictColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70} 
                  strokeDashoffset={(2 * Math.PI * 70) - ((2 * Math.PI * 70) * result.total / 36)}
                  style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 48, fontWeight: 700, color: "#2C1205", lineHeight: 1 }}>{result.total}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: "#6B4423" }}>out of 36</div>
              </div>
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 28, color: result.verdictColor, marginBottom: "3rem" }}>
              {result.verdict}
            </h3>

            <div style={{ textAlign: "left", marginBottom: "3rem" }}>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2C1205", marginBottom: "1.5rem", borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "0.5rem" }}>
                Ashtakoot Guna Milan Details
              </h4>
              {Object.entries(result.koots).map(([kootName, kootData]) => {
                const percentage = (kootData.points / kootData.max) * 100;
                const barColor = percentage >= 75 ? '#2ecc71' : percentage >= 50 ? '#f0c849' : '#ff6b6b';
                
                return (
                  <div key={kootName} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16 }}>
                      <span style={{ color: "#2C1205", fontWeight: 600 }}>{kootName}</span>
                      <span style={{ color: barColor, fontWeight: 600 }}>{kootData.points} / {kootData.max}</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(196,132,90,0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${percentage}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width 1s ease-out" }} />
                    </div>
                    <div style={{ fontSize: 13, color: "#6B4423", marginTop: 4, fontStyle: "italic" }}>{kootData.note}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: "rgba(196,132,90,0.05)", padding: "1.5rem", borderRadius: 4, textAlign: "left", marginBottom: "2rem" }}>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#2C1205", marginBottom: "1rem" }}>Mangal Dosha Status</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#C4845A" }}>{result.partner1.name}</div>
                  <div style={{ fontSize: 15, color: result.partner1.mangal.hasDosha ? "#e67e22" : "#2ecc71" }}>
                    {result.partner1.mangal.hasDosha ? result.partner1.mangal.severity : 'No Mangal Dosha'}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#C4845A" }}>{result.partner2.name}</div>
                  <div style={{ fontSize: 15, color: result.partner2.mangal.hasDosha ? "#e67e22" : "#2ecc71" }}>
                    {result.partner2.mangal.hasDosha ? result.partner2.mangal.severity : 'No Mangal Dosha'}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={resetForm}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
                background: "transparent", color: "#C4845A", border: "1px solid #C4845A", padding: "10px 24px", borderRadius: 2, cursor: "pointer"
            }}>
              Check Another Match
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function PanchangSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [panchangData, setPanchangData] = useState(() => {
    try {
      return getDailyPanchang(new Date(), 17.385, 78.4867, 5.5);
    } catch {
      return null;
    }
  });
  
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    try {
      const data = getDailyPanchang(currentDate, 17.385, 78.4867, 5.5); 
      setPanchangData(data);
    } catch (e) {
      console.error("Failed to load panchang", e);
    }
  }, [currentDate]);

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const getShortDate = (daysOffset) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const gridItems = panchangData ? [
    { label: "Tithi", value: panchangData.tithi, icon: <path d="M21 12.8 A9 9 0 1 1 11.2 3 a7 7 0 0 0 9.8 9.8 z"/> },
    { label: "Nakshatra", value: panchangData.nakshatra, icon: <path d="M12 2 L14.5 9 L22 9.5 L16 14.5 L18 22 L12 18 L6 22 L8 14.5 L2 9.5 L9.5 9 Z"/> },
    { label: "Rahukalam", value: panchangData.rahukalam, icon: <path d="M12 2 L20 6 V12 c0 5 -3.5 8.5 -8 10 -4.5 -1.5 -8 -5 -8 -10 V6 z"/> },
    { label: "Yamagandam", value: panchangData.yamagandam, icon: <path d="M12 2 L20 6 V12 c0 5 -3.5 8.5 -8 10 -4.5 -1.5 -8 -5 -8 -10 V6 z"/> },
    { label: "Gulika Kalam", value: panchangData.gulika, icon: <path d="M12 2 L20 6 V12 c0 5 -3.5 8.5 -8 10 -4.5 -1.5 -8 -5 -8 -10 V6 z"/> },
    { label: "Sunrise", value: panchangData.sunrise, icon: <><circle cx="12" cy="12" r="4"/><path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M5 5 L7 7 M17 17 L19 19 M19 5 L17 7 M5 19 L7 17"/></> },
    { label: "Sunset", value: panchangData.sunset, icon: <path d="M21 12.8 A9 9 0 1 1 11.2 3 a7 7 0 0 0 9.8 9.8 z"/> },
    { label: "Abhijit Muhurat", value: panchangData.abhijit, icon: <><circle cx="12" cy="12" r="9"/><path d="M12 7 V12 L15 14"/></> }
  ] : [];

  const currentMonthName = currentDate.toLocaleDateString('en-IN', { month: 'long' });

  return (
    <section style={{ background: "#F5E8D2", padding: "6rem 1.5rem", transition: "all 0.4s ease" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Today's Cosmic Timing
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Daily Panchang
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            The five limbs of Vedic time-keeping. Plan auspicious activities, avoid challenging hours, and align with the cosmic rhythm.
          </p>
          
          {/* === DATE NAVIGATION CONTROLS === */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "stretch", 
            gap: isMobile ? "0.5rem" : "1rem", 
            marginBottom: "1.5rem" 
          }}>
            
            <button 
              onClick={() => changeDate(-1)}
              style={{
                background: "transparent", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 4,
                color: "#C4845A", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 14 : 16,
                padding: isMobile ? "0 10px" : "0 20px", cursor: "pointer", transition: "all 0.3s ease",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              <span>←</span> {!isMobile && getShortDate(-1)}
            </button>

            <div style={{ 
              background: "rgba(196,132,90,0.1)", border: "1px solid rgba(196,132,90,0.3)", 
              padding: isMobile ? "10px 16px" : "10px 24px", borderRadius: 4, minWidth: isMobile ? "auto" : "280px" 
            }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 18 : 20, color: "#2C1205", fontWeight: 600 }}>
                {panchangData?.dateStr || "Loading..."}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, color: "#C4845A", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
                Vedic Almanac
              </div>
            </div>

            <button 
              onClick={() => changeDate(1)}
              style={{
                background: "transparent", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 4,
                color: "#C4845A", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 14 : 16,
                padding: isMobile ? "0 10px" : "0 20px", cursor: "pointer", transition: "all 0.3s ease",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              {!isMobile && getShortDate(1)} <span>→</span>
            </button>
          </div>

          <Link 
            href="/calendar"
            style={{ 
              background: "none", border: "none", color: "#C4845A", 
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, 
              fontStyle: "italic", cursor: "pointer", borderBottom: "1px dashed rgba(196,132,90,0.5)",
              paddingBottom: 2, transition: "color 0.3s ease", textDecoration: "none"
            }}
          >
            View full {currentMonthName} Panchang →
          </Link>
        </div>

        {/* Bento Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
          gap: "1rem",
          marginBottom: showCalendar ? "3rem" : "0",
          transition: "margin 0.4s ease"
        }}>
          {gridItems.map((item, index) => (
            <div 
              key={index} 
              style={{
                background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", borderRadius: 4, 
                padding: "1.2rem 0.7rem", display: "flex", flexDirection: "column", alignItems: "center", 
                textAlign: "center", transition: "transform 0.3s ease, boxShadow 0.3s ease", cursor: "default"
              }}
            >
              <div style={{ color: "#C4845A", width: 24, height: 24, marginBottom: "1rem" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {item.icon}
                </svg>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: "#8B6240", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 15 : 17, color: "#2C1205", fontWeight: 600 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Expanding Monthly Calendar */}
        <div style={{ 
          maxHeight: showCalendar ? "2000px" : "0", 
          overflow: "hidden", 
          opacity: showCalendar ? 1 : 0,
          transition: "max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease",
        }}>
          <div style={{ borderTop: "1px solid rgba(196,132,90,0.2)", paddingTop: "3rem" }}>
             <HinduCalendar />
          </div>
        </div>

      </div>
    </section>
  );
}

// --- MAIN APPLICATION SHELL ---

export default function App() {
  return (
    <div>      
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <VastuCheckerSection />
      <PanchangSection />
      <KundaliMatchingCTA />
      <Footer />
    </div>
  );
}