import DatePicker from "react-datepicker"
/** @type {import('tailwindcss').Config} */
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {}},
  plugins: [],
};

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "cupcake", "emerald", "corporate"],
  },
};
