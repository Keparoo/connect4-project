/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {enabled: true, content: ['./build/**/*.html']},
  content: ['./*.{html, js}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
