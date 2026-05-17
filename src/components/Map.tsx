"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map({ 
  theme, 
  lat, 
  lng, 
  year = 2025, 
  data 
}: { 
  theme: string, 
  lat: number, 
  lng: number, 
  year?: number, 
  data?: any 
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerInstance = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: 13,
      pitch: 45, // Angled for a 3D tactical look
    });

    mapInstance.current = map;

    map.on("load", () => {
      // Add the dynamic danger zone source
      map.addSource("danger-zone", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });

      // Add the pulsing red layer
      map.addLayer({
        id: "danger-zone-layer",
        type: "circle",
        source: "danger-zone",
        paint: {
          "circle-radius": 0,
          "circle-color": "#ef4444",
          "circle-opacity": 0.4,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ef4444"
        }
      });
    });

    return () => map.remove();
  }, [theme]); // Re-initialize only on theme change

  // This effect runs every time location, year, or data changes
  useEffect(() => {
    if (!mapInstance.current) return;

    // 1. Fly to the new location smoothly
    mapInstance.current.flyTo({ center: [lng, lat], zoom: 13, essential: true });

    // 2. Manage the Map Marker
    if (markerInstance.current) markerInstance.current.remove();
    
    const isOffshore = data?.landLoss === "N/A (Offshore)";
    const color = data?.risk === "Critical" ? "#ef4444" : data?.risk === "Elevated" ? "#f97316" : "#10b981";
    
    markerInstance.current = new mapboxgl.Marker({ color })
      .setLngLat([lng, lat])
      .addTo(mapInstance.current);

    // 3. The Dynamic Flood Visuals (Only for coastal data)
    if (mapInstance.current.isStyleLoaded() && mapInstance.current.getSource("danger-zone")) {
      if (data && !isOffshore) {
        // Calculate the physical pixel radius of the flood zone based on the year
        const baseLossMatch = data.landLoss.match(/[\d.]+/);
        const baseLoss2035 = baseLossMatch ? parseFloat(baseLossMatch[0]) : 0;
        const yearlyRate = baseLoss2035 / 10;
        const yearsAhead = Math.max(0, year - 2025);
        
        // We multiply by an aesthetic multiplier so it visually covers city blocks
        const visualRadius = Math.max(0, yearsAhead * yearlyRate * 8); 

        // Update the coordinates center
        (mapInstance.current.getSource("danger-zone") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: { type: "Point", coordinates: [lng, lat] },
            properties: {}
          }]
        });

        // Animate the expansion
        mapInstance.current.setPaintProperty("danger-zone-layer", "circle-radius", visualRadius);
      } else {
        // Hide the danger zone if we are offshore or have no data
        mapInstance.current.setPaintProperty("danger-zone-layer", "circle-radius", 0);
      }
    }
  }, [lat, lng, year, data]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }} />;
}