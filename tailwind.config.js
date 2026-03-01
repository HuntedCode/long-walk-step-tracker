/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        base: {
          100: '#232931',
          200: '#191E24',
          300: '#15191E',
          content: '#ECF9FF',
        },
        primary: {
          DEFAULT: '#28EBFF',
          content: '#091307',
        },
        secondary: {
          DEFAULT: '#8C93FF',
          content: '#091307',
        },
        accent: {
          DEFAULT: '#FF8C64',
          content: '#091307',
        },
        neutral: {
          DEFAULT: '#09090B',
          content: '#E4E4E7',
        },
        info: {
          DEFAULT: '#009FFF',
          content: '#091307',
        },
        success: {
          DEFAULT: '#62EFBD',
          content: '#091307',
        },
        warning: {
          DEFAULT: '#FFEA2C',
          content: '#091307',
        },
        error: {
          DEFAULT: '#FF5B71',
          content: '#091307',
        },
      },
    },
  },
  plugins: [],
};
