/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors:{
      "credit-dark":"#313133",
      teal:"#008080",
      darkTeal:"#167D7F"
    },
    extend: {},
  },
  plugins: [],
}
