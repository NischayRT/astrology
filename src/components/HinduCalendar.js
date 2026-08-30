// components/HinduCalendar.js
"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  PRESET_CITIES,
  searchLocations,
  getMuhurtaWindows,
  getChoghadiya,
  formatTimeRange,
} from "../lib/muhurta";
import { getDailyPanchang } from "../lib/panchang";
import { COLORS } from "../lib/theme";

// --- Small line-style icons (replace emoji glyphs, match the Navbar's icon style) ---
function IconPin({ size = 18, color = COLORS.accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconSearch({ size = 15, color = COLORS.accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconCrosshair({ size = 15, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}

function IconChevronLeft({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}


const DAYS_OF_WEEK = [
  { eng: "SUN", san: "रवि" },
  { eng: "MON", san: "सोम" },
  { eng: "TUE", san: "मंगल" },
  { eng: "WED", san: "बुध" },
  { eng: "THU", san: "गुरू" },
  { eng: "FRI", san: "शुक्र" },
  { eng: "SAT", san: "शनि" },
];

export default function HinduCalendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 7, 1));
  const [selectedDay, setSelectedDay] = useState(31);
  const [location, setLocation] = useState(PRESET_CITIES[0]);
  const [activeTab, setActiveTab] = useState("windows");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Geolocation & Autocomplete Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const searchRef = useRef(null);
  const detailsRef = useRef(null);

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Location Query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(searchQuery);
      setSearchResults(res);
      setIsSearching(false);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // GPS Current Location Detection
  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const tz = -new Date().getTimezoneOffset() / 60;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            "Current Location";
          setLocation({
            name: `${cityName}, ${data.address?.country || ""}`,
            lat: latitude,
            lon: longitude,
            tz: tz,
          });
        } catch {
          setLocation({
            name: `GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
            lat: latitude,
            lon: longitude,
            tz: tz,
          });
        }
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Location access denied or unavailable.");
        setIsLocating(false);
      }
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const activeDate = useMemo(() => {
    return new Date(year, month, selectedDay || 1);
  }, [year, month, selectedDay]);

  const dayDetails = useMemo(() => {
    try {
      const panchang = getDailyPanchang(activeDate, location.lat, location.lon, location.tz);
      const muhurta = getMuhurtaWindows(activeDate, location.lat, location.lon);
      const choghadiya = getChoghadiya(activeDate, location.lat, location.lon);
      return { panchang, muhurta, choghadiya };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [activeDate, location]);

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ empty: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const p = getDailyPanchang(dateObj, location.lat, location.lon, location.tz);
      cells.push({
        day: d,
        tithi: p?.tithi ? p.tithi.split(" ")[1] || p.tithi : "",
        nakshatra: p?.nakshatra || "",
      });
    }
    return cells;
  }, [year, month, firstDayOfMonth, daysInMonth, location]);

  const selectedDateFormatted = activeDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div style={{ maxWidth: 940, margin: "0 auto", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#2C1205" }}>
      
      {/* Location Directory & GPS Search Bar */}
      <div
        style={{
          background: "#FAF2E6",
          border: "1px solid rgba(196,132,90,0.3)",
          borderRadius: 6,
          padding: isMobile ? "1rem" : "1rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "2rem",
          boxShadow: "0 4px 15px rgba(196,132,90,0.06)",
        }}
      >
        {/* Active City Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <IconPin size={18} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>Current Almanac Coordinates</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 600, color: "#2C1205", overflowWrap: "break-word" }}>
              {location.name}
            </div>
          </div>
        </div>

        {/* Search Input + GPS Autocomplete Container */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, flex: "1 1 280px", maxWidth: isMobile ? "100%" : 440, position: "relative" }} ref={searchRef}>
          <div style={{ position: "relative", width: "100%", flex: "1 1 180px", minWidth: 0 }}>
            <input
              type="text"
              placeholder="Search any town/city worldwide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 16,
                background: "#FDF6EC",
                border: "1px solid rgba(196,132,90,0.35)",
                borderRadius: 4,
                color: "#2C1205",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
              <IconSearch size={14} />
            </span>

            {/* Dropdown Directory List */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "105%",
                  left: 0,
                  right: 0,
                  background: "#FDF6EC",
                  border: "1px solid rgba(196,132,90,0.35)",
                  borderRadius: 4,
                  boxShadow: "0 8px 24px rgba(44,18,5,0.12)",
                  zIndex: 50,
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                {isSearching ? (
                  <div style={{ padding: "10px 14px", fontSize: 15, color: "#8B6240" }}>Searching location database...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setLocation(item);
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: "8px 14px",
                        fontSize: 15,
                        color: "#2C1205",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(196,132,90,0.1)",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5E0C8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#FDF6EC")}
                    >
                      {item.name}
                    </div>
                  ))
                ) : searchQuery.trim().length >= 2 ? (
                  <div style={{ padding: "10px 14px", fontSize: 15, color: "#8B6240" }}>No matching places found</div>
                ) : (
                  <div>
                    <div style={{ padding: "6px 14px", fontSize: 12, letterSpacing: 1, color: "#8B6240", textTransform: "uppercase", background: "rgba(196,132,90,0.08)" }}>
                      Popular Presets
                    </div>
                    {PRESET_CITIES.map((c) => (
                      <div
                        key={c.name}
                        onClick={() => {
                          setLocation(c);
                          setShowDropdown(false);
                        }}
                        style={{
                          padding: "8px 14px",
                          fontSize: 15,
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(196,132,90,0.1)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5E0C8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#FDF6EC")}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* GPS Locate Button */}
          <button
            onClick={handleGPSDetect}
            disabled={isLocating}
            title="Auto-detect location from GPS"
            aria-label="Detect my location"
            style={{
              padding: "8px 14px",
              background: "#C4845A",
              border: "none",
              borderRadius: 4,
              color: "#FDF6EC",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: isLocating ? "wait" : "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => { if (!isLocating) e.currentTarget.style.background = "#a36e4b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C4845A"; }}
          >
            <IconCrosshair size={14} color="#FDF6EC" />
            {isLocating ? "Locating..." : "GPS"}
          </button>
        </div>
      </div>

      {/* Month Navigation Header */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isMobile ? "0.85rem" : 0,
        marginBottom: "1.5rem",
      }}>
        {isMobile && (
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.7rem", fontWeight: 500, margin: 0, textAlign: "center" }}>
            {monthName} {year}
          </h2>
        )}

        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%", gap: isMobile ? "0.75rem" : 0 }}>
          <button
            onClick={handlePrevMonth}
            aria-label="Previous month"
            style={{
              background: "#FDF6EC",
              border: "1px solid rgba(196,132,90,0.4)",
              borderRadius: 4,
              padding: isMobile ? "8px 14px" : "6px 16px",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              color: "#6B4423",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flex: isMobile ? 1 : "none",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F5E0C8"; e.currentTarget.style.borderColor = "#C4845A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FDF6EC"; e.currentTarget.style.borderColor = "rgba(196,132,90,0.4)"; }}
          >
            <IconChevronLeft size={15} />
            Prev
          </button>

          {!isMobile && (
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", fontWeight: 500, margin: 0, textAlign: "center" }}>
              {monthName} {year}
            </h2>
          )}

          <button
            onClick={handleNextMonth}
            aria-label="Next month"
            style={{
              background: "#FDF6EC",
              border: "1px solid rgba(196,132,90,0.4)",
              borderRadius: 4,
              padding: isMobile ? "8px 14px" : "6px 16px",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              color: "#6B4423",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flex: isMobile ? 1 : "none",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F5E0C8"; e.currentTarget.style.borderColor = "#C4845A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FDF6EC"; e.currentTarget.style.borderColor = "rgba(196,132,90,0.4)"; }}
          >
            Next
            <IconChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Weekday Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: 12 }}>
        {DAYS_OF_WEEK.map((d) => (
          <div key={d.eng}>
            <div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 15, letterSpacing: isMobile ? 0.5 : 1 }}>{d.eng}</div>
            <div style={{ fontSize: isMobile ? 11 : 14, color: "#8B6240" }}>{d.san}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {/* Month Header & Controls */}
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? "1rem" : "1.5rem" }}>
  <button
    onClick={handlePrevMonth}
    style={{
      background: "#FDF6EC",
      border: "1px solid rgba(196,132,90,0.4)",
      borderRadius: 4,
      padding: isMobile ? "5px 12px" : "6px 16px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: isMobile ? 13 : 15,
      cursor: "pointer",
      color: "#6B4423"
    }}
  >
    ← Prev
  </button>

  <div style={{ textAlign: "center" }}>
    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? "1.5rem" : "2.2rem", fontWeight: 600, margin: 0 }}>
      {monthName} {year}
    </h2>
  </div>

  <button
    onClick={handleNextMonth}
    style={{
      background: "#FDF6EC",
      border: "1px solid rgba(196,132,90,0.4)",
      borderRadius: 4,
      padding: isMobile ? "5px 12px" : "6px 16px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: isMobile ? 13 : 15,
      cursor: "pointer",
      color: "#6B4423"
    }}
  >
    Next →
  </button>
</div>

{/* Weekday Names Header */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: isMobile ? 6 : 12 }}>
  {DAYS_OF_WEEK.map((d) => (
    <div key={d.eng} style={{ padding: isMobile ? "2px 0" : "4px 0" }}>
      <div style={{ fontWeight: 700, fontSize: isMobile ? 11 : 14, letterSpacing: 0.5, color: "#2C1205" }}>
        {isMobile ? d.eng.charAt(0) : d.eng}
      </div>
      {!isMobile && <div style={{ fontSize: 13, color: "#8B6240" }}>{d.san}</div>}
    </div>
  ))}
</div>

{/* Calendar Cells Grid */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: isMobile ? "3px" : "8px",
    marginBottom: "2rem",
    width: "100%",
  }}
>
  {calendarCells.map((cell, index) => {
    if (cell.empty) {
      return (
        <div
          key={`empty-${index}`}
          style={{
            minHeight: isMobile ? 48 : 88,
            aspectRatio: isMobile ? "1 / 1" : "auto",
          }}
        />
      );
    }
    const isSelected = selectedDay === cell.day;
    const isToday = isCurrentMonth && today.getDate() === cell.day;

    // Mobile-friendly condensed tithi labels
    const formatMobileTithi = (t) => {
      if (!t) return "";
      const map = {
        "Pratipada": "Pratipada",
        "Chaturdashi": "Chatur.",
        "Trayodashi": "Trayo.",
        "Dwadashi": "Dwadashi",
        "Ekadashi": "Ekadashi",
        "Amavasya": "Amavasya",
        "Purnima": "Purnima",
        "Saptami": "Saptami",
        "Ashtami": "Ashtami",
        "Shashthi": "Shashthi",
        "Chaturthi": "Chaturthi",
        "Panchami": "Panchami",
        "Tritiya": "Tritiya",
        "Dwitiya": "Dwitiya",
        "Navami": "Navami",
        "Dashami": "Dashami"
      };
      return map[t] || t.slice(0, 7);
    };

    return (
      <div
        key={`day-${cell.day}`}
        onClick={() => {
          setSelectedDay(cell.day);
          setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 100);
        }}
        style={{
          position: "relative",
          minHeight: isMobile ? 46 : 88,
          aspectRatio: isMobile ? "1 / 1" : "auto",
          background: isSelected ? "#F5E0C8" : "#FAF2E6",
          border: isSelected
            ? "1.5px solid #C4845A"
            : isToday
            ? "1.5px solid rgba(196,132,90,0.75)"
            : "1px solid rgba(196,132,90,0.22)",
          borderRadius: 4,
          padding: isMobile ? "4px 2px" : "8px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: isMobile ? "center" : "stretch",
          textAlign: isMobile ? "center" : "left",
          boxSizing: "border-box",
          overflow: "hidden",
          transition: "all 0.2s ease",
        }}
      >
        {isToday && !isSelected && (
          <span
            style={{
              position: "absolute",
              top: isMobile ? 3 : 5,
              right: isMobile ? 3 : 5,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#C4845A",
            }}
            title="Today"
          />
        )}

        {/* Date Number */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: isMobile ? 13 : 18,
            fontWeight: 700,
            lineHeight: 1,
            color: "#2C1205",
          }}
        >
          {cell.day}
        </div>

        {/* Tithi Text */}
        <div style={{ width: "100%", overflow: "hidden" }}>
          <div
            style={{
              fontSize: isMobile ? 8.5 : 12,
              letterSpacing: isMobile ? -0.2 : 0,
              color: "#2C1205",
              fontWeight: 600,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isMobile ? formatMobileTithi(cell.tithi) : cell.tithi}
          </div>
          {!isMobile && (
            <div
              style={{
                fontSize: 10.5,
                color: "#8B6240",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 2,
              }}
            >
              {cell.nakshatra}
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>
      {/* Comprehensive Details Section */}
      {dayDetails && (
        <div
          ref={detailsRef}
          style={{
            background: "#FAF2E6",
            border: "1px solid rgba(196,132,90,0.3)",
            borderRadius: 6,
            padding: isMobile ? "1.25rem" : "2rem",
            boxShadow: "0 10px 30px rgba(196,132,90,0.06)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: isMobile ? 1 : 2, color: "#C4845A", textTransform: "uppercase", marginBottom: 6, overflowWrap: "break-word" }}>
            DETAILED TIMING & MUHURTHA · {location.name.toUpperCase()}
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? "1.4rem" : "1.8rem", margin: "0 0 1.5rem", fontWeight: 500 }}>
            {selectedDateFormatted}
          </h3>

          {/* Tab Controls */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveTab("windows")}
              style={{
                background: activeTab === "windows" ? "#C4845A" : "transparent",
                color: activeTab === "windows" ? "#FDF6EC" : "#8B6240",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: isMobile ? 14 : 16,
                fontWeight: 600,
                padding: isMobile ? "6px 12px" : "6px 16px",
                border: "1px solid rgba(196,132,90,0.4)",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => { if (activeTab !== "windows") e.currentTarget.style.background = "rgba(196,132,90,0.12)"; }}
              onMouseLeave={(e) => { if (activeTab !== "windows") e.currentTarget.style.background = "transparent"; }}
            >
              {isMobile ? "Panchang & Muhurtas" : "Essential Panchang & Muhurtas"}
            </button>
            <button
              onClick={() => setActiveTab("choghadiya")}
              style={{
                background: activeTab === "choghadiya" ? "#C4845A" : "transparent",
                color: activeTab === "choghadiya" ? "#FDF6EC" : "#8B6240",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: isMobile ? 14 : 16,
                fontWeight: 600,
                padding: isMobile ? "6px 12px" : "6px 16px",
                border: "1px solid rgba(196,132,90,0.4)",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => { if (activeTab !== "choghadiya") e.currentTarget.style.background = "rgba(196,132,90,0.12)"; }}
              onMouseLeave={(e) => { if (activeTab !== "choghadiya") e.currentTarget.style.background = "transparent"; }}
            >
              {isMobile ? "Choghadiya" : "Day & Night Choghadiya"}
            </button>
          </div>

          {activeTab === "windows" ? (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 140 : 200}px, 1fr))`, gap: "1rem" }}>
              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>TITHI</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                  {dayDetails.panchang.tithi}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>NAKSHATRA</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                  {dayDetails.panchang.nakshatra}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>ABHIJIT MUHURAT</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#27ae60", marginTop: 4 }}>
                  {formatTimeRange(dayDetails.muhurta.abhijit)}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>BRAHMA MUHURAT</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#27ae60", marginTop: 4 }}>
                  {formatTimeRange(dayDetails.muhurta.brahma)}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>RAHUKALAM</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#e74c3c", marginTop: 4 }}>
                  {formatTimeRange(dayDetails.muhurta.rahu)}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>YAMAGANDAM</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#d35400", marginTop: 4 }}>
                  {formatTimeRange(dayDetails.muhurta.yama)}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>GULIKA KALAM</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#8e44ad", marginTop: 4 }}>
                  {formatTimeRange(dayDetails.muhurta.gulika)}
                </div>
              </div>

              <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.2)", padding: "12px 16px", borderRadius: 4 }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, color: "#8B6240", textTransform: "uppercase" }}>SUN TIMINGS</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                  {formatTimeRange({ from: dayDetails.muhurta.sunrise, to: dayDetails.muhurta.sunset })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8, color: "#C4845A" }}>DAYTIME CHOGHADIYA</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: "1.5rem" }}>
                {dayDetails.choghadiya.day.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: c.isGood ? "rgba(46, 204, 113, 0.12)" : "rgba(231, 76, 60, 0.08)",
                      borderLeft: `4px solid ${c.isGood ? "#27ae60" : "#e74c3c"}`,
                      borderRadius: 4,
                      padding: "8px 10px",
                    }}
                  >
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: "#6B4423", marginTop: 2 }}>{formatTimeRange(c)}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontWeight: 600, marginBottom: 8, color: "#C4845A" }}>NIGHTTIME CHOGHADIYA</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {dayDetails.choghadiya.night.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: c.isGood ? "rgba(46, 204, 113, 0.12)" : "rgba(231, 76, 60, 0.08)",
                      borderLeft: `4px solid ${c.isGood ? "#27ae60" : "#e74c3c"}`,
                      borderRadius: 4,
                      padding: "8px 10px",
                    }}
                  >
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: "#6B4423", marginTop: 2 }}>{formatTimeRange(c)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}