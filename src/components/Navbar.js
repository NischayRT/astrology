"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // NEW: Imports route detection
import { NAV_LINKS } from "../data/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect if the user is currently on the root Home Page
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

  // DYNAMIC STYLING:
  // If on the Home Page, start transparent and become solid on scroll.
  // If on ANY OTHER page, ALWAYS stay solid so it doesn't clash with the background.
  const navBackground = (isHome && !scrolled) ? "transparent" : "rgba(253, 246, 236, 0.95)";
  const navBlur = (isHome && !scrolled) ? "none" : "blur(8px)";
  const navBorder = (isHome && !scrolled) ? "none" : "1px solid rgba(196, 132, 90, 0.2)";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: navBackground,
      backdropFilter: navBlur,
      borderBottom: navBorder,
      transition: "all 0.4s ease",
      padding: isMobile ? "0 1.5rem" : "0 3rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        
        {/* Logo - Acts as a button to go back home */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.webp" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#3D1F0A", lineHeight: 1.1 }}>Nakshatra</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, color: "#C4845A", letterSpacing: 2, textTransform: "uppercase" }}>Jyotish</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "2.2rem" }}>
            {NAV_LINKS.map(link => {
              // DYNAMIC ROUTING:
              // Make sure 'Daily Horoscope' matches the ID we used on the home page
              const targetId = link === "Daily Horoscope" ? "daily-horoscope" : link.toLowerCase();
              
              // If we are on the Home Page, scroll to #section. 
              // If we are on the Horoscope page, route to /#section to force it to go Home first.
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

        {/* CTA Button */}
        <button style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600,
          background: "#C4845A", color: "#FDF6EC", border: "none", padding: "10px 20px", borderRadius: 2, cursor: "pointer",
          letterSpacing: 1, whiteSpace: "nowrap", transition: "background 0.3s ease"
        }}>
          Get Consultation
        </button>
      </div>
    </nav>
  );
}