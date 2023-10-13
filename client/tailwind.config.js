/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],

  theme: {
    extend: {
      colors: {
        customBlue: "#1B3474",
        customTextBlue: "#1434A4",
        customPink: "#F6A6C2",
        customYellow: "#FFE786",
        customGreen: "#8AABFF",
        customPurple: "#CC8AFF",
        customGray: "#212529",
        customLightblue: "#405AA3",
        customDarkpuprle: "#8223cb"
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
