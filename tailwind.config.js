/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: {
          DEFAULT: "var(--color-paper)",
          card: "var(--color-paper-card)",
          border: "var(--color-border)",
        },
        transit: {
          ee: "#ff6319",
          aero: "#0039a6",
          polisci: "#ee352e",
          hub: "#18181b",
          muted: "#71717a",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        editorial: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-ibm-plex-mono)", "Menlo", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
