// Shared style tokens — keeps card borders, radii, and shadows identical
// across the Services, About, Contact, and Calendar pages.

export const COLORS = {
  bg: "#FDF6EC",
  bgAlt: "#F5E8D2",
  bgForm: "#FAF2E6",
  border: "rgba(196,132,90,0.2)",
  ink: "#2C1205",
  inkSoft: "#6B4423",
  accent: "#C4845A",
};

// The translucent, blurred "content box" look used throughout the Services page.
export const cardStyle = {
  background: "rgba(253, 246, 236, 0.96)",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 4,
  boxShadow: "0 10px 40px rgba(196,132,90,0.06)",
  backdropFilter: "blur(4px)",
};

export const cardStyleAlt = {
  ...cardStyle,
  background: "rgba(245, 232, 210, 0.96)",
};

export const sectionEyebrow = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 13,
  color: COLORS.accent,
  letterSpacing: 3,
  textTransform: "uppercase",
  fontWeight: 600,
  marginBottom: 8,
};

export const sectionDivider = {
  borderTop: "1px solid rgba(196,132,90,0.15)",
};