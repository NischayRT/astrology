"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";

function Footer() {
  return (
    <footer style={{ background: "#1E0C02", padding: "3rem", textAlign: "center", marginTop: "4rem" }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#EDD9B8", marginBottom: 8, fontStyle: "italic" }}>
        Nakshatra Jyotish
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#8B6240", letterSpacing: 2, marginBottom: 20 }}>
        Ancient Wisdom · Modern Guidance
      </div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: 20 }}>
        {["Privacy Policy", "Terms of Service", "Contact Us", "About"].map((l) => (
          <a key={l} href="#" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#8B6240", textDecoration: "none", letterSpacing: 0.5 }}>
            {l}
          </a>
        ))}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, color: "#5C3A1E" }}>
        © 2026 Nakshatra Jyotish · All Rights Reserved
      </div>
    </footer>
  );
}

export default function BookingPage() {
  const [bookData, setBookData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    time: "",
    place: "",
    service: "Complete Janma Kundli Reading",
    language: "Telugu",
    mode: "Online (WhatsApp / Video Call)",
    message: ""
  });

  const handleBooking = (e) => {
    e.preventDefault();
    const fields = [
      { key: "name", label: "Name" },
      { key: "mobile", label: "Mobile / WhatsApp" },
      { key: "email", label: "Email" },
      { key: "dob", label: "Date of Birth" },
      { key: "time", label: "Time of Birth" },
      { key: "place", label: "Place of Birth" },
      { key: "service", label: "Service Selected" },
      { key: "language", label: "Preferred Language" },
      { key: "mode", label: "Consultation Mode" },
      { key: "message", label: "Message / Specific Focus" }
    ];

    let msg = "Hello Sharma garu, I would like to book a consultation:\n\n";
    fields.forEach((f) => {
      const val = bookData[f.key];
      if (val && String(val).trim()) {
        msg += `${f.label}: ${val}\n`;
      }
    });

    const url = `https://wa.me/9849027364?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 16,
    background: "#F9F0E2",
    border: "1px solid rgba(196,132,90,0.35)",
    borderRadius: 2,
    color: "#2C1205",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "1.25rem"
  };

  const labelStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 13,
    color: "#6B4423",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    marginBottom: 6
  };

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ paddingTop: "140px", paddingBottom: "4rem", maxWidth: 900, margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Personalized Vedic Consultations
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.4rem, 5vw, 3.2rem)", fontWeight: 400, color: "#2C1205", margin: "0 0 1rem", fontStyle: "italic" }}>
            Book Your Consultation
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#6B4423", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Fill in your birth details below. Sharma garu conducts detailed Parashari and Astro-Vastu analyses to provide tailored, remedy-focused guidance.
          </p>
        </div>

        {/* Booking Form Card */}
        <div style={{ background: "#FAF2E6", border: "1px solid rgba(196,132,90,0.3)", borderRadius: 6, padding: "2.5rem 2rem", boxShadow: "0 10px 30px rgba(196,132,90,0.08)" }}>
          <form onSubmit={handleBooking}>
            
            {/* Step 1: Personal Details */}
            <div style={{ borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#C4845A", margin: 0 }}>
                1. Contact Information
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={bookData.name}
                  onChange={(e) => setBookData({ ...bookData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9959 629 678"
                  value={bookData.mobile}
                  onChange={(e) => setBookData({ ...bookData, mobile: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={bookData.email}
                  onChange={(e) => setBookData({ ...bookData, email: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Step 2: Birth Details */}
            <div style={{ borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "1rem", marginBottom: "1.5rem", marginTop: "1rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#C4845A", margin: 0 }}>
                2. Janma (Birth) Particulars
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={bookData.dob}
                  onChange={(e) => setBookData({ ...bookData, dob: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Exact Time of Birth *</label>
                <input
                  type="time"
                  required
                  value={bookData.time}
                  onChange={(e) => setBookData({ ...bookData, time: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Place of Birth (City/Town) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Telangana"
                  value={bookData.place}
                  onChange={(e) => setBookData({ ...bookData, place: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Step 3: Service & Consultation Setup */}
            <div style={{ borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "1rem", marginBottom: "1.5rem", marginTop: "1rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#C4845A", margin: 0 }}>
                3. Consultation Preferences
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Service Required</label>
                <select
                  value={bookData.service}
                  onChange={(e) => setBookData({ ...bookData, service: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Complete Janma Kundli Reading">Complete Janma Kundli Reading</option>
                  <option value="Marriage Compatibility (Kundali Milan)">Marriage Compatibility (Kundali Milan)</option>
                  <option value="On-Site Vastu / Floor Plan Audit">On-Site Vastu / Floor Plan Audit</option>
                  <option value="Career & Financial Prosperity Reading">Career & Financial Trajectory</option>
                  <option value="Dosha Nivarana Pooja / Homam">Dosha Nivarana Pooja / Homam</option>
                  <option value="Deity Prana Pratishtha">Deity Prana Pratishtha</option>
                  <option value="Gemstone & Rudraksha Analysis">Gemstone & Rudraksha Analysis</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Preferred Language</label>
                <select
                  value={bookData.language}
                  onChange={(e) => setBookData({ ...bookData, language: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Consultation Mode</label>
                <select
                  value={bookData.mode}
                  onChange={(e) => setBookData({ ...bookData, mode: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Online (WhatsApp / Video Call)">Online (WhatsApp / Video Call)</option>
                  <option value="In-Person at Hyderabad Jyotisyalayam">In-Person at Hyderabad Jyotisyalayam</option>
                  <option value="On-Site Property Visit (for Vastu)">On-Site Property Visit (for Vastu)</option>
                </select>
              </div>
            </div>

            <label style={labelStyle}>Specific Questions or Intentions (Optional)</label>
            <textarea
              rows={3}
              placeholder="e.g. Marriage timing, business venture, change of career dasha analysis..."
              value={bookData.message}
              onChange={(e) => setBookData({ ...bookData, message: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "1rem",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18,
                fontWeight: 600,
                background: "#C4845A",
                color: "#FDF6EC",
                border: "none",
                padding: "16px",
                borderRadius: 2,
                cursor: "pointer",
                letterSpacing: 1.2,
                transition: "background 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#a36e4b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#C4845A")}
            >
              Confirm & Book via WhatsApp →
            </button>
          </form>
        </div>

      </div>

      <Footer />
    </div>
  );
}