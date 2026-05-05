/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    extend: {
      container: {
        center: true,
        padding: '1rem'
      }
    }
  },
  plugins: [forms]
}

