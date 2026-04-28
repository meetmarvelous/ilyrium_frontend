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
          DEFAULT: "#2F40D1",
          glow: "rgba(47, 64, 209, 0.15)",
        },
        background: "#FFFFFF",
        surface: "#F9F9FB",
        text: {
          main: "#1A1A1A",
          muted: "#666666",
        },
        border: "#EEEEEE",
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
