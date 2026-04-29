// src/components/HinduCalendar.js
"use client";
import { useState } from "react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HINDI_DAYS = ["रवि", "सोम", "मंगल", "बुध", "गुरू", "शुक्र", "शनि"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// MOCK DATA: Simulating a single monthly API call or database fetch.
const mockMonthlyData = {
  1: { tithi: "Chaturdashi", paksha: "Shukla", sun: "6:23 - 6:38", moon: "Kanya", nak: "Uttara Phalguni", event: "" },
  2: { tithi: "Purnima", paksha: "Shukla", sun: "6:22 - 6:38", moon: "Kanya", nak: "Hasta", event: "Chaitra Purnima" },
  3: { tithi: "Pratipada", paksha: "Krishna", sun: "6:21 - 6:39", moon: "Kanya", nak: "Chitra", event: "Good Friday" },
  4: { tithi: "Dwitiya", paksha: "Krishna", sun: "6:20 - 6:39", moon: "Tula", nak: "Swati", event: "" },
  5: { tithi: "Tritiya", paksha: "Krishna", sun: "6:19 - 6:39", moon: "Tula", nak: "Vishaka", event: "Easter" },
  6: { tithi: "Chaturthi", paksha: "Krishna", sun: "6:18 - 6:40", moon: "Vrischika", nak: "Anuradha", event: "" },
  7: { tithi: "Panchami", paksha: "Krishna", sun: "6:17 - 6:40", moon: "Vrischika", nak: "Jyeshta", event: "" },
  13: { tithi: "Ekadashi", paksha: "Krishna", sun: "6:11 - 6:42", moon: "Kumbha", nak: "Dhanishta", event: "Kamada Ekadashi" },
  14: { tithi: "Dwadashi", paksha: "Krishna", sun: "6:11 - 6:43", moon: "Kumbha", nak: "Shatabhisha", event: "Ambedkar Jayanti" },
  17: { tithi: "Amavasya", paksha: "Krishna", sun: "6:08 - 6:44", moon: "Meena", nak: "Revati", event: "Vaisakha Amavasya" },
  21: { tithi: "Panchami", paksha: "Shukla", sun: "6:05 - 6:46", moon: "Vrishabha", nak: "Mrigashirsha", event: "" },
  30: { tithi: "Chaturdashi", paksha: "Shukla", sun: "5:58 - 6:49", moon: "Kanya", nak: "Chitra", event: "" },
};

