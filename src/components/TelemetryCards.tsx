"use client";

import styles from "./TelemetryCards.module.scss";

export default function TelemetryCards({ data }: { data: any }) {
  if (!data) return null;

  // Extract geology metrics for cleaner code mapping
  const geo = data.geologyMetrics;

  return (
    <div className={styles.cardsContainer}>
      {/* Top Level: The AI PINN Predictions */}
      <div className={styles.card}>
        <div className={styles.label}>Predicted Land Loss</div>
        <div className={`${styles.value} ${styles.danger}`}>{data.landLoss}</div>
        <div className={styles.subtext}>By year {data.year}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Baseline Risk Level</div>
        <div className={styles.value}>{data.risk}</div>
        <div className={styles.subtext}>Infrastructure at risk</div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Model Confidence</div>
        <div className={styles.value}>{data.confidence}</div>
        <div className={styles.subtext}>PINN Architecture</div>
      </div>

      {/* New Section: NAPE Geology Metrics */}
      {geo && (
        <>
          <div className={styles.card}>
            <div className={styles.label}>Terrain Elevation</div>
            <div className={styles.value}>{geo.elevation}</div>
            <div className={styles.subtext}>SRTM DEM Baseline</div>
          </div>

          <div className={styles.card}>
            <div className={styles.label}>Coastal Slope</div>
            <div className={styles.value}>{geo.slopeGradient}</div>
            <div className={styles.subtext}>Erosion Gradient</div>
          </div>

          <div className={styles.card}>
            <div className={styles.label}>Flooding Risk</div>
            <div 
              className={`${styles.value} ${geo.floodingVulnerability.includes("Severe") ? styles.danger : ""}`} 
              style={{ fontSize: "1.5rem" }} // Scaled down slightly to fit the longer text
            >
              {geo.floodingVulnerability.split(" ")[0]} 
            </div>
            <div className={styles.subtext}>Inundation Vulnerability</div>
          </div>

          <div className={styles.card}>
            <div className={styles.label}>Coastal Erosion</div>
            <div 
              className={`${styles.value} ${geo.erosionSusceptibility.includes("High") ? styles.danger : ""}`} 
              style={{ fontSize: "1.5rem" }}
            >
              {geo.erosionSusceptibility.split(" ")[0]}
            </div>
            <div className={styles.subtext}>Undercutting Susceptibility</div>
          </div>
        </>
      )}
    </div>
  );
}