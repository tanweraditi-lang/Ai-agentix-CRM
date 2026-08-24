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
          primary: '#EC4899',       // Primary Pink
          bg: '#FCE7F3',            // Light Pink Background
          card: '#FFFFFF',          // White Background
          text: '#111827',          // Text Dark Color
          accent: '#BE185D',        // Accent Deep Pink
          border: '#FBCFE8',        // Soft Pink Border
        }
      }
    },
  },
  plugins: [],
}
