/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d2691e',
        'primary-dark': '#a0521a',
        secondary: '#6ba832',
        accent: '#f5c842',
      },
    },
  },
  plugins: [],
}

