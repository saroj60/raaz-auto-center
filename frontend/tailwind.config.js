/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0c0e14',
        surface: '#12131a',
        'surface-dim': '#12131a',
        'surface-container': '#1a1b22',
        'surface-container-high': '#23252e',
        'surface-container-highest': '#2c2e3a',
        primary: '#ffb59e',
        'primary-container': '#ff571a',
        secondary: '#ffb3b1',
        'secondary-container': '#ad0224',
        'on-surface': '#e2e1eb',
        'on-surface-variant': '#e6beb2',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        soft: '4px',
      }
    },
  },
  plugins: [],
}
