"use client";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "/contact" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#1E0C02", padding: "3rem", textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: "#EDD9B8", marginBottom: 8, fontStyle: "italic" }}>
        KSR Astro Jyotish
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: "#8B6240", letterSpacing: 2, marginBottom: 20 }}>
        Ancient Wisdom · Modern Guidance
      </div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: "#8B6240", textDecoration: "none", letterSpacing: 0.5 }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#5C3A1E" }}>
        © 2026 KSR Astro Jyotish · All Rights Reserved
      </div>
    </footer>
  );
}