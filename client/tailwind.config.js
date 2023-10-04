/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        customBlue: "#1b3474",
      },
      fontSize: {
        tooltipsm: ["0.675rem", "0.8rem"]
      }
    }

  },

  plugins: [
    require('flowbite/plugin')
  ]
};
