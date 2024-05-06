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
    screens: {
      sm: '300px',
      md: '400px',
      lg: '500px',
      xlg: '600px',
    },
  },
  plugins: [],
};
