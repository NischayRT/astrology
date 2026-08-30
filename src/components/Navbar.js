// src/components/Navbar.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Close the drawer automatically if the viewport is resized back to desktop
  // width, so it can't be left open-but-invisible behind the hidden hamburger.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px)");
    const handleChange = (e) => {
      if (e.matches) setIsMenuOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const leftLinks = [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
  ];

  const rightLinks = [
    { label: "Calendar", href: "/calendar" },
    { label: "Contact", href: "/contact" },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  return (
    <>
      {/*
        CRITICAL: the desktop-links vs. hamburger switch is CSS-only
        (@media queries), never JS state. CSS applies at first paint,
        before any JS runs — so there's no window where a mobile viewport
        can render the full desktop row. A JS `isMobile` boolean computed
        in a useEffect is what caused the squeezed/overlapping nav bug,
        since the desktop layout renders by default until that effect fires.
      */}
      <style>{`
        .nav-item-link {
          position: relative;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #2C1205;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 4px;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nav-item-link:hover {
          color: #C4845A;
          background: rgba(196, 132, 90, 0.08);
        }

        .nav-item-link.active {
          color: #A35C2B;
          font-weight: 700;
        }

        .nav-item-link.active::after {
          content: "";
          position: absolute;
          bottom: 0px;
          left: 10px;
          right: 10px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #C4845A, transparent);
        }

        .nav-center-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          flex-shrink: 0;
          padding: 2px 8px;
        }

        .nav-center-brand:hover {
          transform: translateY(-1px);
        }

        .nav-logo-box {
          position: relative;
          width: clamp(28px, 9vw, 44px);
          height: clamp(28px, 9vw, 44px);
          transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-brand-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(14px, 3.6vw, 17px);
          font-weight: 700;
          color: #2C1205;
          letter-spacing: 1.5px;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .nav-brand-tagline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 10.5px;
          letter-spacing: 2.5px;
          color: #A35C2B;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 3px;
        }

        /* Side link groups: visible only above 620px */
        .nav-side {
          display: flex;
          align-items: center;
          gap: 2.25rem;
          flex: 1;
          transition: gap 0.3s ease;
        }
         .nav-side.left { justify-content: center;  }
        .nav-side.right { justify-content: center; }

        /* Hamburger: hidden by default (desktop-first), shown only at/under 620px */
        .nav-hamburger {
          display: none;
          background: rgba(253, 246, 236, 0.6);
          border: 1px solid rgba(196, 132, 90, 0.3);
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        .nav-hamburger:hover {
          background: rgba(196, 132, 90, 0.2);
        }
        .nav-hamburger.scrolled {
          background: rgba(196, 132, 90, 0.12);
        }

        @media (max-width: 820px) {
          .nav-side { display: none; }
          .nav-hamburger { display: flex; }
          .nav-brand-tagline { display: none; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          pointerEvents: "none",
          padding: scrolled ? "8px 16px" : "10px 20px",
          transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <nav
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: scrolled ? "rgba(253, 246, 236, 0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
            border: scrolled ? "1px solid rgba(196, 132, 90, 0.24)" : "1px solid transparent",
            boxShadow: scrolled ? "0 2px 8px rgba(44, 18, 5, 0.05)" : "none",
            borderRadius: 4,
            padding: scrolled ? "6px 16px" : "8px 16px",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Left Tabs — CSS-hidden at ≤620px */}
          <div className="nav-side left">
            {leftLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-item-link${pathname === item.href ? " active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Center Emblem & Logo */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="nav-center-brand"
            style={{
              flexDirection: scrolled ? "row" : "column",
              gap: scrolled ? 8 : 2,
            }}
          >
            <div className="nav-logo-box" style={scrolled ? { width: 30, height: 30 } : undefined}>
              <Image
                src="/logo.webp"
                alt="Sri Astro Jyotish"
                fill
                sizes="44px"
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 1px 3px rgba(196,132,90,0.25))",
                }}
                priority
              />
            </div>

            <div style={{ textAlign: scrolled ? "left" : "center", lineHeight: 1, transition: "all 0.35s ease" }}>
              <div className="nav-brand-name" style={scrolled ? { letterSpacing: 1.2 } : undefined}>
                Sri Astro Jyotish
              </div>
              {!scrolled && <div className="nav-brand-tagline">Vedic Wisdom</div>}
            </div>
          </Link>

          {/* Right Tabs — CSS-hidden at ≤620px */}
          <div className="nav-side right">
            {rightLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-item-link${pathname === item.href ? " active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Hamburger — CSS-shown only at ≤620px */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className={`nav-hamburger${scrolled ? " scrolled" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C1205" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Drawer — always in the DOM; only reachable via the hamburger,
          which CSS keeps hidden above 620px, so there's no desktop-side effect. */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(44, 18, 5, 0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "78%",
            maxWidth: 300,
            background: "#FDF6EC",
            borderLeft: "1px solid rgba(196,132,90,0.3)",
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "-4px 0 12px rgba(44,18,5,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(196,132,90,0.2)", paddingBottom: "1rem" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#2C1205" }}>
              SRI ASTRO JYOTISH
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="nav-hamburger scrolled"
              style={{ display: "flex" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C1205" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {allLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: isActive ? "#A35C2B" : "#2C1205",
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: 4,
                    background: isActive ? "rgba(196,132,90,0.12)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{item.label}</span>
                  {isActive && <span style={{ color: "#C4845A", fontSize: 14 }}>✦</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}