"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ZODIAC_SIGNS } from "../../../data/constants"; 
import Navbar from "../../../components/Navbar"; 

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= rating ? "#F5B041" : "#D5D8DC", fontSize: 18 }}>★</span>
      ))}
    </div>
  );
}

function generateRating(text) {
  if (!text) return 3;
  return (text.length % 3) + 3; 
}

// NEW: Helper function to calculate the exact date for each tab
function getDateForTab(tabName) {
  const date = new Date();
  if (tabName === "Yesterday") date.setDate(date.getDate() - 1);
  if (tabName === "Tomorrow") date.setDate(date.getDate() + 1);
  
  // Formats as "Apr 28", "Apr 29", etc.
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HoroscopeDetail() {
  const params = useParams();
  const router = useRouter();
  const currentSign = params.sign; 
  
  const [activeTab, setActiveTab] = useState("Today");
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSidebar, setHoveredSidebar] = useState(null); 
  
  // API States
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const signData = ZODIAC_SIGNS.find(s => s.en.toLowerCase() === currentSign) || ZODIAC_SIGNS[0];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchHoroscope = async () => {
      setIsLoading(true);
      try {
        // NOTE: Once you want to actually fetch different days, you can pass 
        // the activeTab state to your API route (e.g., &day=yesterday)
        const response = await fetch(`/api/horoscope?sign=${currentSign}`);
        const data = await response.json();
        
        if (data && data.prediction) {
          setApiData(data.prediction);
        }
      } catch (error) {
        console.error("Failed to fetch detailed horoscope:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscope();
  }, [currentSign, activeTab]); // Added activeTab to dependency array for future use

  const detailedData = apiData ? {
    general: { rating: generateRating(apiData.personal_life), text: apiData.personal_life || "The stars are quiet on this matter today." },
    career: { rating: generateRating(apiData.profession), text: apiData.profession || "No specific career guidance today. Stay the course." },
    love: { rating: generateRating(apiData.emotions), text: apiData.emotions || "Focus on inner peace today." },
    money: { rating: generateRating(apiData.luck), text: apiData.luck || "Financial stability is maintained." },
    health: { rating: generateRating(apiData.health), text: apiData.health || "Maintain your daily routines for optimal wellbeing." }
  } : null;

  const TABS = ["Yesterday", "Today", "Tomorrow"];

  return (
    <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <Navbar /> 
      
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", paddingTop: 120, paddingBottom: 60, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2.5fr 1fr", gap: "3rem" }}>
        
        {/* LEFT COLUMN: Main Horoscope Content */}
        <div>
          {/* HEADER ROW */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 48, color: "#C4845A" }}>{signData.symbol}</div>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: "#2C1205", margin: 0 }}>
                  {signData.name} Horoscope
                </h1>
                <div style={{ fontSize: 16, color: "#6B4423", letterSpacing: 1, textTransform: "uppercase" }}>{signData.en}</div>
              </div>
            </div>
            <img src={signData.img} alt={signData.name} style={{ width: 80, height: 80, objectFit: "contain", opacity: 0.9 }} />
          </div>

          {/* DYNAMIC DATE TABS */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(196,132,90,0.3)", marginBottom: "2rem", overflowX: "auto", whiteSpace: "nowrap" }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none", border: "none", outline: "none", cursor: "pointer",
                  padding: "10px 24px 12px", fontFamily: "inherit",
                  color: activeTab === tab ? "#C4845A" : "#8B6240",
                  borderBottom: activeTab === tab ? "2px solid #C4845A" : "2px solid transparent",
                  transition: "all 0.3s ease",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4
                }}
              >
                <span style={{ fontSize: 18, fontWeight: activeTab === tab ? 600 : 400 }}>{tab}</span>
                <span style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", opacity: activeTab === tab ? 1 : 0.7 }}>
                  {getDateForTab(tab)}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div style={{ padding: "4rem 0", textAlign: "center", fontSize: 22, color: "#C4845A", fontStyle: "italic" }}>
              Consulting the stars to map your destiny...
            </div>
          ) : detailedData ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "heroFadeUp 0.6s ease" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>👤</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2C1205", margin: 0 }}>{activeTab} General Horoscope</h3>
                  <StarRating rating={detailedData.general.rating} />
                </div>
                <p style={{ fontSize: 18, color: "#4A2F1D", lineHeight: 1.6, margin: 0 }}>{detailedData.general.text}</p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>💼</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2C1205", margin: 0 }}>{activeTab} Career & Business</h3>
                  <StarRating rating={detailedData.career.rating} />
                </div>
                <p style={{ fontSize: 18, color: "#4A2F1D", lineHeight: 1.6, margin: 0 }}>{detailedData.career.text}</p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>❤️</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2C1205", margin: 0 }}>{activeTab} Love & Relationships</h3>
                  <StarRating rating={detailedData.love.rating} />
                </div>
                <p style={{ fontSize: 18, color: "#4A2F1D", lineHeight: 1.6, margin: 0 }}>{detailedData.love.text}</p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>🪙</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2C1205", margin: 0 }}>{activeTab} Money & Finances</h3>
                  <StarRating rating={detailedData.money.rating} />
                </div>
                <p style={{ fontSize: 18, color: "#4A2F1D", lineHeight: 1.6, margin: 0 }}>{detailedData.money.text}</p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>⚕️</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2C1205", margin: 0 }}>{activeTab} Health</h3>
                  <StarRating rating={detailedData.health.rating} />
                </div>
                <p style={{ fontSize: 18, color: "#4A2F1D", lineHeight: 1.6, margin: 0 }}>{detailedData.health.text}</p>
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem 0", color: "#C4845A" }}>
              Unable to read cosmic data at this time. Please try again later.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar Navigation */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#2C1205", borderBottom: "1px solid rgba(196,132,90,0.3)", paddingBottom: 12, marginBottom: 20 }}>
            Other Zodiac Signs
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ZODIAC_SIGNS.map((sign) => {
              const isSelected = sign.en.toLowerCase() === currentSign;
              const isHovered = hoveredSidebar === sign.en;
              const showImage = isSelected || isHovered;

              return (
                <button
                  key={sign.en}
                  onMouseEnter={() => setHoveredSidebar(sign.en)}
                  onMouseLeave={() => setHoveredSidebar(null)}
                  onClick={() => router.push(`/horoscope/${sign.en.toLowerCase()}`)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                    background: isSelected ? "rgba(196,132,90,0.15)" : "rgba(253,246,236,0.6)",
                    border: isSelected ? "1px solid #C4845A" : "1px solid rgba(196,132,90,0.2)",
                    padding: "12px 16px", borderRadius: 4, cursor: "pointer",
                    transition: "all 0.2s ease", textAlign: "left", outline: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24, color: "#C4845A" }}>{sign.symbol}</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: "#2C1205", fontWeight: 600 }}>{sign.name}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6B4423" }}>{sign.en}</div>
                    </div>
                  </div>
                  
                  {showImage && (
                    <img src={sign.img} alt={sign.name} style={{ width: 36, height: 36, objectFit: "contain", opacity: 0.85, animation: "fadeIn 0.3s ease" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}