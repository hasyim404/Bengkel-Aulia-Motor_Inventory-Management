/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "color-1": "#078080",
        "color-2": "#EFE8E1",
        "color-3": "#F8F5F2",
        "color-4": "#767676",
        "color-5": "#23232",
        "color-6": "#FFFFFE",
        "6hover": "#056A6A",
        "color-danger": "#E3B84A",
        "color-warning": "#E34A4A",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("preline/plugin")],
};
