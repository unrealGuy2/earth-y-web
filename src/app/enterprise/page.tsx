"use client";

import { useState } from "react";
import Link from "next/link";

export default function EnterpriseDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const runBatchAnalysis = async (assets: any[]) => {
    setIsProcessing(true);
    setError(null);
    setResults([]); 
    setProgress({ current: 0, total: assets.length });

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      try {
        // FIXED URL: Added /api/predict
        const response = await fetch("https://earth-y-engine.onrender.com/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(asset),
        });

        if (response.ok) {
          const data = await response.json();
          setResults(prev => [...prev, data]);
        } else {
          setResults(prev => [...prev, { city: asset?.city || "Unknown", lat: asset?.lat, lng: asset?.lng, risk: "ERROR", riskDetail: `Server Error (${response.status})` }]);
        }
      } catch (err) {
         setResults(prev => [...prev, { city: asset?.city || "Unknown", lat: asset?.lat, lng: asset?.lng, risk: "ERROR", riskDetail: "Network Offline. PyTorch down?" }]);
      }
      setProgress({ current: i + 1, total: assets.length });
    }
    setIsProcessing(false);
  };

  const processCSV = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const cleanText = text.replace(/[\r"']/g, ""); 
        const lines = cleanText.split("\n").filter(line => line.trim() !== "");
        
        const assets = lines.slice(1).map(line => {
          const parts = line.split(/[,;]/).map(item => item?.trim());
          const city = parts[0];
          const lat = parseFloat(parts[1]);
          const lng = parseFloat(parts[2]);
          
          if (city && !isNaN(lat) && !isNaN(lng)) {
            return { city, lat, lng };
          }
          return null;
        }).filter(Boolean);

        if (assets.length === 0) throw new Error("Could not extract data. Format might be corrupted.");
        await runBatchAnalysis(assets);

      } catch (err: any) {
        setError(err.message || "An error occurred during processing.");
      }
    };
    reader.readAsText(file);
  };

  const loadDemoData = () => {
    const demoAssets = [
      { city: "Lagos HQ", lat: 6.5244, lng: 3.3792 },
      { city: "Miami Port", lat: 25.7617, lng: -80.1918 },
      { city: "Deepwater Rig Alpha", lat: 25.0000, lng: -45.0000 },
      { city: "Puerto Rico Trench", lat: 19.8000, lng: -66.0000 }
    ];
    runBatchAnalysis(demoAssets);
  };

  const riskOrder: Record<string, number> = { "ERROR": 0, "Critical": 1, "Elevated": 2, "Low": 3 };
  const sortedResults = [...results].sort((a, b) => (riskOrder[a.risk] ?? 99) - (riskOrder[b.risk] ?? 99));

  return (
    <div style={{ height: "100vh", overflowY: "auto", background: "#050505", backgroundImage: "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)", color: "white", padding: "2rem", fontFamily: "system-ui, sans-serif", paddingBottom: "10rem" }}>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Portfolio Risk Scanner</h1>
          <p style={{ color: "#a1a1aa", marginTop: "0.25rem", fontSize: "0.9rem" }}>Earth-Y Enterprise Tier. Batch process offshore and coastal telemetry.</p>
        </div>
        <Link href="/" style={{ padding: "0.6rem 1.2rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", borderRadius: "8px", textDecoration: "none", color: "white", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.3s ease" }}>
          Back to Map
        </Link>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* GLASSMORPHISM UPLOAD PANEL */}
        <div style={{ background: "rgba(20, 20, 20, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)", borderRadius: "24px", padding: "2.5rem", textAlign: "center" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: 600 }}>Upload Asset Registry (CSV)</h3>
          
          <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} id="csvUpload" />
          <label htmlFor="csvUpload" style={{ padding: "0.8rem 1.8rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 500, borderRadius: "12px", cursor: "pointer", display: "inline-block", transition: "all 0.3s ease" }}>
            {file ? file.name : "Select CSV File"}
          </label>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
            {file && (
              <button 
                onClick={processCSV} 
                disabled={isProcessing}
                style={{ padding: "0.8rem 1.8rem", background: isProcessing ? "rgba(59,130,246,0.8)" : "rgba(16,185,129,0.9)", color: "white", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 20px rgba(16,185,129,0.2)", borderRadius: "12px", fontWeight: "600", cursor: isProcessing ? "not-allowed" : "pointer", transition: "all 0.3s" }}
              >
                {isProcessing ? `Scanning CSV... (${progress.current}/${progress.total})` : "Run CSV Analysis"}
              </button>
            )}
            
            <button 
              onClick={loadDemoData} 
              disabled={isProcessing}
              style={{ padding: "0.8rem 1.8rem", background: "transparent", color: "#10b981", border: "1px solid rgba(16,185,129,0.5)", borderRadius: "12px", fontWeight: "600", cursor: isProcessing ? "not-allowed" : "pointer", transition: "all 0.3s" }}
            >
              Load Demo Portfolio
            </button>
          </div>
          {error && <p style={{ color: "#ef4444", marginTop: "1rem" }}>{error}</p>}
        </div>

        {/* GLASSMORPHISM TABLE */}
        <div style={{ background: "rgba(20, 20, 20, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)", borderRadius: "24px", padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>Global Fleet Assessment</h3>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "rgba(255,255,255,0.02)" }}>
                <tr style={{ color: "#a1a1aa", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "1.5rem" }}>Asset Name</th>
                  <th style={{ padding: "1.5rem" }}>Coordinates</th>
                  <th style={{ padding: "1.5rem" }}>Environment</th>
                  <th style={{ padding: "1.5rem" }}>Status</th>
                  <th style={{ padding: "1.5rem" }}>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#52525b" }}>
                      Awaiting telemetry data. Upload a CSV or click "Load Demo Portfolio" to begin.
                    </td>
                  </tr>
                ) : (
                  sortedResults.map((asset, idx) => {
                    const isOffshore = asset?.landLoss === "N/A (Offshore)";
                    const isError = asset?.risk === "ERROR";
                    
                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s", fontSize: "0.95rem" }}>
                        <td style={{ padding: "1.5rem", fontWeight: 500, color: "#f4f4f5" }}>{asset?.city}</td>
                        <td style={{ padding: "1.5rem", color: "#71717a", fontFamily: "monospace" }}>[{asset?.lat}, {asset?.lng}]</td>
                        <td style={{ padding: "1.5rem" }}>
                          <span style={{ padding: "6px 12px", background: isError ? "rgba(239,68,68,0.1)" : isOffshore ? "rgba(59,130,246,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${isError ? "rgba(239,68,68,0.2)" : isOffshore ? "rgba(59,130,246,0.2)" : "rgba(16,185,129,0.2)"}`, color: isError ? "#ef4444" : isOffshore ? "#60a5fa" : "#34d399", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {isError ? "Offline" : isOffshore ? "Deepwater" : "Coastal"}
                          </span>
                        </td>
                        <td style={{ padding: "1.5rem", color: isError ? "#ef4444" : "#a1a1aa", lineHeight: "1.5" }}>
                          {asset?.riskDetail}
                        </td>
                        <td style={{ padding: "1.5rem" }}>
                          <span style={{ fontWeight: "700", color: isError ? "#ef4444" : asset?.risk === "Critical" ? "#ef4444" : asset?.risk === "Elevated" ? "#f97316" : "#10b981", textShadow: `0 0 10px ${isError ? "rgba(239,68,68,0.4)" : asset?.risk === "Critical" ? "rgba(239,68,68,0.4)" : asset?.risk === "Elevated" ? "rgba(249,115,22,0.4)" : "rgba(16,185,129,0.4)"}` }}>
                            {asset?.risk}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}