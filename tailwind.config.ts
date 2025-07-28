import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-color': '#1a202c',
        'card-background-color': '#2d3748',
        'text-color': '#EAEAEA',
        'primary-accent-color': '#00BFFF',
        'status-success-color': '#38A169',
        'secondary-bg': '#1a202c',
        'primary-accent-hover': '#0099CC',
        'text-muted': '#A0AEC0',
        'text-dark': '#000000',
        'border-color': '#4A5568',
        'status-green': '#38A169',
        'status-yellow': '#FFD700',
        'status-red': '#FF4757',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;