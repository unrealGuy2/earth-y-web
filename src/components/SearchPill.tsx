"use client";

import { useState } from "react";

export default function SearchPill({ onSearch, isLoading }: { onSearch: (data: any) => void, isLoading: boolean }) {
  const [activeTab, setActiveTab] = useState<"city" | "coords">("city");
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  const handleScan = () => {
    if (isLoading) return;
    if (activeTab === "city" && query.trim()) {
      onSearch({ type: "city", city: query });
    } else if (activeTab === "coords" && coords.lat && coords.lng) {
      onSearch({ type: "coords", lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) });
    }
  };

  return (
    <div style={{
      position: "absolute",
      top: "2rem",
      left: "2rem",
      background: "rgba(20, 20, 20, 0.4)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      borderRadius: "20px",
      padding: "1rem",
      zIndex: 10,
      width: "460px", // <--- INCREASED WIDTH TO HOLD THE BUTTON
      boxSizing: "border-box", // <--- KEEPS PADDING INSIDE THE BOX
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("city")}
          style={{
            flex: 1,
            padding: "0.5rem",
            fontSize: "0.85rem",
            background: activeTab === "city" ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === "city" ? "white" : "#888",
            border: `1px solid ${activeTab === "city" ? "rgba(255,255,255,0.1)" : "transparent"}`,
            borderRadius: "8px",
            fontWeight: activeTab === "city" ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
          }}>
          {/* MapPin SVG */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          City Search
        </button>
        <button
          onClick={() => setActiveTab("coords")}
          style={{
            flex: 1,
            padding: "0.5rem",
            fontSize: "0.85rem",
            background: activeTab === "coords" ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === "coords" ? "white" : "#888",
            border: `1px solid ${activeTab === "coords" ? "rgba(255,255,255,0.1)" : "transparent"}`,
            borderRadius: "8px",
            fontWeight: activeTab === "coords" ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
          }}>
          {/* Search SVG */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Coordinates (Offshore)
        </button>
      </div>

      {/* Input Row */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {activeTab === "city" ? (
          <input
            type="text"
            placeholder="Enter coastal city (e.g., Lagos, Miami)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            style={{
              flex: 1,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "0 0.75rem",
              fontSize: "0.9rem",
              color: "white",
              height: "40px",
              outline: "none"
            }}
          />
        ) : (
          <>
            <input
              type="number"
              placeholder="Latitude"
              value={coords.lat}
              onChange={(e) => setCoords(prev => ({ ...prev, lat: e.target.value }))}
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "0 0.75rem",
                fontSize: "0.9rem",
                color: "white",
                height: "40px",
                outline: "none",
                width: "100%"
              }}
            />
            <input
              type="number"
              placeholder="Longitude"
              value={coords.lng}
              onChange={(e) => setCoords(prev => ({ ...prev, lng: e.target.value }))}
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "0 0.75rem",
                fontSize: "0.9rem",
                color: "white",
                height: "40px",
                outline: "none",
                width: "100%"
            }}
            />
          </>
        )}
        <button
          onClick={handleScan}
          disabled={isLoading}
          style={{
            background: "#fff",
            color: "#000",
            fontWeight: 700,
            border: "none",
            borderRadius: "8px",
            height: "40px",
            padding: "0 1.5rem",
            fontSize: "0.9rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap" // <--- STOPS THE TEXT FROM WRAPPING
          }}
        >
          {isLoading ? "Scanning..." : "Scan"}
        </button>
      </div>
    </div>
  );
}