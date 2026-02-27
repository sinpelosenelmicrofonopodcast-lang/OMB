import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        matteBlack: "#020202",
        charcoal: "#0B1016",
        gold: "#FF7A1A",
        cyan: "#14B9E7",
        softWhite: "#F4F7FB"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 14px 30px rgba(0,0,0,0.58)",
        glow: "0 0 0 1px rgba(20,185,231,0.28), 0 0 0 2px rgba(255,122,26,0.16), 0 18px 42px rgba(0,0,0,0.62)"
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
