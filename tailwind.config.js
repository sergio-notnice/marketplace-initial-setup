/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        neutral: {
          850: '#1f2937',
        },
      },
      transitionProperty: {
        'width': 'width',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};