/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '740px',
        lg: '960px',
        xl: '1140px',
        '2xl': '1440px',
      },
    },
    extend: {
      maxWidth: {
        "big-2xl": "1640px",
      }
    },
  },
  plugins: [],
}
