/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pwlif: {
          navy: "#051836",
          "medium-blue": "#042554",
          green: "#005C27",
          leaf: "#327B2F",
          gold: "#F5AB00",
          cream: "#FDFCF9",
        },
      },
    },
  },
  plugins: [],
};
