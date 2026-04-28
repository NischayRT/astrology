// src/components/ZodiacSection.js
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ZODIAC_SIGNS } from "../data/constants";

export default function ZodiacSection() {
  const [hovered, setHovered] = useState(null);
  const [activeSign, setActiveSign] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const panelRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSignClick = async (index) => {
    if (activeSign === index) {
      setActiveSign(null);
      return;
    }

    setActiveSign(index);
    setIsLoading(true);
    setHoroscopeData(""); 

    setTimeout(() => {
      if (panelRef.current) {
        const yOffset = -90; 
        const element = panelRef.current;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150); 

    const signName = ZODIAC_SIGNS[index].en.toLowerCase(); 

    try {
      const response = await fetch(`/api/horoscope?sign=${signName}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      
      if (data && data.prediction) {
        if (typeof data.prediction === 'object') {
          setHoroscopeData(data.prediction.personal_life || data.prediction.emotions || "The stars are aligned. Click below to read your full detailed horoscope.");
        } else {
          setHoroscopeData(data.prediction); 
        }
      } else {
        setHoroscopeData("Today's reading is currently unavailable.");
      }
    } catch (error) {
      console.error("Failed to fetch horoscope:", error);
      setHoroscopeData("The stars are currently clouded. Please try reading your horoscope again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ background: "#F2E6D2", padding: "5rem 1.5rem", transition: "padding 0.4s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Daily Darshan</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "#2C1205", margin: 0, fontStyle: "italic" }}>
            Read Your Indian Horoscope
          </h2>
        </div>
        
        {/* FIX: Explicitly set to repeat(6, 1fr) for 6 columns on Desktop, and 2 on Mobile */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)", gap: "1rem" }}>
          {ZODIAC_SIGNS.map((sign, i) => {
            const isHovered = !isMobile && hovered === i;
            const isSelected = activeSign === i;
            const isActive = isSelected || isHovered;

            return (
              <button 
                key={sign.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSignClick(i)}
                style={{
                  position: "relative", overflow: "hidden", outline: "none", cursor: "pointer",
                  background: isActive ? "rgba(196,132,90,0.12)" : "rgba(253,246,236,0.6)",
                  border: isSelected ? "1px solid #C4845A" : isActive ? "1px solid rgba(196,132,90,0.4)" : "1px solid rgba(196,132,90,0.15)",
                  borderRadius: 4, padding: isMobile ? "1.5rem 0.5rem" : "2rem 0.5rem", textAlign: "center", 
                  transition: "all 0.4s ease", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", height: "190px",
                  transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isSelected ? "0 10px 20px rgba(196,132,90,0.1)" : "none",
                }}>
                <img src={sign.img} alt={`${sign.name}`} style={{
                    position: "absolute", width: "100%", height: "100%", objectFit: "contain",
                    opacity: isActive ? 0.18 : 0.08, mixBlendMode: "multiply", zIndex: 0,
                    transform: `translate(-50%, -50%) rotateY(${isActive ? 180 : 0}deg) scale(${isActive ? 1.15 : 1})`,
                    top: "50%", left: "50%", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease",
                    pointerEvents: "none",
                  }} />
                <div style={{ position: "relative", zIndex: 1, transform: isActive ? "scale(1.12)" : "scale(1)", transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#2C1205", fontWeight: isActive ? 700 : 600 }}>{sign.name}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, fontWeight: isActive ? 600 : 400, color: "#C4845A", letterSpacing: 1, marginTop: 4 }}>{sign.en}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div 
          ref={panelRef}
          style={{ 
            overflow: "hidden", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            maxHeight: activeSign !== null ? "600px" : "0", opacity: activeSign !== null ? 1 : 0,
            marginTop: activeSign !== null ? "3rem" : "0"
        }}>
          {activeSign !== null && (
            <div style={{ 
              background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 4, 
              padding: isMobile ? "2rem 1.5rem" : "3rem", position: "relative", textAlign: "center"
            }}>
              <div style={{ fontSize: 40, color: "#C4845A", opacity: 0.2 }}>{ZODIAC_SIGNS[activeSign].symbol}</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 2.5vw, 2rem)", color: "#2C1205", marginBottom: 8 }}>
                Today's reading for {ZODIAC_SIGNS[activeSign].name}
              </h3>
              
              {isLoading ? (
                <div style={{ marginTop: 24, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#C4845A", fontStyle: "italic" }}>Consulting the stars...</div>
              ) : (
                <>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, color: "#6B4423", lineHeight: 1.7, maxWidth: 700, margin: "24px auto 0" }}>{horoscopeData}</p>
                  <div style={{ marginTop: "2.5rem" }}>
                    <Link href={`/horoscope/${ZODIAC_SIGNS[activeSign].en.toLowerCase()}`}
                      style={{ 
                        display: "inline-block", background: "transparent", color: "#C4845A", border: "1px solid #C4845A", 
                        padding: "10px 28px", borderRadius: 2, textDecoration: "none", fontFamily: "'Cormorant Garamond', Georgia, serif", 
                        fontSize: 16, fontWeight: 600, transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#C4845A"; e.target.style.color = "#FDF6EC"; }}
                      onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#C4845A"; }}
                    >
                      View Full Data →
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}