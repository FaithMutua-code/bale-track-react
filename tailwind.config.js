/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5D5FEF',
        'primary-light': '#E0E1FF',
        secondary: '#4FD1C5',
        dark: '#2D3748',
        light: '#F7FAFC',
        gray: '#A0AEC0',
        success: '#48BB78',
        warning: '#ED8936',
        danger: '#F56565',
      }
    },
  },
  plugins: [],
}

