/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#1B3474",
        customPink: "#F6A6C2",
        customYellow: "#FFE786",
        customGreen: "#8AABFF",
        customPurple: "#CC8AFF",
        customGray: "#212529",
        customLightblue: "#405AA3",
        customDarkpuprle: "#8223cb"
      },
    },
  },
  plugins: [],
};
