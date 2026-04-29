"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NAV_LINKS } from "../data/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const navBackground = (isHome && !scrolled && !isMenuOpen) ? "transparent" : "rgba(253, 246, 236, 0.95)";
  const navBlur = (isHome && !scrolled && !isMenuOpen) ? "none" : "blur(8px)";
  const navBorder = (isHome && !scrolled && !isMenuOpen) ? "none" : "1px solid rgba(196, 132, 90, 0.2)";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: navBackground,
        backdropFilter: navBlur,
        borderBottom: navBorder,
        transition: "all 0.4s ease",
        // FIX 1: Reduced outer padding on mobile to save 16px of horizontal space
        padding: isMobile ? "0 1rem" : "0 3rem", 
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          
          {/* Logo */}
          <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            {/* FIX 2: Slightly shrink the logo image on mobile */}
            <Image src="/logo.webp" alt="Logo" width={isMobile ? 32 : 40} height={isMobile ? 32 : 40} style={{ objectFit: "contain" }} />
            <div>
              {/* FIX 3: Shrink logo text slightly on mobile */}
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "#3D1F0A", lineHeight: 1.1 }}>Nakshatra</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 10 : 12, color: "#C4845A", letterSpacing: isMobile ? 1 : 2, textTransform: "uppercase" }}>Jyotish</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div style={{ display: "flex", gap: "2.2rem" }}>
              {NAV_LINKS.map(link => {
                const targetId = link === "Daily Horoscope" ? "daily-horoscope" : link.toLowerCase();
                const href = isHome ? `#${targetId}` : `/#${targetId}`;
                
                return (
                  <Link key={link} href={href} style={{ 
                    fontFamily: "'Cormorant Garamond', Georgia, serif", 
                    fontSize: 16, color: "#5C3A1E", textDecoration: "none", letterSpacing: 0.5 
                  }}>
                    {link}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side: CTA & Hamburger */}
          {/* FIX 4: Reduced the gap between the button and hamburger on mobile */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "0.25rem" : "1rem" }}>
            <button style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", 
              // FIX 5: Shrunk button font size, inner padding, and letter-spacing for mobile
              fontSize: isMobile ? 13 : 15, 
              fontWeight: 600,
              background: "#C4845A", color: "#FDF6EC", border: "none", 
              padding: isMobile ? "6px 8px" : "10px 20px", 
              borderRadius: 2, cursor: "pointer",
              letterSpacing: isMobile ? 0.5 : 1, 
              whiteSpace: "nowrap", transition: "background 0.3s ease"
            }}>
              Get Consultation
            </button>

            {/* Mobile Hamburger Icon */}
            {isMobile && (
              <button 
                onClick={() => setIsMenuOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
              >
                {/* FIX 6: Scaled the SVG down slightly from 28px to 24px */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3D1F0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY & DRAWER */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
          background: "rgba(44, 18, 5, 0.5)", backdropFilter: "blur(4px)",
          opacity: isMenuOpen ? 1 : 0, 
          pointerEvents: isMenuOpen ? "auto" : "none",
          transition: "opacity 0.4s ease"
        }}>
          {/* Drawer */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "75%", maxWidth: 300,
            background: "#FDF6EC", padding: "2rem 1.5rem", display: "flex", flexDirection: "column",
            transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "-5px 0 25px rgba(0,0,0,0.15)"
          }}>
            
            {/* Close Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3rem" }}>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D1F0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {NAV_LINKS.map(link => {
                const targetId = link === "Daily Horoscope" ? "daily-horoscope" : link.toLowerCase();
                const href = isHome ? `#${targetId}` : `/#${targetId}`;
                
                return (
                  <Link 
                    key={link} 
                    href={href} 
                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                    style={{ 
                      fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#2C1205", 
                      textDecoration: "none", borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "1rem"
                    }}
                  >
                    {link}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}