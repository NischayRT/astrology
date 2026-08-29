// src/components/Navbar.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NAV_LINKS } from "../data/constants";

const ROUTES = {
  Services: "/services",
  Calendar: "/calendar",
  Contact: "/contact",
  About: "/about",
};

function getHref(link, isHome) {
  if (ROUTES[link]) return ROUTES[link];
  const targetId = link.toLowerCase().replace(/\s+/g, "-");
  return isHome ? `#${targetId}` : `/#${targetId}`;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
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
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navBackground = isHome && !scrolled && !isMenuOpen ? "transparent" : "rgba(253, 246, 236, 0.95)";
  const navBlur = isHome && !scrolled && !isMenuOpen ? "none" : "blur(8px)";
  const navBorder = isHome && !scrolled && !isMenuOpen ? "none" : "1px solid rgba(196, 132, 90, 0.2)";

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          padding-bottom: 6px;
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 100%;
          bottom: 0;
          height: 2px;
          background: #C4845A;
          transition: right 0.25s ease;
        }
        .nav-link:hover {
          color: #C4845A !important;
        }
        .nav-link:hover::after {
          right: 0;
        }
        .nav-link.active {
          color: #C4845A !important;
          font-weight: 600;
        }
        .nav-link.active::after {
          right: 0;
        }

        .nav-link-mobile {
          position: relative;
          transition: color 0.25s ease, padding-left 0.25s ease;
        }
        .nav-link-mobile:hover {
          color: #C4845A !important;
          padding-left: 6px;
        }
        .nav-link-mobile.active {
          color: #C4845A !important;
          font-weight: 700;
        }
        .nav-link-mobile.active::before {
          content: "";
          position: absolute;
          left: -14px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C4845A;
        }

        .cta-btn {
          transition: background 0.25s ease, transform 0.15s ease;
          display: inline-block;
          text-decoration: none;
        }
        .cta-btn:hover {
          background: #a36e4b !important;
        }
        .cta-btn:active {
          transform: scale(0.97);
        }

        .hamburger-btn {
          transition: background 0.2s ease;
          border-radius: 4px;
        }
        .hamburger-btn:hover {
          background: rgba(196,132,90,0.12);
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: navBackground,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          borderBottom: navBorder,
          transition: "all 0.4s ease",
          padding: isMobile ? "0 1rem" : "0 3rem",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none", flexShrink: 0 }}
          >
            <Image
              src="/logo.webp"
              alt="Logo"
              width={isMobile ? 32 : 40}
              height={isMobile ? 32 : 40}
              style={{ objectFit: "contain" }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: isMobile ? 16 : 17,
                  fontWeight: 700,
                  color: "#3D1F0A",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                Nakshatra
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: isMobile ? 11 : 13,
                  color: "#C4845A",
                  letterSpacing: isMobile ? 1 : 2,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Jyotish
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div style={{ display: "flex", gap: "2.2rem" }}>
              {NAV_LINKS.map((link) => {
                const href = getHref(link, isHome);
                const isActive = pathname === href;
                return (
                  <Link
                    key={link}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`nav-link${isActive ? " active" : ""}`}
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 17,
                      color: "#5C3A1E",
                      textDecoration: "none",
                      letterSpacing: 0.5,
                    }}
                  >
                    {link}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side: CTA Button & Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "0.25rem" : "1rem" }}>
            <Link
              href="/contact#contact-form"
              onClick={() => setIsMenuOpen(false)}
              className="cta-btn"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: isMobile ? 14 : 16,
                fontWeight: 600,
                background: "#C4845A",
                color: "#FDF6EC",
                padding: isMobile ? "6px 10px" : "10px 20px",
                borderRadius: 2,
                letterSpacing: isMobile ? 0.5 : 1,
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Get Consultation
            </Link>

            {/* Mobile Hamburger Icon */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                className="hamburger-btn"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: "rgba(44, 18, 5, 0.5)",
            backdropFilter: "blur(4px)",
            opacity: isMenuOpen ? 1 : 0,
            pointerEvents: isMenuOpen ? "auto" : "none",
            transition: "opacity 0.4s ease",
          }}
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Drawer */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "75%",
              maxWidth: 300,
              background: "#FDF6EC",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "-5px 0 25px rgba(0,0,0,0.15)",
              overflowY: "auto",
            }}
          >
            {/* Close Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3rem" }}>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="hamburger-btn"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D1F0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {NAV_LINKS.map((link) => {
                const href = getHref(link, isHome);
                const isActive = pathname === href;
                return (
                  <Link
                    key={link}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`nav-link-mobile${isActive ? " active" : ""}`}
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 23,
                      color: "#2C1205",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(196,132,90,0.2)",
                      paddingBottom: "1rem",
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