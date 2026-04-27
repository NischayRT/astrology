"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
const NAV_LINKS = ["Palm Reading", "Compatibility", "Horoscope", "Biorhythms", "Profile"];

const SERVICES = [
  {
    title: "Palm Reading",
    subtitle: "Haath Rekha Vigyan",
    desc: "Discover the secrets written in the lines of your palm. Our ancient Vedic palmists decode your fate, health, and karmic path.",
    cta: "Read My Palm",
    icon: PalmIcon,
    accent: "#C4845A",
  },
  {
    title: "Horoscope",
    subtitle: "Janam Kundali",
    desc: "Your birth chart is a cosmic blueprint. Understand planetary positions and their influence on your life, relationships, and destiny.",
    cta: "View My Kundali",
    icon: HoroscopeIcon,
    accent: "#8B6FA8",
  },
  {
    title: "Compatibility",
    subtitle: "Kundali Milan",
    desc: "Will the stars align? Our 36-Guna matching reveals the cosmic harmony between two souls before they unite in marriage.",
    cta: "Find My Match",
    icon: CompatibilityIcon,
    accent: "#C45A7A",
  },
];

const ZODIAC_SIGNS = [
  { name: "Mesh", en: "Aries", symbol: "♈" },
  { name: "Vrishabha", en: "Taurus", symbol: "♉" },
  { name: "Mithuna", en: "Gemini", symbol: "♊" },
  { name: "Karka", en: "Cancer", symbol: "♋" },
  { name: "Simha", en: "Leo", symbol: "♌" },
  { name: "Kanya", en: "Virgo", symbol: "♍" },
  { name: "Tula", en: "Libra", symbol: "♎" },
  { name: "Vrishchika", en: "Scorpio", symbol: "♏" },
  { name: "Dhanu", en: "Sagittarius", symbol: "♐" },
  { name: "Makara", en: "Capricorn", symbol: "♑" },
  { name: "Kumbha", en: "Aquarius", symbol: "♒" },
  { name: "Meena", en: "Pisces", symbol: "♓" },
];

function PalmIcon() {
  return (
    <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 80, height: 90 }}>
      <path d="M40 85 C20 85 10 70 10 55 L10 30 C10 26 13 23 17 23 C21 23 24 26 24 30 L24 20 C24 16 27 13 31 13 C35 13 38 16 38 20 L38 18 C38 14 41 11 45 11 C49 11 52 14 52 18 L52 22 C52 18 55 15 59 15 C63 15 66 18 66 22 L66 50 C66 70 58 85 40 85Z" stroke="#C4845A" strokeWidth="1.5" fill="none"/>
      <path d="M24 30 C24 26 24 22 24 20" stroke="#C4845A" strokeWidth="1" strokeDasharray="2 2"/>
      <path d="M15 42 Q30 38 45 44" stroke="#C4845A" strokeWidth="1" fill="none"/>
      <path d="M14 52 Q32 47 52 54" stroke="#C4845A" strokeWidth="1" fill="none"/>
      <path d="M18 62 Q35 57 55 63" stroke="#C4845A" strokeWidth="1" fill="none"/>
      <circle cx="40" cy="50" r="2" fill="#C4845A" opacity="0.5"/>
    </svg>
  );
}

function HoroscopeIcon() {
  return (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
      <circle cx="45" cy="45" r="38" stroke="#8B6FA8" strokeWidth="1.5" fill="none"/>
      <circle cx="45" cy="45" r="28" stroke="#8B6FA8" strokeWidth="0.8" strokeDasharray="3 3" fill="none"/>
      <circle cx="45" cy="45" r="8" stroke="#8B6FA8" strokeWidth="1.5" fill="none"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const r = Math.PI * deg / 180;
        const x1 = 45 + 29 * Math.sin(r);
        const y1 = 45 - 29 * Math.cos(r);
        const x2 = 45 + 38 * Math.sin(r);
        const y2 = 45 - 38 * Math.cos(r);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8B6FA8" strokeWidth="1"/>;
      })}
      <circle cx="45" cy="14" r="3" fill="#8B6FA8" opacity="0.7"/>
      <circle cx="72" cy="28" r="2" fill="#8B6FA8" opacity="0.5"/>
      <circle cx="45" cy="45" r="3" fill="#8B6FA8"/>
    </svg>
  );
}

