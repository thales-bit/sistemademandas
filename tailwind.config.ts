import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f6fb",
          100: "#e3eaf5",
          200: "#c2d2e8",
          300: "#8faecf",
          400: "#5984b3",
          500: "#3a6498",
          600: "#2c4f7d",
          700: "#264266",
          800: "#233a56",
          900: "#1d2f44",
          950: "#131f2e",
        },
        gold: {
          400: "#d4af6a",
          500: "#c39a4d",
          600: "#a87f37",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
