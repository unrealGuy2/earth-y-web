// src/components/ChronoSlider.tsx
"use client";

export default function ChronoSlider({ 
  year, 
  setYear, 
  disabled 
}: { 
  year: number; 
  setYear: (y: number) => void; 
  disabled: boolean 
}) {
  return (
    <div style={{
      background: "rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "1rem",
      borderRadius: "12px",
      marginTop: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.3s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
        <span>Temporal Projection</span>
        <span style={{ color: "#10b981", fontSize: "1.1rem" }}>{year}</span>
      </div>
      
      <input
        type="range"
        min="2025"
        max="2050"
        step="1"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
        disabled={disabled}
        style={{
          width: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          accentColor: "#10b981"
        }}
      />
      
      <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.75rem", fontWeight: 500 }}>
        <span>2025</span>
        <span>2050</span>
      </div>
    </div>
  );
}