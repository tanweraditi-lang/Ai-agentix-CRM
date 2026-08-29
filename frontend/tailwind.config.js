/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crm: {
          primary: '#F26522',       // AI-Agentix Primary Orange
          bg: '#FFF6F1',            // Light Orange Background
          card: '#FFFFFF',          // White Card Background
          text: '#111111',          // Dark Text
          accent: '#D9531E',        // Deep Orange Accent
          border: '#FFDCD0',        // Soft Orange Border
        }
      }
    },
  },
  plugins: [],
}