function CompatibilityIcon() {
  return (
    <svg viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 80 }}>
      <path d="M25 20 C25 10 10 10 10 22 C10 32 25 42 25 42 C25 42 40 32 40 22 C40 10 25 10 25 20Z" stroke="#C45A7A" strokeWidth="1.5" fill="none"/>
      <path d="M65 20 C65 10 50 10 50 22 C50 32 65 42 65 42 C65 42 80 32 80 22 C80 10 65 10 65 20Z" stroke="#C45A7A" strokeWidth="1.5" fill="none"/>
      <path d="M40 32 Q55 28 50 32" stroke="#C45A7A" strokeWidth="1" fill="none" strokeDasharray="2 2"/>
      <circle cx="25" cy="60" r="12" stroke="#C45A7A" strokeWidth="1" fill="none" strokeDasharray="2 2"/>
      <circle cx="65" cy="60" r="12" stroke="#C45A7A" strokeWidth="1" fill="none" strokeDasharray="2 2"/>
      <path d="M35 60 L55 60" stroke="#C45A7A" strokeWidth="0.8"/>
      <text x="45" y="63" textAnchor="middle" fontSize="8" fill="#C45A7A" fontFamily="serif">✦</text>
    </svg>
  );
}

function BiorhythmIcon() {
  return (
    <svg viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 70 }}>
      <path d="M5 35 Q15 10 25 35 Q35 60 45 35 Q55 10 65 35 Q75 60 85 35" stroke="#5A8BC4" strokeWidth="1.5" fill="none"/>
      <path d="M5 35 Q20 15 35 35 Q50 55 65 35 Q80 15 85 35" stroke="#8B6FA8" strokeWidth="1" strokeDasharray="3 2" fill="none"/>
      <line x1="5" y1="35" x2="85" y2="35" stroke="#5A8BC4" strokeWidth="0.5" opacity="0.4"/>
      <circle cx="45" cy="35" r="3" fill="#5A8BC4"/>
    </svg>
  );
}

