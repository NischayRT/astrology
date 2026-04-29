"use client";
import { useState, useEffect } from "react";
import Image from "next/image"; 

import Navbar from "../components/Navbar";
import ZodiacSection from "../components/ZodiacSection";
import HinduCalendar from "../components/HinduCalendar";
const SERVICES_WITH_IMG = [
  {
    title: "Yantras",
    subtitle: "Vedic Sacred Geometry", // Updated
    desc: "Yantras are mystical cosmic diagrams that act as powerful energy centers. They harness divine frequencies to bring harmony, protection, and prosperity into your life.", // Updated
    cta: "Explore Yantras", // Updated
    accent: "#C4845A",
    img: "/yantra.webp",
  },
  {
    title: "Horoscope",
    subtitle: "Janam Kundali",
    desc: "Plan your day accordingly stars. Understand planetary positions and their influence on your life, relationships, and destiny.",
    cta: "Read Daily Prediction",
    accent: "#8B6FA8",
    img: "/astro.webp",
  },
  {
    title: "Compatibility",
    subtitle: "Kundali Milan",
    desc: "Will the stars align? Our 36-Guna matching reveals the cosmic harmony between two souls before they unite in marriage.",
    cta: "Find My Match",
    accent: "#C45A7A",
    img: "/comp.webp",
  },
];


// --- PAGE COMPONENTS ---

