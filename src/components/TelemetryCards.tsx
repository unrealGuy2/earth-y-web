"use client";

import styles from "./TelemetryCards.module.scss";

export default function TelemetryCards({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <div className={styles.label}>Predicted Land Loss</div>
        <div className={`${styles.value} ${styles.danger}`}>{data.landLoss}</div>
        <div className={styles.subtext}>By year {data.year}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Risk Level</div>
        <div className={styles.value}>{data.risk}</div>
        <div className={styles.subtext}>Infrastructure at risk</div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Model Confidence</div>
        <div className={styles.value}>{data.confidence}</div>
        <div className={styles.subtext}>PINN Architecture</div>
      </div>
    </div>
  );
}