function CelestialBackground() {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    cx: 10 + Math.random() * 80,
    cy: 10 + Math.random() * 80,
    r: 0.5 + Math.random() * 1,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  return (
    <svg
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
      preserveAspectRatio="xMidYMid slice"
    >
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r * 1.5} fill="#7A5C3A" opacity={s.opacity} />
      ))}
      <circle cx="680" cy="80" r="80" fill="none" stroke="#7A5C3A" strokeWidth="0.7" strokeDasharray="4 6"/>
      <circle cx="680" cy="80" r="55" fill="none" stroke="#7A5C3A" strokeWidth="0.5" strokeDasharray="2 4"/>
      <circle cx="100" cy="380" r="60" fill="none" stroke="#7A5C3A" strokeWidth="0.7" strokeDasharray="3 5"/>
      <path d="M640 80 Q680 30 720 80 Q680 130 640 80Z" fill="#7A5C3A" opacity="0.3"/>
      <path d="M60 340 Q100 290 140 340 Q100 390 60 340Z" fill="#7A5C3A" opacity="0.2"/>
      <text x="660" y="85" textAnchor="middle" fontSize="18" fill="#7A5C3A" opacity="0.6" fontFamily="serif">☽</text>
      <text x="370" y="60" textAnchor="middle" fontSize="12" fill="#7A5C3A" opacity="0.5" fontFamily="serif">✦</text>
      <text x="200" y="150" textAnchor="middle" fontSize="8" fill="#7A5C3A" opacity="0.4" fontFamily="serif">✦</text>
      <text x="500" y="200" textAnchor="middle" fontSize="10" fill="#7A5C3A" opacity="0.4" fontFamily="serif">✧</text>
      <text x="580" y="300" textAnchor="middle" fontSize="8" fill="#7A5C3A" opacity="0.35" fontFamily="serif">✦</text>
      <text x="120" y="220" textAnchor="middle" fontSize="10" fill="#7A5C3A" opacity="0.3" fontFamily="serif">✧</text>
    </svg>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: scrolled ? "rgba(253, 246, 236, 0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(196, 132, 90, 0.2)" : "none",
      transition: "all 0.4s ease",
      padding: "0 3rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        
        {/* Replaced SVG with logo.png */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image 
            src="/logo.png" 
            alt="Nakshatra Jyotish Logo" 
            width={48} 
            height={48} 
            style={{ objectFit: "contain" }} 
          />
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#3D1F0A", letterSpacing: 0.5, lineHeight: 1.1 }}>Nakshatra</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: "#C4845A", letterSpacing: 2, textTransform: "uppercase" }}>Jyotish</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2.2rem" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#" style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#5C3A1E",
              textDecoration: "none", letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#C4845A"}
              onMouseLeave={e => e.target.style.color = "#5C3A1E"}
            >{link}</a>
          ))}
        </div>

        <button style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600,
          background: "#C4845A", color: "#FDF6EC", border: "none",
          padding: "10px 22px", borderRadius: 2, cursor: "pointer",
          letterSpacing: 1, transition: "background 0.2s",
        }}>Get Prediction</button>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #FDF6EC 0%, #F5E8D2 40%, #EDD9B8 100%)",
      overflow: "hidden", // Crucial: prevents horizontal scroll from the right image
    }}>
      <CelestialBackground />

      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 180, height: 180, borderRadius: "50%", background: "rgba(196,132,90,0.12)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: 120, height: 120, borderRadius: "50%", background: "rgba(139,111,168,0.1)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", top: "55%", right: "20%", width: 80, height: 80, borderRadius: "50%", background: "rgba(196,90,122,0.1)" }} />

      {/* Left Corner: Moon (Shifted left by 40%, so right 60% is visible) */}
      <div style={{ 
        position: "absolute", left: 0, top: "50%", 
        transform: "translate(-40%, -50%)", 
        zIndex: 1, width: "100%", maxWidth: 600 
      }}>
        <Image 
          src="/hero-moon.png" 
          alt="Moon Illustration" 
          width={600}
          height={600}
          style={{ 
            width: "100%", height: "auto", 
            filter: "drop-shadow(0 0 20px rgba(139, 111, 168, 0.2))" 
          }} 
        />
      </div>

      {/* Right Corner: Sun (Shifted right by 40%, so left 60% is visible) */}
      <div style={{ 
        position: "absolute", right: 0, top: "50%", 
        transform: "translate(30%, -50%)", 
        zIndex: 1, width: "100%", maxWidth: 600 
      }}>
        <Image 
          src="/hero-sun.png" 
          alt="Sun Illustration" 
          width={600}
          height={600}
          style={{ 
            width: "100%", height: "auto", 
            filter: "drop-shadow(0 0 20px rgba(196, 132, 90, 0.2))" 
          }} 
        />
      </div>

      {/* Centered Main Content */}
      <div style={{ 
        maxWidth: 800, margin: "0 auto", padding: "0 3rem", width: "100%", 
        zIndex: 2, paddingTop: 80, display: "flex", flexDirection: "column", 
        alignItems: "center", textAlign: "center" 
      }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 28, height: 1, background: "#C4845A" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 3, textTransform: "uppercase" }}>Vedic Jyotish Shastra</span>
          <div style={{ width: 28, height: 1, background: "#C4845A" }} />
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
          fontWeight: 400, color: "#2C1205", lineHeight: 1.2, margin: "0 0 1.5rem",
          fontStyle: "italic",
        }}>
          Find peace of mind<br />and know yourself better
        </h1>

        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", lineHeight: 1.7, margin: "0 0 2.5rem", maxWidth: 480 }}>
          Rooted in 5,000 years of Vedic tradition, our pandits and astrologers reveal the cosmic blueprint written at the moment of your birth.
        </p>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
          <button style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600,
            background: "#C4845A", color: "#FDF6EC", border: "none",
            padding: "14px 32px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
          }}>Get Prediction</button>
          <button style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
            background: "transparent", color: "#C4845A",
            border: "1.5px solid rgba(196,132,90,0.5)",
            padding: "13px 28px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
          }}>View Kundali</button>
        </div>

        <div style={{ display: "flex", gap: "3.5rem", marginTop: "3.5rem", justifyContent: "center" }}>
          {[["50K+", "Consultations"], ["98%", "Accuracy Rate"], ["15+", "Vedic Experts"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#C4845A" }}>{num}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423", letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const SERVICES_WITH_IMG = [
  {
    title: "Palm Reading",
    subtitle: "Haath Rekha Vigyan",
    desc: "Discover the secrets written in the lines of your palm. Our ancient Vedic palmists decode your fate, health, and karmic path.",
    cta: "Read My Palm",
    accent: "#C4845A",
    img: "/palm.png",
  },
  {
    title: "Horoscope",
    subtitle: "Janam Kundali",
    desc: "Your birth chart is a cosmic blueprint. Understand planetary positions and their influence on your life, relationships, and destiny.",
    cta: "View My Kundali",
    accent: "#8B6FA8",
    img: "/astro.png",
  },
  {
    title: "Compatibility",
    subtitle: "Kundali Milan",
    desc: "Will the stars align? Our 36-Guna matching reveals the cosmic harmony between two souls before they unite in marriage.",
    cta: "Find My Match",
    accent: "#C45A7A",
    img: "/comp.png",
  },
];

function ServicesSection() {
  const [active, setActive] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On desktop: hover controls active; on mobile/tablet: click controls
  const handleEnter = (i) => { if (!isMobile) setActive(i); };
  const handleLeave = ()  => { if (!isMobile) setActive(null); };
  const handleClick = (i) => { if (isMobile) setActive(prev => prev === i ? null : i); };

  // Panel height logic
  // Container fixed height: 560px on desktop, auto-stacked on mobile
  const PANEL_H = 560; // px, desktop container height

  return (
    <section style={{ background: "#FDF6EC", padding: "6rem 0" }}>
      {/* Inject transition styles via a style tag */}
      <style>{`
        .svc-panel {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.65s cubic-bezier(0.77,0,0.18,1), height 0.65s cubic-bezier(0.77,0,0.18,1);
        }
        .svc-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          opacity: 0.35;
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .svc-panel.active .svc-img {
          opacity: 0.55;
          transform: scale(1.03);
        }
        .svc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(30,8,2,0.82) 0%, rgba(30,8,2,0.3) 55%, transparent 100%);
          transition: background 0.65s ease;
        }
        .svc-panel.active .svc-overlay {
          background: linear-gradient(to top, rgba(30,8,2,0.88) 0%, rgba(30,8,2,0.4) 50%, rgba(30,8,2,0.1) 100%);
        }
        .svc-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 2rem 2rem 2.2rem;
          z-index: 2;
          transition: padding 0.65s ease;
        }
        .svc-desc {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.65s cubic-bezier(0.77,0,0.18,1), opacity 0.45s ease;
        }
        .svc-panel.active .svc-desc {
          max-height: 200px;
          opacity: 1;
        }
        .svc-cta {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s;
          display: inline-block;
          margin-top: 1.2rem;
        }
        .svc-panel.active .svc-cta {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 3rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Shastra Se Seva
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Choose a way to know your future
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Rooted in the ancient wisdom of the Vedas, our services illuminate the path written in stars, palms, and celestial cycles.
          </p>
        </div>

        {/* Panels */}
        {isMobile ? (
          // Mobile: vertical stacked accordion
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SERVICES_WITH_IMG.map((svc, i) => {
              const isActive = active === i;
              return (
                <div
                  key={svc.title}
                  className={`svc-panel${isActive ? " active" : ""}`}
                  onClick={() => handleClick(i)}
                  style={{ height: isActive ? 420 : 200, borderRadius: 4 }}
                >
                  <img src={svc.img} alt={svc.title} className="svc-img" />
                  <div className="svc-overlay" />
                  <div className="svc-content">
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, color: svc.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{svc.subtitle}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: "#EDD9B8", margin: 0 }}>{svc.title}</h3>
                    <div className="svc-desc">
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, color: "rgba(237,217,184,0.85)", lineHeight: 1.7, margin: "0.8rem 0 0" }}>{svc.desc}</p>
                    </div>
                    <a href="#" className="svc-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: svc.accent, textDecoration: "none", letterSpacing: 1, borderBottom: `1px solid ${svc.accent}`, paddingBottom: 2 }}>
                      {svc.cta} →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop: horizontal panels with flex
          <div style={{ display: "flex", height: PANEL_H, gap: 12, borderRadius: 4, overflow: "hidden" }}>
            {SERVICES_WITH_IMG.map((svc, i) => {
              const isActive = active === i;
              // Active panel gets 50% flex-grow, others split the remaining 50%
              const flexValue = active === null ? 1 : isActive ? 2 : 0.5;
              return (
                <div
                  key={svc.title}
                  className={`svc-panel${isActive ? " active" : ""}`}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                  style={{ flex: flexValue, borderRadius: 4, minWidth: 0 }}
                >
                  <img src={svc.img} alt={svc.title} className="svc-img" />
                  <div className="svc-overlay" />
                  <div className="svc-content">
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, color: svc.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{svc.subtitle}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isActive ? 26 : 20, fontWeight: 600, color: "#EDD9B8", margin: 0, transition: "font-size 0.4s ease" }}>{svc.title}</h3>
                    <div className="svc-desc">
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: "rgba(237,217,184,0.85)", lineHeight: 1.7, margin: "0.8rem 0 0" }}>{svc.desc}</p>
                    </div>
                    <a href="#" className="svc-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: svc.accent, textDecoration: "none", letterSpacing: 1, borderBottom: `1px solid ${svc.accent}`, paddingBottom: 2 }}>
                      {svc.cta} →
                    </a>
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

function ZodiacSection() {
  const [hovered, setHovered] = useState(null);
  return (
    <section style={{ background: "#F2E6D2", padding: "5rem 3rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Rashi Chakra</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "#2C1205", margin: 0, fontStyle: "italic" }}>
            Explore Your Rashi
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
          {ZODIAC_SIGNS.map((sign, i) => (
            <div key={sign.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? "rgba(196,132,90,0.12)" : "rgba(253,246,236,0.6)",
                border: hovered === i ? "1px solid rgba(196,132,90,0.4)" : "1px solid rgba(196,132,90,0.15)",
                borderRadius: 2, padding: "1.2rem 0.8rem", textAlign: "center", cursor: "pointer",
                transition: "all 0.25s",
              }}>
              <div style={{ fontSize: 26, marginBottom: 6, opacity: 0.75 }}>{sign.symbol}</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, color: "#2C1205", fontWeight: 600 }}>{sign.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, color: "#C4845A", letterSpacing: 1 }}>{sign.en}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function BirthChartCTA() {
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");

  return (
    <section style={{ background: "#FDF6EC", padding: "6rem 3rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Janam Kundali</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Generate your free Birth Chart
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", lineHeight: 1.7, margin: "0 0 2rem" }}>
            Enter your birth details to receive a personalised Vedic horoscope analysed by our pandits — your planetary positions, dashas, and nakshatra decoded.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 380 }}>
            {[
              { label: "Date of Birth", value: dob, onChange: setDob, type: "date" },
              { label: "Time of Birth", value: time, onChange: setTime, type: "time" },
              { label: "Place of Birth", value: place, onChange: setPlace, type: "text", placeholder: "e.g. Hyderabad, Telangana" },
            ].map(({ label, value, onChange, type, placeholder }) => (
              <div key={label}>
                <label style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423", letterSpacing: 1, display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  type={type}
                  value={value}
                  placeholder={placeholder}
                  onChange={e => onChange(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
                    background: "#F9F0E2", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 2,
                    color: "#2C1205", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <button style={{
              marginTop: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600,
              background: "#C4845A", color: "#FDF6EC", border: "none", padding: "13px", borderRadius: 2,
              cursor: "pointer", letterSpacing: 1,
            }}>Generate My Kundali</button>
          </div>
        </div>

        {/* Visual kundali chart placeholder */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 320 320" width={320} height={320}>
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
            {[["I",60,60],["IV",160,60],["VII",260,60],["X",160,160],["II",60,160],["III",60,260],["VI",160,260],["IX",260,260],["XI",260,160]].map(([h,x,y]) => (
              <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#C4845A" opacity="0.4" fontFamily="'Cormorant Garamond', Georgia, serif">{h}</text>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#1E0C02", padding: "3rem", textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#EDD9B8", marginBottom: 8, fontStyle: "italic" }}>Nakshatra Jyotish</div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#8B6240", letterSpacing: 2, marginBottom: 20 }}>Ancient Wisdom · Modern Guidance</div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: 20 }}>
        {["Privacy Policy", "Terms of Service", "Contact Us", "About"].map(l => (
          <a key={l} href="#" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#8B6240", textDecoration: "none", letterSpacing: 0.5 }}>{l}</a>
        ))}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, color: "#5C3A1E" }}>© 2025 Nakshatra Jyotish · All Rights Reserved</div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FDF6EC; }
        input::placeholder { color: rgba(107,68,35,0.4); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #FDF6EC; }
        ::-webkit-scrollbar-thumb { background: rgba(196,132,90,0.4); border-radius: 3px; }
      `}</style>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ZodiacSection />
      <BirthChartCTA />
      <Footer />
    </div>
  );
}