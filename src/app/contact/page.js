// src/app/contact/page.js
"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import LocationMap from "../../components/LocationMap";
import Footer from "../../components/Footer";
import { COLORS, cardStyleAlt, cardStyle, sectionEyebrow } from "../../lib/theme";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "General Inquiry",
    dob: "",
    dobUnknown: false,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let msg = `Hello, I would like to inquire about a consultation:\n\n`;
    msg += `Name: ${formData.name}\n`;
    if (formData.phone) msg += `Phone: ${formData.phone}\n`;
    if (formData.email) msg += `Email: ${formData.email}\n`;
    if (formData.dob && !formData.dobUnknown) {
      msg += `Date of Birth: ${formData.dob}\n`;
    } else if (formData.dobUnknown) {
      msg += `Date of Birth: Not known (please advise)\n`;
    }
    msg += `Service: ${formData.service}\n\n`;
    if (formData.message) msg += `Message: ${formData.message}`;

    const url = `https://wa.me/9849027364?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 16,
    background: "#F9F0E2",
    border: "1px solid rgba(196,132,90,0.35)",
    borderRadius: 2,
    color: "#2C1205",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "1.25rem",
  };

  const labelStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 13,
    color: "#6B4423",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <Navbar />

      {/* Standard hero banner — same design as the Services page */}
      <PageBanner
        compact
        eyebrow="Reach Out to Guruji"
        title="Contact & Location"
        subtitle="Have a question, or wish to schedule an in-person appointment at our Jyotisyalayam? We're here to guide you."
      />

      {/* Content Section — same bordered/alternating rhythm as the Services & About pages */}
      <section style={{ background: COLORS.bg, borderTop: "1px solid rgba(196,132,90,0.15)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
            {/* Info Card + Map */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ ...cardStyleAlt, padding: "2.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: COLORS.ink, margin: "0 0 1.5rem", fontStyle: "italic" }}>
                  KSR Astro 
                </h3>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={labelStyle}>Office Location</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: COLORS.ink, lineHeight: 1.6, margin: 0 }}>
                    Hyderabad, Telangana, India
                    <br />
                    (In-person consultations by prior appointment)
                  </p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={labelStyle}>Direct Phone & WhatsApp</div>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: COLORS.ink, margin: 0 }}>
                    +91 9959 629 678
                  </p>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <div style={labelStyle}>Consultation Hours</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: COLORS.inkSoft, margin: 0, lineHeight: 1.6 }}>
                    Monday – Saturday: 9:00 AM – 7:30 PM IST
                    <br />
                    Sunday: 10:00 AM – 2:00 PM IST
                  </p>
                </div>

                <a
                  href="https://wa.me/9849027364"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                    background: "#2C1205",
                    color: "#FDF6EC",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 16,
                    fontWeight: 600,
                    padding: "12px 24px",
                    borderRadius: 2,
                    textDecoration: "none",
                    letterSpacing: 1,
                    boxSizing: "border-box",
                  }}
                >
                  Direct Chat on WhatsApp →
                </a>
              </div>

              {/* Location Map */}
              <LocationMap height={260} />
            </div>

            {/* Form Card */}
            <div style={{ ...cardStyle, padding: "2.5rem" }}>
              <div style={sectionEyebrow}>Send an Inquiry</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: COLORS.ink, margin: "0 0 1.5rem", fontStyle: "italic" }}>
                Schedule a Consultation
              </h3>

              <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>WhatsApp / Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <label style={labelStyle}>Service of Interest</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={inputStyle}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Janma Kundli Analysis">Janma Kundli (Birth Chart Reading)</option>
                  <option value="Vastu Consultation">Vastu Shastra Site / Floor Plan Analysis</option>
                  <option value="Kundali Milan (Marriage Matching)">Kundali Milan (Marriage Matching)</option>
                  <option value="Poojas & Vedic Remedies">Poojas & Homas</option>
                  <option value="Gemstone / Rudraksha Prescription">Gemstones & Rudraksha Recommendation</option>
                </select>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Date of Birth</label>
                  <input
                    type="date"
                    disabled={formData.dobUnknown}
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    style={{ ...inputStyle, opacity: formData.dobUnknown ? 0.4 : 1, marginBottom: 6 }}
                  />
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B4423", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.dobUnknown}
                      onChange={(e) => setFormData({ ...formData, dobUnknown: e.target.checked })}
                    />
                    Birth date or exact time not known (Prashna / Name-based advice)
                  </label>
                </div>

                <label style={labelStyle}>Your Question or Request</label>
                <textarea
                  rows={4}
                  placeholder="Share any specific situation or questions you would like Sharma garu to evaluate..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                />

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 17,
                    fontWeight: 600,
                    background: COLORS.accent,
                    color: "#FDF6EC",
                    border: "none",
                    padding: "14px",
                    borderRadius: 2,
                    cursor: "pointer",
                    letterSpacing: 1,
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#a36e4b")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.accent)}
                >
                  Send Message via WhatsApp →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}