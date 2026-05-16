"use client";

import { useState } from "react";

export default function SearchPill({ onSearch, isLoading }: { onSearch: (payload: any) => void, isLoading: boolean }) {
  const [mode, setMode] = useState<"city" | "coords">("city");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (mode === "city" && city.trim()) {
      onSearch({ type: "city", city: city.trim() });
    } else if (mode === "coords" && lat && lng) {
      onSearch({ type: "coords", lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  };

  return (
    <div style={{
      position: "absolute",
      top: "8rem",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(15, 15, 15, 0.8)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "1rem",
      borderRadius: "16px",
      zIndex: 10,
      width: "90%",
      maxWidth: "450px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
    }}>
      {/* The Mode Toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "12px" }}>
        <button
          type="button"
          onClick={() => setMode("city")}
          style={{
            flex: 1, padding: "8px 0", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, transition: "all 0.2s",
            background: mode === "city" ? "rgba(255,255,255,0.1)" : "transparent",
            color: mode === "city" ? "#fff" : "#888"
          }}
        >
          City Search
        </button>
        <button
          type="button"
          onClick={() => setMode("coords")}
          style={{
            flex: 1, padding: "8px 0", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, transition: "all 0.2s",
            background: mode === "coords" ? "rgba(255,255,255,0.1)" : "transparent",
            color: mode === "coords" ? "#fff" : "#888"
          }}
        >
          Coordinates (Offshore)
        </button>
      </div>

      {/* The Search Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        {mode === "city" ? (
          <input
            type="text"
            placeholder="Enter coastal city (e.g., Lagos, Miami)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isLoading}
            style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)", color: "#fff", outline: "none" }}
          />
        ) : (
          <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)", color: "#fff", outline: "none" }}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)", color: "#fff", outline: "none" }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "0 20px", borderRadius: "8px", border: "none", background: isLoading ? "#333" : "#fff", color: "#000", fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", transition: "0.2s"
          }}
        >
          {isLoading ? "..." : "Scan"}
        </button>
      </form>
    </div>
  );
}