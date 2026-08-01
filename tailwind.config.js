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
        navy: {
          50: '#E8EDF5',
          100: '#C5D3EA',
          200: '#8FA9D4',
          300: '#5A7FBE',
          400: '#1B3A6B',
          500: '#042554',
          600: '#031E45',
          700: '#051836',
          800: '#030F24',
          900: '#010814',
          950: '#000509',
        },
        brand: {
          green: '#005C27',
          'green-light': '#327B2F',
          gold: '#F5AB00',
          amber: '#EAA503',
        },
        foundation: {
          bg: '#FDFCF9',
          card: '#FFFFFF',
          text: '#051836',
          muted: '#5A6B80',
        },
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
