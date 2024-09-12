/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dinnext-light': ['DINNextLight'],
        'dinnext-regular': ['DINNextRegular'],
        'dinnext-medium': ['DINNextMedium'],
      }
    },
  },
  plugins: [],
}

