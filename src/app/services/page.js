"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import Footer from "../../components/Footer";

const SERVICES_DATA = [
  {
    id: "janma-kundli",
    category: "JANMA KUNDLI",
    title: "Kundali Reading — The blueprint of your destiny",
    img: "/janmaKundali.png",
    description: [
      "Your birth chart is a sacred map drawn by the cosmos at the moment of your first breath. It reveals your strengths, your karmic patterns, the timing of major life events, and the deities whose grace will support you most powerfully.",
      "A complete Kundali reading with Sharma garu spans your nature, career, marriage, health, finances, and the planetary periods (dashas) that govern your life unfolding. We focus on practical guidance — not abstract predictions."
    ],
    features: [
      "Detailed Janma Kundli analysis using Vedic Parashari system",
      "Vimshottari dasha breakdown with key timing predictions",
      "Career & financial trajectory based on 10th and 2nd house lords",
      "Marriage compatibility & auspicious timing for major decisions",
      "Personalized remedial measures — mantras, gems, charity"
    ]
  },
  {
    id: "vaastu-shastra",
    category: "VAASTU SHASTRA",
    title: "Vaastu Consultation — Harmonize your space with the five elements",
    img: "/vastu.png",
    description: [
      "Vaastu Shastra is the ancient science of architecture that aligns your home or workspace with cosmic energies. When the five elements — earth, water, fire, air, and space — flow harmoniously, prosperity, health, and peace follow naturally.",
      "Sharma garu offers Vaastu consultation for both new construction and existing properties, with practical, low-disruption remedies that don't require structural changes when possible."
    ],
    features: [
      "Direction-by-direction analysis (eight zones + central Brahmasthan)",
      "Identification of doshas: vedha, marma, and elemental imbalances",
      "Practical remedies using yantras, crystals, plants, and color",
      "Plot selection guidance for new home buyers",
      "Office & commercial space Vaastu for business prosperity"
    ]
  },
  {
    id: "poojas-homas",
    category: "POOJAS & HOMAS",
    title: "Vedic Remedies — Ancient solutions for modern challenges",
    img: "/astro.webp",
    description: [
      "When planetary doshas create obstacles — in marriage, career, health, or finances — Vedic remedies offer profound and time-tested solutions. From simple mantras to elaborate homas, the right remedy at the right time can shift the entire trajectory of a situation.",
      "All remedies are conducted by qualified vaidikas under Sharma garu's guidance, with strict adherence to shastric procedures. We perform homas at our jyotisyalayam, at your home, or at sacred temples across South India."
    ],
    features: [
      "Navagraha homam for planetary harmony",
      "Mahamrityunjaya homam for health & longevity",
      "Sudarshana homam for protection from negative energies",
      "Lakshmi & Kubera homams for wealth and prosperity",
      "Ganapati homam for success in new ventures",
      "Subramanya Pasupatha homam for victory over enemies & obstacles",
      "Aghora Pasupatha homam for removing severe doshas & negative influences",
      "Japa Tarpana homam to remove negative energy & restore planetary harmony",
      "Custom homas for specific doshas (Manglik, Kalsarpa, Pitru, etc.)"
    ]
  },
  {
    id: "deity-installation",
    category: "DEITY INSTALLATION",
    title: "Devalaya Pratista — Inviting the divine into your home or temple",
    img: "/yantra.webp",
    description: [
      "The proper installation (prana pratishtha) of a deity is one of the most sacred ceremonies in Sanatana Dharma. When done correctly, the murti becomes a true vessel for divine presence — a focal point for daily worship and family blessings.",
      "Sharma garu specializes in deity installation for home shrines, family temples, and community mandirs across Telangana and Andhra Pradesh. Each ceremony follows the agama shastras strictly."
    ],
    features: [
      "Site selection & muhurat determination",
      "Sankalpa, Kalashapuja, and Vastu shanti",
      "Prana pratishtha mantras with full vidhana",
      "Abhishekam and alankaram of the murti",
      "Annadanam & community blessing arrangements",
      "Post-ceremony guidance for daily worship",
      "Custom estimate based on scope"
    ]
  },
  {
    id: "gems-rudraksha",
    category: "GEMS & RUDRAKSHA",
    title: "Gemstone & Rudraksha Recommendation — Stones aligned to your unique chart",
    img: "/gem.png",
    description: [
      "A gemstone or Rudraksha bead is not a generic remedy — it is a precise prescription based on your birth chart, current dasha, and life situation. The wrong stone can cause more harm than no stone at all.",
      "Sharma garu carefully analyses your chart before recommending any stone or bead, and our store sources only verified, lab-certified specimens with full provenance documentation."
    ],
    features: [
      "Chart-based gemstone analysis (not generic prescriptions)",
      "Lab-certified natural gemstones",
      "Original Nepal Rudraksha with authenticity documentation",
      "Energization (mantra siddhi) before delivery",
      "Guidance on weight, metal, and finger placement"
    ]
  }
];

