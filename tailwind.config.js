/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "dosis": ['Dosis', 'sans-serif'],
        "oswald": ['Oswald', 'sans-serif']
      }
    },
  },
  plugins: [],
};

