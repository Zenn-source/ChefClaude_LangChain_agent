/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // You can add your palette colors here if you want to use
      // them as Tailwind utilities (e.g., bg-slate-surface)
      colors: {
        chef: {
          slate: "#0a0e14",
          midnight: "#070d1a",
          obsidian: "#0a0a0a",
          espresso: "#120e0a",
        },
      },
    },
  },
  plugins: [],
};
