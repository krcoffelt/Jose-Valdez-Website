import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0C",
        surface: "#131316",
        text: "#ECECEC",
        gold: "#C9A362",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;

