/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00193c",
        secondary: "#3b6934",
        surface: "#f7f9fb",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-low": "#f2f4f6",
        "on-surface": "#191c1e",
        "on-surface-variant": "#43474f",
        bg: {
          DEFAULT: "var(--bg)",
          2: "var(--bg-2)",
          3: "var(--bg-3)",
          4: "var(--bg-4)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
        },
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
        }
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Public Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
}
