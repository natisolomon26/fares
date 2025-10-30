/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9", // Soft sky blue (trust, calm)
          600: "#0284c7",
        },
        accent: {
          500: "#16a34a", // Gentle green (growth, peace)
        },
        background: "#ffffff",
        surface: "#fafafa",
        text: {
          primary: "#1e293b", // Slate-800
          secondary: "#475569", // Slate-600
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
