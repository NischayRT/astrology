// src/app/calendar/page.js
"use client";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import HinduCalendar from "../../components/HinduCalendar";
import Footer from "../../components/Footer";

export default function CalendarPage() {
  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh" }}>
      <Navbar />

      {/* Standard hero banner — same design as the Services page */}
      <PageBanner
        eyebrow="Vedic Timekeeping"
        title="Monthly Panchang & Muhurtha"
        compact
      />

      <div style={{ paddingTop: "3rem", paddingBottom: "3rem", maxWidth: 1000, margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <HinduCalendar />
      </div>

      <Footer />
    </div>
  );
}