export default function HinduCalendar() {
  // Hardcoded to April 2026 to match the data layout
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); 
  const [activeDay, setActiveDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Extract all festivals for the current month
  const monthlyFestivals = Object.entries(mockMonthlyData)
    .filter(([_, data]) => data.event !== "")
    .map(([day, data]) => ({ day: parseInt(day), event: data.event }));

  return (
    <div style={{ background: "#FDF6EC", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 8, padding: "2rem", maxWidth: 1000, margin: "0 auto", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      
      {/* Calendar Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <button onClick={handlePrevMonth} style={{ background: "none", border: "1px solid #C4845A", color: "#C4845A", padding: "8px 16px", borderRadius: 4, cursor: "pointer" }}>← Prev</button>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: "#2C1205", margin: 0 }}>
            {MONTHS[month]} {year}
          </h2>
          <div style={{ fontSize: 15, color: "#C4845A", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
            Chaitra - Vaisakha 2083
          </div>
        </div>
        <button onClick={handleNextMonth} style={{ background: "none", border: "1px solid #C4845A", color: "#C4845A", padding: "8px 16px", borderRadius: 4, cursor: "pointer" }}>Next →</button>
      </div>

      {/* Days of the week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "1rem", textAlign: "center" }}>
        {DAYS_OF_WEEK.map((day, i) => (
          <div key={day} style={{ paddingBottom: 8, borderBottom: "2px solid rgba(196,132,90,0.2)" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#2C1205", textTransform: "uppercase" }}>{day}</div>
            <div style={{ fontSize: 14, color: "#8B6240", fontWeight: 600 }}>{HINDI_DAYS[i]}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
        {days.map((day, index) => {
          const isActive = activeDay === day;
          const dayData = day ? mockMonthlyData[day] : null;

          return (
            <div 
              key={index} 
              onClick={() => day && dayData && setActiveDay(day)}
              style={{
                minHeight: 110,
                border: day ? (isActive ? "2px solid #C4845A" : "1px solid rgba(196,132,90,0.2)") : "none", 
                background: day ? (isActive ? "rgba(196,132,90,0.1)" : "#FDF6EC") : "transparent",
                borderRadius: 4, 
                padding: "8px", 
                cursor: dayData ? "pointer" : "default",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {day && (
                <>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: "#2C1205", fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
                    {day}
                  </div>
                  
                  {dayData ? (
                    <>
                      <div style={{ fontSize: 13, color: "#6B4423", fontWeight: 600, marginBottom: 4 }}>
                        {dayData.tithi}
                      </div>
                      <div style={{ fontSize: 11, color: "#8B6240" }}>
                        <span style={{ color: "#C4845A" }}>☼</span> {dayData.sun}
                      </div>
                      {dayData.event && (
                        <div style={{ fontSize: 11, color: "#D32F2F", fontWeight: 600, marginTop: "auto", paddingTop: 4 }}>
                          • {dayData.event}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: 11, color: "rgba(107, 68, 35, 0.4)", marginTop: "auto" }}>No data</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Info Panel (Shows when a date is clicked) */}
      {activeDay && mockMonthlyData[activeDay] && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(196,132,90,0.05)", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 4, animation: "fadeIn 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "1rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: "#2C1205", margin: 0 }}>
              Detailed Panchang: {MONTHS[month]} {activeDay}, {year}
            </h3>
            <button onClick={() => setActiveDay(null)} style={{ background: "none", border: "none", color: "#C4845A", fontSize: 24, cursor: "pointer" }}>×</button>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: 12, color: "#8B6240", textTransform: "uppercase", letterSpacing: 1 }}>Tithi</div>
              <div style={{ fontSize: 18, color: "#2C1205", fontWeight: 600 }}>{mockMonthlyData[activeDay].paksha} {mockMonthlyData[activeDay].tithi}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8B6240", textTransform: "uppercase", letterSpacing: 1 }}>Nakshatra</div>
              <div style={{ fontSize: 18, color: "#2C1205", fontWeight: 600 }}>{mockMonthlyData[activeDay].nak}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8B6240", textTransform: "uppercase", letterSpacing: 1 }}>Moon Sign (Rasi)</div>
              <div style={{ fontSize: 18, color: "#2C1205", fontWeight: 600 }}>{mockMonthlyData[activeDay].moon}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8B6240", textTransform: "uppercase", letterSpacing: 1 }}>Sunrise - Sunset</div>
              <div style={{ fontSize: 18, color: "#2C1205", fontWeight: 600 }}>{mockMonthlyData[activeDay].sun}</div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Festivals & Events List */}
      <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px dashed rgba(196,132,90,0.4)" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#2C1205", marginBottom: "1.5rem", fontStyle: "italic" }}>
          Festivals & Important Days in {MONTHS[month]}
        </h3>
        {monthlyFestivals.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {monthlyFestivals.map((fest) => (
              <div key={fest.day} onClick={() => setActiveDay(fest.day)} style={{ display: "flex", gap: 12, alignItems: "center", background: "#F9F0E2", padding: "12px 16px", borderRadius: 4, cursor: "pointer", border: "1px solid rgba(196,132,90,0.15)" }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: "#C4845A", fontWeight: 700 }}>
                  {fest.day}
                </div>
                <div>
                  <div style={{ fontSize: 15, color: "#2C1205", fontWeight: 600 }}>{fest.event}</div>
                  <div style={{ fontSize: 13, color: "#8B6240" }}>{MONTHS[month]} {year}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#8B6240" }}>No major festivals recorded for this month.</p>
        )}
      </div>

    </div>
  );
}