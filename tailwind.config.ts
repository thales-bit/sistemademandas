import type { Config } from "tailwindcss";

// Escala "brand" remapeada para o tema Gelo Diário:
// - tons baixos (50-100) = tinta gelo clara (fundos de destaque, badges)
// - tons médios (500-700) = acento ciano profundo (links, ações, títulos de seção)
// - tons altos (800-950) = texto quase-preto frio (títulos)
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E1F2F8",
          100: "#D0E9F1",
          200: "#B4DAE7",
          300: "#8FC4D8",
          400: "#4F9DBB",
          500: "#0F7C9C",
          600: "#0A6F8E",
          700: "#0A6F8E",
          800: "#1B2730",
          900: "#131A21",
          950: "#0C1319",
        },
        gold: {
          400: "#4F9DBB",
          500: "#0A6F8E",
          600: "#0F7C9C",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
