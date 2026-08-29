"use client";

/**
 * Embeds the Sri Astro Clinic location (from the shared Google Maps link)
 * as a responsive iframe. No API key needed — uses the public
 * maps.google.com "?output=embed" embed format.
 */
export default function LocationMap({ height = 320 }) {
  return (
    <div
      style={{
        borderRadius: 6,
        overflow: "hidden",
        border: "1px solid rgba(196,132,90,0.3)",
        boxShadow: "0 8px 24px rgba(196,132,90,0.08)",
        // Keeps the map responsive at any container width.
        width: "100%",
      }}
    >
      <iframe
        title="Sri Astro Clinic — Location"
        src="https://www.google.com/maps?q=Sri+Astro+Clinic,+Hyderabad,+Telangana&ll=17.5033646,78.4809769&z=16&output=embed"
        width="100%"
        height={height}
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
