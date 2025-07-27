/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        'background-color': '#1a202c',
        'card-background-color': '#2d3748',
        'text-color': '#EAEAEA',
        'primary-accent': '#00BFFF',
        'primary-accent-hover': '#0099CC',
        'status-success': '#38A169',
        'secondary-bg': '#1a202c',
        'modal-bg': 'var(--card-background-color)',
        'text-muted': '#A0AEC0',
        'text-dark': '#000000',
        'border-color': '#4A5568',
        'status-green': 'var(--status-success-color)',
        'status-yellow': '#FFD700',
        'status-red': '#FF4757',
      },
      boxShadow: {
        'input-glow': '0 0 15px 5px rgba(0, 191, 255, .4)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};