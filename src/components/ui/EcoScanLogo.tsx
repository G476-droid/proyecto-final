import React from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

type EcoScanLogoProps = {
  size?: number;
};

export const EcoScanLogo = ({ size = 68 }: EcoScanLogoProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Defs>
        <LinearGradient id="ecoGradient" x1="16" y1="14" x2="74" y2="78">
          <Stop offset="0" stopColor="#D7F3E5" />
          <Stop offset="1" stopColor="#79C59F" />
        </LinearGradient>
        <LinearGradient id="scanGradient" x1="48" y1="18" x2="48" y2="78">
          <Stop offset="0" stopColor="#0F5E45" />
          <Stop offset="1" stopColor="#103B2D" />
        </LinearGradient>
      </Defs>

      <Circle cx="48" cy="48" r="40" fill="url(#ecoGradient)" />
      <Circle
        cx="48"
        cy="48"
        r="31"
        stroke="#FFFFFF"
        strokeOpacity="0.32"
        strokeWidth="2.5"
      />
      <Circle
        cx="48"
        cy="48"
        r="20"
        stroke="#FFFFFF"
        strokeOpacity="0.42"
        strokeWidth="2"
      />
      <Path
        d="M48 20C59.8 20 69.73 28.06 72.58 39H67.2C64.56 31.08 57.05 25.38 48.2 25.38C39.35 25.38 31.84 31.08 29.2 39H23.82C26.67 28.06 36.6 20 48 20Z"
        fill="url(#scanGradient)"
        opacity="0.9"
      />
      <Circle cx="48" cy="48" r="4.5" fill="#FFFFFF" />
      <Path
        d="M47.08 62.82C36.38 63.72 29.1 58.25 26.36 48.3C36.47 47.42 43.9 52.8 47.08 62.82Z"
        fill="#31A26C"
      />
      <Path
        d="M48.92 62.82C59.62 63.72 66.9 58.25 69.64 48.3C59.53 47.42 52.1 52.8 48.92 62.82Z"
        fill="#1D7C56"
      />
      <Ellipse
        cx="47.96"
        cy="52.85"
        rx="3.4"
        ry="13.6"
        transform="rotate(1.2 47.96 52.85)"
        fill="url(#scanGradient)"
      />
      <Path
        d="M48 45.5L58.7 34.8"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="60.5" cy="33.1" r="5.5" fill="#FFFFFF" fillOpacity="0.95" />
      <Circle cx="60.5" cy="33.1" r="2.1" fill="#0F5E45" />
    </Svg>
  );
};
