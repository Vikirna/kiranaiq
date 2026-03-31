/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kirana: {
          brown:  '#C07841',
          earth:  '#8A7055',
          green:  '#6B8F47',
          orange: '#B8622A',
          cream:  '#FDF6ED',
          dark:   '#2C1810',
          light:  '#FAF0E6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}