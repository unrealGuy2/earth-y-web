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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // --- THE ENTERPRISE PDF GENERATOR (Now Async for Mapbox Image) ---
  const exportPDF = async () => {
    if (!telemetry || isLoading) {
      alert("Please generate a valid risk report first.");
      return;
    }

    const doc = new jsPDF();
    let yPos = 20;

    // --- 1. CREDIBILITY FRAMING ---
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Preliminary risk projection based on multi-year satellite observation and physics-constrained modeling.", 20, yPos);
    
    yPos += 15;

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 20);
    doc.text("Earth-Y Risk Intelligence", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Automated Coastal Morphology Projection", 20, yPos);
    
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    
    // --- Target Asset ---
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(`Target Asset: ${telemetry.city.toUpperCase()} COASTLINE`, 20, yPos);
    
    // --- 2. THE VISUAL (Mapbox Static Snapshot) ---
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
      yPos += 95; 
    } catch (err) {
      console.error("Map snapshot failed:", err);
      doc.setFontSize(10);
      doc.setTextColor(230, 0, 0);
      doc.text("[Satellite Visual Unavailable - Connection Error]", 20, yPos);
      yPos += 10;
    }

    // --- 3. THE AGGRESSIVE HEADLINE ---
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(`Estimated ${telemetry.landLoss} shoreline retreat by ${telemetry.year}`, 20, yPos);
    
    yPos += 10;
    doc.setFontSize(14);
    if (telemetry.risk === "Critical") doc.setTextColor(230, 0, 0);
    else if (telemetry.risk === "Elevated") doc.setTextColor(200, 100, 0);
    else doc.setTextColor(22, 163, 74);
    
    doc.text(`Infrastructural Risk Level: ${telemetry.risk}`, 20, yPos);
    
    yPos += 10;
    doc.setTextColor(20, 20, 20);
    doc.text(`Physics-Informed Confidence: ${telemetry.confidence}`, 20, yPos);

    // --- Enterprise Defensibility ---
    if (telemetry.basisOfPrediction) {
      yPos += 20;
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
      yPos += (modelLines.length * 6) + 5;
    }

    // --- Infrastructure Implications ---
    if (telemetry.infrastructureImplications && telemetry.infrastructureImplications.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Implications for Infrastructure", 20, yPos);
      
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      telemetry.infrastructureImplications.forEach((implication: string) => {
        const lines = doc.splitTextToSize(`• ${implication}`, 170);
        doc.text(lines, 20, yPos);
        yPos += (lines.length * 6) + 2; 
      });
    }

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by the Earth-Y AI Engine. Powered by Google Earth Engine & PyTorch.", 20, 285);
    
    doc.save(`Earth_Y_Report_${telemetry.city.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);
    setTelemetry(null);

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxToken}`);
      const geoData = await geoRes.json();

      if (!geoData.features || geoData.features.length === 0) {
        setError("Location not found. Please verify the city name.");
        setIsLoading(false);
        return;
      }

      const [lng, lat] = geoData.features[0].center;
      setLocation({ lat, lng });

      const response = await fetch("https://earth-y-engine.onrender.com/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: city, lat: lat, lng: lng }),
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
    <main data-theme={theme}>
      <Map theme={theme} lat={location.lat} lng={location.lng} />
      
      {error && (
        <div style={{ position: "absolute", top: "6rem", left: "50%", transform: "translateX(-50%)", background: "rgba(230, 0, 0, 0.9)", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", zIndex: 20, backdropFilter: "blur(10px)", fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          {error}
        </div>
      )}

      <SearchPill onSearch={handleSearch} isLoading={isLoading} />
      <TelemetryCards data={telemetry} />
      <ActionBar onToggleTheme={toggleTheme} onExportPDF={exportPDF} />
    </main>
  );
}