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
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // This is the gray-500 you're missing
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: '#48BB78',
        warning: '#ED8936',
        danger: '#F56565',
      }
    },
  },
  plugins: [],
}

