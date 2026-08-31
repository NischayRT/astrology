// src/app/about/page.js
"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import LocationMap from "../../components/LocationMap";
import Footer from "../../components/Footer";
import { COLORS, cardStyle, cardStyleAlt, sectionEyebrow } from "../../lib/theme";

export default function AboutPage() {
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
        eyebrow="Tradition & Lineage"
        title="Preserving Sacred Vedic Wisdom"
        subtitle="Two decades of disciplined practice in Parashari Jyotish, Vaastu Shastra, and Agamic rituals — clarity, purpose, and energetic balance."
      />

      {/* Philosophy Section — same bordered/alternating rhythm as the Services page */}
      <section style={{ background: COLORS.bg, borderTop: "1px solid rgba(196,132,90,0.15)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3.5rem", alignItems: "center" }}>
            <div>
              <div style={sectionEyebrow}>Our Philosophy</div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.6rem)", color: COLORS.ink, fontWeight: 400, margin: "0 0 1.5rem", fontStyle: "italic" }}>
                Astrology as a Compass, Not Fatalism
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: COLORS.ink, lineHeight: 1.8, marginBottom: "1.25rem" }}>
                At KSR Astro , Vedic Jyotish is not practiced to induce anxiety or fatalistic predictions. Your birth chart is a sacred cosmic blueprint that illuminates your latent karmic predispositions, natural strengths, and pivotal planetary cycles (dashas).
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: COLORS.inkSoft, lineHeight: 1.8 }}>
                Under Sharma garu&rsquo;s guidance, our focus remains on practical remedies—shastric homas, yantra placement, mantra sadhana, and non-invasive architectural alignments—that empower you to overcome obstacles and make confident life decisions.
              </p>
            </div>

            <div style={{ ...cardStyleAlt, padding: "2.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: COLORS.ink, margin: "0 0 1.25rem", fontStyle: "italic" }}>
                Core Pillars of Practice
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { title: "Strict Shastric Adherence", desc: "Authentic Parashari calculations and Agamic vidhana with zero generic shortcuts." },
                  { title: "Practical Vastu Remedies", desc: "Non-destructive corrections utilizing elemental balancing, yantras, and directional flow." },
                  { title: "Transparent Consultations", desc: "Honest evaluations with actionable timing analysis for career, health, and family life." },
                  { title: "Verified Vedic Remedials", desc: "Lab-certified natural gemstones, energised Rudraksha beads, and customized homams." },
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.accent, marginTop: 2, fontSize: 15 }}>✦</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, color: COLORS.ink }}>{item.title}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, color: COLORS.inkSoft, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us Section — alternating background, same as the Services page rhythm */}
      <section style={{ background: COLORS.bgAlt, borderTop: "1px solid rgba(196,132,90,0.15)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={sectionEyebrow}>Find Us</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.2rem)", color: COLORS.ink, fontWeight: 400, margin: 0, fontStyle: "italic" }}>
              KSR Astro , Hyderabad
            </h2>
          </div>
          <LocationMap />
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ background: COLORS.bg, borderTop: "1px solid rgba(196,132,90,0.15)", padding: "5rem 1.5rem" }}>
        <div style={{ ...cardStyle, maxWidth: 850, margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={sectionEyebrow}>Inquire Directly</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", color: COLORS.ink, fontWeight: 400, margin: 0, fontStyle: "italic" }}>
              Schedule a Consultation
            </h2>
          </div>

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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
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
      </section>

      <Footer />
    </div>
  );
}