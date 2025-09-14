/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#F0F9FF',
        'surface': '#FFFFFF',
        'surface-container': '#E0F2FE',
        'primary': '#0284C7',
        'on-primary': '#FFFFFF',
        'secondary': '#334155',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#CBD5E1',
        'on-secondary-container': '#1E293B',
        'tertiary': '#0891B2',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#CFFAFE',
        'on-tertiary-container': '#0E7490',
        'error': '#B91C1C',
        'on-error': '#FFFFFF',
        'error-container': '#FEE2E2',
        'on-error-container': '#991B1B',
        'on-surface': '#1E293B',
        'on-surface-variant': '#475569',
        'outline': '#94A3B8',
        'shadow': '#000000',
        'inverse-surface': '#1E293B',
        'inverse-on-surface': '#F1F5F9',
        'inverse-primary': '#7DD3FC',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
