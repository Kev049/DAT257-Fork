/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "dosis": ['Dosis', 'sans-serif'],
        "ubuntu": ['Ubuntu Condensed', 'sans-serif'],
        "oswald": ['Oswald', 'sans-serif']
      }
    },
  },
};