function CelestialBackground() {
  // 1. Start with an empty array of stars to match the server render perfectly
  const [stars, setStars] = useState([]);

  // 2. Generate the random stars ONLY after the component mounts in the browser
  useEffect(() => {
    const generatedStars = Array.from({ length: 28 }, (_, i) => ({
      cx: 10 + Math.random() * 80,
      cy: 10 + Math.random() * 80,
      r: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <svg
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* 3. The stars map will be empty for a split second, then fill in smoothly */}
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r * 1.5} fill="#7A5C3A" opacity={s.opacity} />
      ))}
      
      {/* Static celestial elements (these never change, so they don't cause hydration errors) */}
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
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 1. Existing Parallax and 2D rotations
  const moonParallaxY = scrollY * 0.45;   
  const sunParallaxY  = scrollY * 0.45;  
  const moonParallaxX = scrollY * 0.35;   
  const sunParallaxX  = scrollY * -0.35;  

  const visibilityShift = Math.min(10, scrollY * 0.033); 
  const moonMobileY = -60 + visibilityShift; 
  const sunMobileY = 60 - visibilityShift;   

  const moonRotate = scrollY * 0.06; 
  const sunRotate = scrollY * -0.06;

  // 2. NEW: 3D "Gate" Tilt Calculations (Capped at 85 degrees so they don't vanish entirely)
  // Positive tilt pushes the inner edge backward. Negative tilt pushes the inner edge backward from the other side.
  const gateTiltPos = Math.min(scrollY * 0.08, 85); 
  const gateTiltNeg = Math.max(scrollY * -0.08, -85);

  return (
    <section id="services" style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #FDF6EC 0%, #F5E8D2 40%, #EDD9B8 100%)",
      overflow: "hidden",
    }}>
      <CelestialBackground />

      <div style={{ position: "absolute", top: "15%", right: "8%", width: 180, height: 180, borderRadius: "50%", background: "rgba(196,132,90,0.12)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: 120, height: 120, borderRadius: "50%", background: "rgba(139,111,168,0.1)", filter: "blur(2px)" }} />

      {/* LEFT / TOP GATE (MOON) */}
      <div style={{
        position: "absolute", zIndex: 1, width: "100%", maxWidth: isMobile ? 450 : 600, willChange: "transform",
        ...(isMobile ? {
          top: 0, left: "50%", transform: `translate(calc(-50% + ${moonParallaxX}px), ${moonMobileY}%) rotate(${moonRotate}deg)`,
        } : {
          left: 0, top: "50%", transform: `translate(-40%, calc(-50% + ${moonParallaxY}px))`,
        })
      }}>
        <Image src="/hero-moon.webp" alt="Moon" width={600} height={600} 
          style={{ 
            width: "100%", height: "auto", 
            filter: "drop-shadow(0 0 20px rgba(139, 111, 168, 0.2))",
            // NEW: Set the hinge point based on the screen size
            transformOrigin: isMobile ? "top center" : "left center",
            // NEW: Apply 3D perspective and axis rotation
            transform: `perspective(1200px) ${isMobile ? `rotateX(${gateTiltPos}deg)` : `rotateY(${gateTiltPos}deg)`}`,
            transition: "transform 0.1s ease-out" // smooths the scroll frame rate
          }} 
        />
      </div>

      {/* RIGHT / BOTTOM GATE (SUN) */}
      <div style={{
        position: "absolute", zIndex: 1, width: "100%", maxWidth: isMobile ? 450 : 600, willChange: "transform",
        ...(isMobile ? {
          bottom: 0, left: "50%", transform: `translate(calc(-50% + ${sunParallaxX}px), ${sunMobileY}%) rotate(${sunRotate}deg)`,
        } : {
          right: 0, top: "50%", transform: `translate(30%, calc(-50% + ${sunParallaxY}px))`,
        })
      }}>
        <Image src="/hero-sun.webp" alt="Sun" width={600} height={600} 
          style={{ 
            width: "100%", height: "auto", 
            filter: "drop-shadow(0 0 20px rgba(196, 132, 90, 0.2))",
            // NEW: Set the hinge point based on the screen size
            transformOrigin: isMobile ? "bottom center" : "right center",
            // NEW: Apply 3D perspective and axis rotation
            transform: `perspective(1200px) ${isMobile ? `rotateX(${gateTiltNeg}deg)` : `rotateY(${gateTiltNeg}deg)`}`,
            transition: "transform 0.1s ease-out"
          }} 
        />
      </div>

      {isMobile && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
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
        animation: "heroFadeUp 1s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 16 : 20 }}>
          <div style={{ width: isMobile ? 20 : 28, height: 1, background: "#C4845A" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 11 : 13, color: "#C4845A", letterSpacing: 3, textTransform: "uppercase" }}>Vedic Jyotish Shastra</span>
          <div style={{ width: isMobile ? 20 : 28, height: 1, background: "#C4845A" }} />
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.5rem, 9vw, 3.8rem)", 
          fontWeight: 400, color: "#2C1205", lineHeight: 1.15, margin: "0 0 1.25rem",
          fontStyle: "italic",
        }}>
          Find peace of mind<br />and know yourself better
        </h1>

        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 17 : 18, color: "#6B4423", lineHeight: 1.6, margin: "0 0 2rem", maxWidth: 480 }}>
          Rooted in 5,000 years of Vedic tradition, our pandits and astrologers reveal the cosmic blueprint written at the moment of your birth.
        </p>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <button style={{
            width: isMobile ? "100%" : "auto", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600,
            background: "#C4845A", color: "#FDF6EC", border: "none", padding: "14px 32px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
          }}>Get Prediction</button>
          <button style={{
            width: isMobile ? "100%" : "auto", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17,
            background: "transparent", color: "#C4845A", border: "1.5px solid rgba(196,132,90,0.5)", padding: "13px 28px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
          }}>View Kundali</button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "2.5rem" : "3.5rem", marginTop: "3rem", justifyContent: "center" }}>
          {[["50K+", "Consultations"], ["98%", "Accuracy Rate"], ["15+", "Vedic Experts"]].map(([num, label]) => (
            <div key={label} style={{ minWidth: isMobile ? "120px" : "auto" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 28 : 26, fontWeight: 700, color: "#C4845A", marginBottom: 4 }}>{num}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423", letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
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
        
        /* 3D continuous rotation */
        .svc-panel.active .svc-img { 
          top: 50%; 
          opacity: 0.12; 
          animation: spinTilt 18s linear infinite; 
        }
        
        @keyframes spinTilt {
          0% { transform: translate(-50%, -50%) scale(1.2) perspective(800px) rotateX(40deg) rotateZ(0deg); }
          100% { transform: translate(-50%, -50%) scale(1.2) perspective(800px) rotateX(40deg) rotateZ(360deg); }
        }

        /* TEXT TRANSITIONS AND POSITIONING */
        .svc-content {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem 1.5rem 1.5rem; z-index: 2;
          display: flex; flex-direction: column; alignItems: center; text-align: center;
          /* Start the text slightly lower down */
          transform: translateY(20px); 
          transition: transform 0.65s cubic-bezier(0.77,0,0.18,1), background 0.65s ease;
        }
        
        .svc-panel.active .svc-content { 
          /* Slide the text up into full view when active */
          transform: translateY(0); 
          /* Add a gentle gradient overlay so text remains readable against the spinning image */
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

        /* Highlight and scale the title when active */
        .svc-panel.active .svc-title {
          color: #C4845A;
          transform: scale(1.05);
        }

        /* On desktop, make the title even larger when active */
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 3rem" }}>
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

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SERVICES_WITH_IMG.map((svc, i) => {
              const isActive = active === i;
              return (
                <div key={svc.title} className={`svc-panel${isActive ? " active" : ""}`} onClick={() => handleClick(i)} style={{ height: isActive ? 460 : 260, borderRadius: 4 }}>
                  <Image src={svc.img} alt={svc.title} width={320} height={320} className="svc-img" />
                  <div className="svc-content">
                    {/* Using the new .svc-title class for transitions */}
                    <h3 className="svc-title">{svc.title}</h3>
                    <div className="svc-desc"><p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: "#6B4423", lineHeight: 1.6, margin: "1rem 0 0" }}>{svc.desc}</p></div>
                    <a href="#" className="svc-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#2C1205", textDecoration: "none", borderBottom: `1px solid rgba(44,18,5,0.3)`, paddingBottom: 4 }}>{svc.cta}</a>
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
                    {/* Using the new .svc-title class for transitions */}
                    <h3 className="svc-title">{svc.title}</h3>
                    <div className="svc-desc"><p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: "#6B4423", lineHeight: 1.6, margin: "1rem 0 0" }}>{svc.desc}</p></div>
                    <a href="#" className="svc-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#2C1205", textDecoration: "none", borderBottom: `1px solid rgba(44,18,5,0.3)`, paddingBottom: 4 }}>{svc.cta}</a>
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
function BirthChartCTA() {
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section style={{ background: "#FDF6EC", padding: "6rem 1.5rem" }}>
      <div style={{ 
        maxWidth: 1200, margin: "0 auto", display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
        gap: isMobile ? "3rem" : "5rem", alignItems: "center" 
      }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Janam Kundali</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Generate your free Birth Chart
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", lineHeight: 1.7, margin: isMobile ? "0 auto 2rem" : "0 0 2rem", maxWidth: 500 }}>
            Enter your birth details to receive a personalised Vedic horoscope analysed by our pandits — your planetary positions, dashas, and nakshatra decoded.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 380, margin: isMobile ? "0 auto" : "0", textAlign: "left" }}>
            {[
              { label: "Date of Birth", value: dob, onChange: setDob, type: "date" },
              { label: "Time of Birth", value: time, onChange: setTime, type: "time" },
              { label: "Place of Birth", value: place, onChange: setPlace, type: "text", placeholder: "e.g. Hyderabad, Telangana" },
            ].map(({ label, value, onChange, type, placeholder }) => (
              <div key={label}>
                <label style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423", letterSpacing: 1, display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
                    background: "#F9F0E2", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 2,
                    color: "#2C1205", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <button style={{
              marginTop: 12, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600,
              background: "#C4845A", color: "#FDF6EC", border: "none", padding: "14px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
            }}>Generate My Kundali</button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
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
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, color: "#5C3A1E" }}>© 2026 Nakshatra Jyotish · All Rights Reserved</div>
    </footer>
  );
}

// --- MAIN APPLICATION SHELL ---

// Bottom of src/app/page.js

export default function App() {
  return (
    <div>      
      <Navbar />
      <HeroSection />
      <ServicesSection />
      
      <div id="daily-horoscope">
        <ZodiacSection />
      </div>
      {/* <section style={{ padding: "2.5rem 1rem" }}>
         <HinduCalendar /> 
      </section> */}
      <BirthChartCTA />
      <Footer />
    </div>
  );
}