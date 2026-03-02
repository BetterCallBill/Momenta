export const colors = {
  gold: {
    50: "#FFF9E6",
    100: "#FFF0B3",
    200: "#FFE680",
    300: "#FFDB4D",
    400: "#FFD11A",
    500: "#D4A017",
    600: "#B8860B",
    700: "#8B6914",
    800: "#5E4609",
    900: "#312305",
  },
  black: "#0A0A0A",
  white: "#FAFAFA",
  neutral: {
    50: "#F5F5F5",
    100: "#EBEBEB",
    200: "#D6D6D6",
    300: "#B8B8B8",
    400: "#8A8A8A",
    500: "#6B6B6B",
    600: "#3A3A3A",
    700: "#2A2A2A",
    800: "#1C1C1C",
    900: "#171717",
  },
} as const;

export const fontFamily = {
  sans: ["Inter", "system-ui", "sans-serif"],
} as const;

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "20px",
} as const;

export const spacing = {
  sectionY: "5rem",
  sectionYLg: "7rem",
} as const;

export const shadows = {
  soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
  medium: "0 4px 16px rgba(0, 0, 0, 0.12)",
  glow: "0 0 20px rgba(212, 160, 23, 0.08)",
} as const;