export default function ServicesPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 } 
    );

    const timeoutId = setTimeout(() => {
      const animatedElements = document.querySelectorAll(".animate-on-scroll");
      animatedElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isMobile]);

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      
      {/* Injected CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-on-scroll {
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .content-box.animate-on-scroll {
          transform: translateY(60px);
        }
        .content-box.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .side-img-left.animate-on-scroll {
          transform: translate(-130px, -65%);
        }
        .side-img-left.is-visible {
          opacity: 0.6;
          transform: translate(0, -60%);
        }

        .side-img-right.animate-on-scroll {
          transform: translate(130px, -65%);
        }
        .side-img-right.is-visible {
          opacity: 0.6;
          transform: translate(0, -60%);
        }

        .mobile-bottom-img.animate-on-scroll {
          transform: translateY(30px);
        }
        .mobile-bottom-img.is-visible {
          opacity: 0.6;
          transform: translateY(0);
        }

        .rotate-slow {
          animation: spinSlow 50s linear infinite;
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />

      {/* --- SERVICE BANNER (standard design, smaller title + shorter copy) --- */}
      <PageBanner
        compact
        eyebrow="Our Vedic Offerings"
        title="Sacred Services for Modern Lives"
        subtitle="Twenty years of Vedic practice — focused consultations and ceremonies to guide you forward."
      />

      {/* Services List */}
      <div style={{ overflow: "hidden" }}>
        {SERVICES_DATA.map((service, index) => {
          const bg = index % 2 === 0 ? "#FDF6EC" : "#F5E8D2";
          const isEven = index % 2 === 0;
          const imgAnimationClass = isEven ? "side-img-left" : "side-img-right";
          const imgPosStyle = isEven ? { left: "-25%" } : { right: "-26%" };

          return (
            <section key={service.id} id={service.id} style={{ background: bg, padding: isMobile ? "4rem 1.5rem 2rem" : "4rem 2rem", borderTop: "1px solid rgba(196,132,90,0.15)", position: "relative" }}>
              
              <div style={{ maxWidth: 850, margin: "0 auto", position: "relative" }}>
                
                {/* Service Header */}
                <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 10 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: "#C4845A", letterSpacing: 3, fontWeight: 600, marginBottom: 16 }}>
                    {service.category}
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "#2C1205", fontWeight: 400, lineHeight: 1.3 }}>
                    {service.title.split('—')[0]}
                    <span style={{ display: "block", fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#8B6240", marginTop: 8 }}>
                      — {service.title.split('—')[1]}
                    </span>
                  </h2>
                </div>

                {/* Relative Wrapper for Content and Background Image */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  
                  {/* Background Rotating Image (Desktop) */}
                  {!isMobile && (
                    <div 
                      className={`animate-on-scroll ${imgAnimationClass}`} 
                      style={{
                        position: "absolute",
                        top: "60%",
                        ...imgPosStyle,
                        width: "450px",
                        height: "450px",
                        zIndex: 0,
                        pointerEvents: "none",
                        mixBlendMode: "multiply",
                      }}
                    >
                      <Image 
                        src={service.img} 
                        alt="" 
                        fill 
                        style={{ objectFit: "contain" }} 
                        className="rotate-slow"
                      />
                    </div>
                  )}

                  {/* Main Content Box */}
                  <div 
                    className="animate-on-scroll content-box" 
                    style={{ 
                      position: "relative", 
                      zIndex: 10, 
                      width: "100%",
                      background: bg === "#FDF6EC" ? "rgba(253, 246, 236, 0.96)" : "rgba(245, 232, 210, 0.96)", 
                      border: "1px solid rgba(196,132,90,0.2)", 
                      borderRadius: 4, 
                      padding: isMobile ? "2.5rem 1.5rem" : "2.5rem", 
                      boxShadow: "0 10px 40px rgba(196,132,90,0.06)",
                      backdropFilter: "blur(4px)" 
                    }}
                  >
                    
                    {/* Descriptions */}
                    <div style={{ marginBottom: "2rem" }}>
                      {service.description.map((paragraph, i) => (
                        <p key={i} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#2C1205", lineHeight: 1.8, marginBottom: i === service.description.length - 1 ? 0 : "1.25rem" }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Features List */}
                    <div style={{ borderTop: "1px solid rgba(196,132,90,0.2)", paddingTop: "2rem", marginBottom: "2rem" }}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.25rem" }}>
                        {service.features.map((feature, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: "#6B4423", lineHeight: 1.5 }}>
                            <span style={{ color: "#C4845A", fontSize: 14, marginTop: 4 }}>✦</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div style={{ textAlign: "center" }}>
                      <a 
                        href={`https://wa.me/918499881447?text=${encodeURIComponent(`Hello, I would like to enquire about the ${service.category} service.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600,
                          background: "#C4845A", color: "#FDF6EC", border: "none", padding: "14px 36px", borderRadius: 2, 
                          cursor: "pointer", letterSpacing: 1, textDecoration: "none", transition: "background 0.3s ease",
                          width: isMobile ? "100%" : "auto"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#a36e4b"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#C4845A"}
                      >
                        Enquire on WhatsApp
                      </a>
                    </div>

                  </div>

                  {/* Background Rotating Image (Mobile) */}
                  {isMobile && (
                    <div 
                      className="animate-on-scroll mobile-bottom-img" 
                      style={{
                        position: "relative",
                        width: "260px",
                        height: "220px",
                        zIndex: 0,
                        pointerEvents: "none",
                        mixBlendMode: "multiply",
                        marginTop: "-2.5rem", 
                      }}
                    >
                      <Image 
                        src={service.img} 
                        alt="" 
                        fill 
                        style={{ objectFit: "contain" }} 
                        className="rotate-slow"
                      />
                    </div>
                  )}

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Intro Call Footer CTA */}
      <section style={{ background: "#2C1205", padding: "6rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#C4845A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Begin Your Journey
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.6rem)", color: "#FDF6EC", fontWeight: 400, margin: "0 0 1.5rem", fontStyle: "italic" }}>
            Not Sure Where to Start?
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#EDD9B8", lineHeight: 1.7, marginBottom: "3rem" }}>
            Book a 20-minute introductory call. Sharma garu will help you identify which service best fits your current situation — with no pressure to commit beyond the first conversation.
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem", justifyContent: "center" }}>
            <button style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600,
              background: "#C4845A", color: "#FDF6EC", border: "none", padding: "14px 32px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
            }}>Book Intro Call</button>
            <a 
              href="https://wa.me/918499881447?text=Hello%2C%20I%20am%20not%20sure%20which%20service%20I%20need.%20Can%20we%20have%20an%20introductory%20chat%3F"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, display: "inline-block",
                background: "transparent", color: "#C4845A", border: "1.5px solid rgba(196,132,90,0.5)", padding: "13px 28px", borderRadius: 2, cursor: "pointer", letterSpacing: 1, textDecoration: "none"
            }}>
              Send a Message
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}