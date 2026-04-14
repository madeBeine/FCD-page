import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from 'react-simple-maps';
import { useConfig } from '../context/ConfigContext';

// High-resolution topojson for the world
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const cities = [
  { name: "Nouadhibou", coordinates: [-17.0347, 20.9309], dx: 10, dy: 3, anchor: "start" },
  { name: "Zouérat", coordinates: [-12.4833, 22.7167], dx: 5, dy: 3, anchor: "start" },
  { name: "Atar", coordinates: [-13.0500, 20.5169], dx: -5, dy: 3, anchor: "end" },
  { name: "Akjoujt", coordinates: [-14.3833, 19.6969], dx: 5, dy: 10, anchor: "start" },
  { name: "Nouakchott", coordinates: [-15.9582, 18.0735], dx: 8, dy: 3, anchor: "start", isBold: true },
  { name: "Boutilimit", coordinates: [-14.6919, 17.5469], dx: -5, dy: 3, anchor: "end" },
  { name: "Rosso", coordinates: [-15.8050, 16.5138], dx: 0, dy: -8, anchor: "middle" },
  { name: "Aleg", coordinates: [-13.9167, 17.0500], dx: 5, dy: 3, anchor: "start" },
  { name: "Bogué", coordinates: [-14.2667, 16.5833], dx: 5, dy: 3, anchor: "start" },
  { name: "Kaédi", coordinates: [-13.5000, 16.1500], dx: 5, dy: 3, anchor: "start" },
  { name: "Kiffa", coordinates: [-11.4000, 16.6167], dx: -5, dy: 3, anchor: "end" },
  { name: "Hamoud", coordinates: [-11.3300, 15.6500], dx: 0, dy: -8, anchor: "middle" },
  { name: "Néma", coordinates: [-7.2500, 16.6167], dx: 0, dy: -8, anchor: "middle" },
  { name: "Boû Gâdoûm", coordinates: [-7.6167, 16.1833], dx: 0, dy: -8, anchor: "middle" },
  { name: "Adel Bagrou", coordinates: [-7.1500, 15.5667], dx: -5, dy: 3, anchor: "end" }
];

const connections = [
  { from: [-15.9582, 18.0735], to: [-17.0347, 20.9309] }, // Nouakchott to Nouadhibou
  { from: [-15.9582, 18.0735], to: [-15.8050, 16.5138] }, // Nouakchott to Rosso
  { from: [-15.9582, 18.0735], to: [-13.0500, 20.5169] }, // Nouakchott to Atar
  { from: [-15.9582, 18.0735], to: [-11.4000, 16.6167] }, // Nouakchott to Kiffa
  { from: [-11.4000, 16.6167], to: [-7.2500, 16.6167] }, // Kiffa to Néma
];

export const MauritaniaMap = () => {
  const { config } = useConfig();
  const isDark = document.documentElement.classList.contains('dark');
  const content = config.content[config.language].navbar as any;
  const logoText = content.logoText || 'FC';
  const cities = config.mapCities || [];

  return (
    <div 
      className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center pointer-events-none"
      style={{
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
      }}
    >
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3200,
          center: [-10.5, 20.8] // Center of Mauritania
        }}
        className="w-full h-full absolute inset-0"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              .filter(geo => geo.properties.name === "Mauritania")
              .map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(26, 59, 142, 0.05)"}
                  stroke={isDark ? "rgba(71, 85, 105, 0.5)" : "rgba(26, 59, 142, 0.2)"}
                  strokeWidth={1}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
          }
        </Geographies>

        {connections.map((conn, idx) => (
          <Line
            key={idx}
            from={conn.from as [number, number]}
            to={conn.to as [number, number]}
            stroke={isDark ? "rgba(255, 157, 58, 0.4)" : "rgba(26, 59, 142, 0.4)"}
            strokeWidth={1.5}
            strokeLinecap="round"
            className="animate-pulse"
            style={{
              strokeDasharray: "4 4",
              animation: "dash 20s linear infinite"
            }}
          />
        ))}

        {cities.map(({ name, coordinates, dx, dy, anchor, isBold }) => (
          <Marker key={name} coordinates={coordinates as [number, number]}>
            <circle r={isBold ? 4 : 2.5} fill={isDark ? "#ff9d3a" : "#1a3b8e"} className={isBold ? "animate-pulse" : ""} />
            {isBold && (
              <circle r={8} fill={isDark ? "rgba(255, 157, 58, 0.3)" : "rgba(26, 59, 142, 0.3)"} className="animate-ping" />
            )}
            <text
              textAnchor={anchor as "start" | "middle" | "end"}
              x={dx}
              y={dy}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: isBold ? "12px" : "10px",
                fill: isDark ? "#e2e8f0" : "#333333",
                fontWeight: isBold ? 800 : 600,
                pointerEvents: "none",
              }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Foreground Logo Watermark (Inside the map) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen">
        <div className="flex flex-col items-center justify-center transform -rotate-12 scale-110 md:scale-150">
          {content.logoImage ? (
            <img src={content.logoImage} alt="Logo" className="w-64 h-64 object-contain grayscale" />
          ) : (
            <>
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-7xl shadow-2xl">
                FC
              </div>
              <span className="font-bold text-4xl tracking-tight text-brand-blue dark:text-white mt-6">
                {logoText}
              </span>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
};
