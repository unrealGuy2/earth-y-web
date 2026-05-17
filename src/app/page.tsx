"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import Map from "../components/Map";
import SearchPill from "../components/SearchPill";
import TelemetryCards from "../components/TelemetryCards";
import ActionBar from "../components/ActionBar";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [telemetry, setTelemetry] = useState<any>(null);
  const [location, setLocation] = useState({ lat: 25.7617, lng: -80.1918 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(2025);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const exportPDF = async () => {
    if (!telemetry || isLoading) {
      alert("Please generate a valid risk report first.");
      return;
    }

    const doc = new jsPDF();
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.getHeight();

    // ==========================================
    // TIME MACHINE PDF MATH
    // ==========================================
    const isOffshore = telemetry.landLoss === "N/A (Offshore)";
    let dynamicLossText = telemetry.landLoss;
    
    if (!isOffshore) {
      const baseLossMatch = telemetry.landLoss.match(/[\d.]+/);
      const baseLoss2035 = baseLossMatch ? parseFloat(baseLossMatch[0]) : 0;
      const yearlyRate = baseLoss2035 / 10;
      const yearsAhead = Math.max(0, year - 2025);
      dynamicLossText = `${(yearsAhead * yearlyRate).toFixed(1)}m`;
    }

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Preliminary risk projection based on multi-year satellite observation and physics-constrained modeling.", 20, yPos);
    
    yPos += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 20);
    doc.text("Earth-Y Risk Intelligence", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Coastal & Offshore Risk Projection Report", 20, yPos);
    
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(`Target Asset: ${telemetry.city.toUpperCase()}`, 20, yPos);
    
    yPos += 10;
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const pinColor = telemetry.risk === "Critical" ? "ff0000" : telemetry.risk === "Elevated" ? "ff8800" : "00ff00";
      const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+${pinColor}(${location.lng},${location.lat})/${location.lng},${location.lat},13,0/800x400?access_token=${mapboxToken}`;
      
      const imgRes = await fetch(staticMapUrl);
      const imgBlob = await imgRes.blob();
      
      const base64Map = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imgBlob);
      });

      doc.addImage(base64Map, 'PNG', 20, yPos, 170, 85);
      yPos += 90; 
      
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const legendText = pinColor === "ff0000" ? "Red (Critical)" : pinColor === "ff8800" ? "Orange (Elevated)" : "Green (Low)";
      doc.text(`Visual Legend: Target Asset marked by ${legendText} indicator. Coastline proximity visible at 13x zoom.`, 20, yPos);
      yPos += 10;

    } catch (err) {
      console.error("Map snapshot failed:", err);
      doc.setFontSize(10);
      doc.setTextColor(230, 0, 0);
      doc.text("[Satellite Visual Unavailable - Connection Error]", 20, yPos);
      yPos += 10;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(isOffshore ? "Offshore Hazard Assessment" : `Estimated ${dynamicLossText} shoreline retreat by ${year}`, 20, yPos);
    
    yPos += 10;
    
    doc.setFontSize(14);
    if (telemetry.risk === "Critical") doc.setTextColor(230, 0, 0);
    else if (telemetry.risk === "Elevated") doc.setTextColor(200, 100, 0);
    else doc.setTextColor(22, 163, 74);
    
    doc.text(`Infrastructural Risk Level: ${telemetry.risk}`, 20, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    const riskDetailLines = doc.splitTextToSize(`Assessment: ${telemetry.riskDetail}`, 170);
    doc.text(riskDetailLines, 20, yPos);
    yPos += (riskDetailLines.length * 6) + 4;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(`Model Confidence: ${telemetry.confidenceLevel}`, 20, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`(${telemetry.confidenceReason})`, 20, yPos);

    if (telemetry.geologyMetrics) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text("Geomorphological Profile (SRTM/GEBCO DEM)", 20, yPos);
      
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      
      doc.text(`Topography/Depth: ${telemetry.geologyMetrics.elevation}`, 20, yPos);
      doc.text(`Slope Gradient: ${telemetry.geologyMetrics.slopeGradient}`, 100, yPos);
      
      yPos += 8;
      if (telemetry.geologyMetrics.floodingVulnerability.includes("Severe")) doc.setTextColor(230, 0, 0);
      else doc.setTextColor(20, 20, 20);
      doc.text(`Hazard Vulnerability: ${telemetry.geologyMetrics.floodingVulnerability}`, 20, yPos);
      
      yPos += 8;
      if (telemetry.geologyMetrics.erosionSusceptibility.includes("High")) doc.setTextColor(230, 0, 0);
      else doc.setTextColor(20, 20, 20);
      doc.text(`Erosion/Scour Susceptibility: ${telemetry.geologyMetrics.erosionSusceptibility}`, 20, yPos);
      
      doc.setTextColor(20, 20, 20);
    }

    if (telemetry.basisOfPrediction) {
      if (yPos > 240) { doc.addPage(); yPos = 20; } else { yPos += 20; }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Basis of Prediction", 20, yPos);
      
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Satellite Data: ${telemetry.basisOfPrediction.satelliteDataRange}`, 20, yPos);
      
      yPos += 6;
      const trendLines = doc.splitTextToSize(`Observed Trend: ${telemetry.basisOfPrediction.observedTrend}`, 170);
      doc.text(trendLines, 20, yPos);
      yPos += (trendLines.length * 6);
      
      const modelLines = doc.splitTextToSize(`Model Type: ${telemetry.basisOfPrediction.modelType}`, 170);
      doc.text(modelLines, 20, yPos);
      yPos += (modelLines.length * 6) + 2;

      const constraintLines = doc.splitTextToSize("Projection derived from historical behavior and constrained by terrain-influenced hydrodynamic response.", 170);
      doc.text(constraintLines, 20, yPos);
      yPos += (constraintLines.length * 6) + 5;
    }

    if (telemetry.infrastructureImplications && telemetry.infrastructureImplications.length > 0) {
      if (yPos > 240) { doc.addPage(); yPos = 20; } else { yPos += 10; }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Implications for Infrastructure", 20, yPos);
      
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      telemetry.infrastructureImplications.forEach((implication: string) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        
        const lines = doc.splitTextToSize(`• ${implication}`, 170);
        doc.text(lines, 20, yPos);
        yPos += (lines.length * 6) + 2; 
      });
    }

    let recommendedNextStep = "";
    if (telemetry.risk === "Critical") {
        recommendedNextStep = "Immediate detailed field survey, sonar profiling, or drainage/flood mitigation review are strongly recommended before any major construction or capital deployment.";
    } else if (telemetry.risk === "Elevated") {
        recommendedNextStep = "Enhanced monitoring and localized hydrological/benthic review are recommended to prepare for potential long-term mitigation requirements.";
    } else {
        recommendedNextStep = "No immediate high-risk intervention required. Standard monitoring and periodic site review are sufficient based on current terrain and stability indicators.";
    }

    if (yPos > 240) { doc.addPage(); yPos = 20; } else { yPos += 10; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text("Recommended Action", 20, yPos);

    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const nextStepLines = doc.splitTextToSize(recommendedNextStep, 170);
    doc.text(nextStepLines, 20, yPos);
    yPos += (nextStepLines.length * 6) + 5;

    if (yPos > 240) { doc.addPage(); yPos = 20; } else { yPos += 10; }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text("Limitations", 20, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    const limitationLines = doc.splitTextToSize("This report is a preliminary risk screening tool and should not replace full geotechnical, hydrological, sonar, or field-based site investigations. All projections rely on available satellite/bathymetric telemetry.", 170);
    doc.text(limitationLines, 20, yPos);
    yPos += (limitationLines.length * 6) + 5;

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by the Earth-Y AI Engine. Powered by Google Earth Engine & PyTorch.", 20, pageHeight - 12);
    
    const safeFilename = telemetry.city.replace(/[^a-zA-Z0-9.\- ]/g, "").replace(/\s+/g, '_');
    doc.save(`Earth_Y_Report_${year}_${safeFilename}.pdf`);
  };

  const handleSearch = async (payload: any) => {
    setIsLoading(true);
    setError(null);
    setTelemetry(null);
    setYear(2025); 

    try {
      let targetLat, targetLng, targetCity;

      if (payload.type === "city") {
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(payload.city)}.json?access_token=${mapboxToken}`);
        const geoData = await geoRes.json();

        if (!geoData.features || geoData.features.length === 0) {
          setError("Location not found. Please verify the city name.");
          setIsLoading(false);
          return;
        }

        [targetLng, targetLat] = geoData.features[0].center;
        targetCity = payload.city;
      } 
      else if (payload.type === "coords") {
        targetLat = payload.lat;
        targetLng = payload.lng;
        targetCity = `Offshore Coordinates [${targetLat.toFixed(4)}, ${targetLng.toFixed(4)}]`; 
      }

      setLocation({ lat: targetLat, lng: targetLng });

      // ==========================================
      // API ENDPOINT
      // ==========================================
      const API_URL = "http://127.0.0.1:8000/api/predict"; // LOCAL TESTING

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: targetCity, lat: targetLat, lng: targetLng }),
      });
      
      if (!response.ok) throw new Error("Backend connection failed.");

      const data = await response.json();
      setTelemetry(data);
    } catch (err) {
      console.error(err);
      setError("Engine offline. Could not connect to PyTorch backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main data-theme={theme} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#050505" }}>
      
      {/* THE CINEMATIC MAP */}
      <Map theme={theme} lat={location.lat} lng={location.lng} year={year} data={telemetry} />
      
      {/* GLASS ERROR BANNER */}
      {error && (
        <div style={{ position: "absolute", top: "2rem", left: "50%", transform: "translateX(-50%)", background: "rgba(239, 68, 68, 0.2)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(239, 68, 68, 0.5)", color: "#f87171", padding: "0.75rem 1.5rem", borderRadius: "12px", zIndex: 50, fontWeight: 600, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.2)" }}>
          {error}
        </div>
      )}

      {/* LEFT COMMAND CENTER (Search Pill handles its own positioning internally) */}
      <SearchPill onSearch={handleSearch} isLoading={isLoading} />
      
      {/* RIGHT COMMAND CENTER (Target Asset Box - Moved UP to 2rem) */}
      <div style={{ position: "absolute", top: "2rem", right: "2rem", zIndex: 10 }}>
        <TelemetryCards data={telemetry} year={year} setYear={setYear} />
      </div>

      <ActionBar onToggleTheme={toggleTheme} onExportPDF={exportPDF} />
    </main>
  );
}