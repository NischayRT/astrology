"use client";

/**
 * Standard page banner — same gradient hero used on the Services page.
 * Use `compact` for a smaller title (e.g. on the Services page itself).
 */
export default function PageBanner({ eyebrow, title, subtitle, compact = false }) {
  return (
    <section
      style={{
        position: "relative",
        background: "linear-gradient(160deg, #FDF6EC 0%, #F5E8D2 40%, #EDD9B8 100%)",
        paddingTop: compact ? "110px" : "120px",
        paddingBottom: "3rem",
        textAlign: "center",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        borderBottom: "1px solid rgba(196,132,90,0.25)",
        overflow: "hidden",
      }}
    >
      {/* Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "8%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(196,132,90,0.18)",
          filter: "blur(25px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "6%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(139,111,168,0.12)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto" }}>
        {eyebrow && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: "#C4845A" }} />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 14,
                color: "#C4845A",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </span>
            <div style={{ width: 28, height: 1, background: "#C4845A" }} />
          </div>
        )}

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            // "compact" gives Services page (and any other page that wants it)
            // a visibly smaller header title than the original 3.8rem max.
            fontSize: compact ? "clamp(1.9rem, 4vw, 2.6rem)" : "clamp(2.5rem, 6vw, 3.8rem)",
            fontWeight: 400,
            color: "#2C1205",
            margin: "0 0 1.5rem",
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              // clamp() replaces the old isMobile ? 17 : 19 logic so this
              // scales smoothly with no JS/hydration flash.
              fontSize: "clamp(16px, 1.6vw + 13px, 20px)",
              color: "#6B4423",
              maxWidth: 650,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}