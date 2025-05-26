"use client"

import { useState } from "react"

interface SharpRLogoProps {
  className?: string
}

export function SharpRLogo({ className = "h-8 w-auto" }: SharpRLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <svg
      viewBox="0 0 140 40"
      className={`${className} transition-transform duration-300 ease-in-out ${isHovered ? "scale-105" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        outline: "none",
        pointerEvents: "none",
      }}
      focusable="false"
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes rotateGradient {
          0% { stop-color: #3B82F6; }
          50% { stop-color: #2563EB; }
          100% { stop-color: #3B82F6; }
        }
        
        @keyframes accentPulse {
          0% { stop-color: #10B981; }
          50% { stop-color: #059669; }
          100% { stop-color: #10B981; }
        }
      `}</style>

      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor="#3B82F6"
            className={isHovered ? "animate-gradient-start" : ""}
            style={isHovered ? { animation: "rotateGradient 2s infinite" } : {}}
          />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor="#10B981"
            className={isHovered ? "animate-accent-start" : ""}
            style={isHovered ? { animation: "accentPulse 2s infinite" } : {}}
          />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Sharp geometric icon - diamond/arrow shape */}
      <g
        transform="translate(8, 8)"
        className={isHovered ? "animate-pulse" : ""}
        style={isHovered ? { animation: "pulse 2s infinite" } : {}}
      >
        <path d="M12 4 L20 12 L12 20 L4 12 Z" fill="url(#logoGradient)" opacity="0.9" />
        <path
          d="M12 8 L16 12 L12 16 L8 12 Z"
          fill="url(#accentGradient)"
          className={isHovered ? "animate-rotate" : ""}
          style={isHovered ? { transformOrigin: "center", animation: "pulse 1.5s infinite" } : {}}
        />
      </g>

      {/* Text: Sharp */}
      <text
        x="36"
        y="26"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="url(#logoGradient)"
        letterSpacing="-0.5px"
      >
        Sharp
      </text>

      {/* Stylized R with geometric elements */}
      <g transform="translate(88, 8)">
        {/* R base */}
        <path
          d="M2 4 L2 20 M2 4 L10 4 Q14 4 14 8 Q14 12 10 12 L2 12 M10 12 L14 20"
          stroke="url(#accentGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Accent dot */}
        <circle
          cx="18"
          cy="8"
          r="2"
          fill="url(#accentGradient)"
          className={isHovered ? "animate-pulse" : ""}
          style={isHovered ? { transformOrigin: "center", animation: "pulse 1s infinite" } : {}}
        />
      </g>

      {/* Subtle underline */}
      <line x1="36" y1="30" x2="118" y2="30" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}
