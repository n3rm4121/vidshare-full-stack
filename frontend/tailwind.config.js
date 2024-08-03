/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial'],
      },
      colors: {
        primary: 'teal',
      },
    },
  },
  plugins: [],
}
