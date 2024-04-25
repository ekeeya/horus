/** @type {import('tailwindcss').Config} */
const colors = require('./src/theme/colors');

module.exports = {
  content: [
    './index.{js,ts,jsx,tsx}',
    './App.{js,ts,jsx,tsx}',
    './src/screens/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/components/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
};
