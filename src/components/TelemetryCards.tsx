"use client";

export default function TelemetryCards({
  data,
  year = 2025,
  setYear
}: {
  data: any,
  year?: number,
  setYear: (year: number) => void
}) {
  if (!data) return null;

  const riskColor = data.risk === "Critical" ? "#ef4444" : data.risk === "Elevated" ? "#f97316" : "#10b981";
  const isOffshore = data.landLoss === "N/A (Offshore)";

  return (
    <div style={{
      background: "rgba(20, 20, 20, 0.3)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      borderRadius: "20px",
      overflowY: "auto",
      width: "480px",
      maxHeight: "calc(100vh - 4rem)",
      padding: "1rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      
      {/* 1. Header Card */}
      <div style={{
        background: "transparent",
        border: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: 0,
        padding: "1rem",
        marginBottom: "1rem",
        color: "white"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Target Asset</h2>
          <span
            style={{
              border: `1px solid ${riskColor}`,
              color: riskColor,
              fontWeight: 700,
              fontSize: "0.75rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background: "transparent",
              textTransform: "uppercase"
            }}
          >
            {data.risk}
          </span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", margin: 0 }}>{data.city.toUpperCase()}</h1>
      </div>

      {/* 2. Environmental Dynamics Card */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1rem",
        color: "white"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          {/* Zap SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={riskColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0, color: "#fff" }}>Hazard Analytics (PINN Engine)</h3>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", padding: "0 0.5rem" }}>
          <div>
            <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>Vulnerability</p>
            <p style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{data.geologyMetrics?.floodingVulnerability || "N/A"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>Erosion Susceptibility</p>
            <p style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{data.geologyMetrics?.erosionSusceptibility || "N/A"}</p>
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#ccc", lineHeight: "1.5", margin: 0 }}>
          <span style={{ fontWeight: 600, color: riskColor }}>Assessment: </span>
          {data.riskDetail}
        </p>
      </div>

      {/* 3. Geological Profile Card */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1rem",
        color: "white"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          {/* Activity SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={riskColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0, color: "#fff" }}>Geological Profile (SRTM/GEBCO DEM)</h3>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", padding: "0 0.5rem" }}>
          <div>
            <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>Topography/Depth</p>
            <p style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{data.geologyMetrics?.elevation || "N/A"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>Benthic Slope Gradient</p>
            <p style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{data.geologyMetrics?.slopeGradient || "N/A"}</p>
          </div>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
          <span style={{ fontWeight: 600, color: "#aaa" }}>Basis: </span> 
          Analysis constrained by terrain topography and bathymetric flow resistance. Model confidence: <span style={{ fontWeight: 700, color: "#fff" }}>{data.confidenceLevel}</span>.
        </p>
      </div>

      {/* 4. Temporal Projection Card */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1rem",
        color: "white"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {/* Clock SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={riskColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16.5 12"></polyline></svg>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0, color: "#fff" }}>Temporal Risk Projection</h3>
        </div>
        
        <input 
          type="range"
          min="2025"
          max="2050"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: riskColor, cursor: "pointer", marginBottom: "1.25rem" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 0.25rem" }}>
          <div>
            <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>Forecast Horizon</p>
            <p style={{ color: riskColor, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>{year}</p>
          </div>
          {!isOffshore && (
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>Cumulative Land Loss (Meters)</p>
              <p style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>{data.landLoss}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}