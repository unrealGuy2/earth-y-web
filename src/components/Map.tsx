"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function Map({ theme, lat, lng }: { theme: "dark" | "light", lat: number, lng: number }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      const style = theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11";
      map.current.setStyle(style);
    }
  }, [theme]);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 12,
        essential: true
      });
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}
    />
  );
}