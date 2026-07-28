import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          glow: "rgba(79, 70, 229, 0.25)",
        },
        background: "#09090B",
        surface: "#18181B",
        surfaceHover: "#27272A",
        text: {
          main: "#FAFAFA",
          muted: "#A1A1AA",
        },
        border: "#27272A",
      },
      fontFamily: {
        heading: ["var(--font-outfit)"],
        body: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      boxShadow: {
        premium: "0 50px 100px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
