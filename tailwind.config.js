/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors:{
      "credit-dark":"#313133",
      teal:"#008080",
      darkTeal:"#167D7F",
      cloud:"#f2f2f2",
      white:"#ffff",
      text: '#0D163A',
      grayText:"#959595",
      blue:"#2b68f5"
    },
    extend: {},
  },
  plugins: [],
}
