/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

const primaryColor = 'cyan';

module.exports = {
  content: ['./src/**/*.{html,js,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        light: colors[primaryColor][100],
        primary: colors[primaryColor][500],
        dark: colors[primaryColor][600],
        light_btn: colors[primaryColor][200],
        light_btn_hover: colors[primaryColor][300],
        solid_btn_hover: colors[primaryColor][600],
        btn_hover: colors.gray[50],
        btn_active: colors.gray[100]
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), 
    require('@tailwindcss/typography'),]
};
