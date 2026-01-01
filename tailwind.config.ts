import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fef7f7',
          100: '#fceef0',
          200: '#f8d7d7',
          300: '#f4c2c2',
          400: '#e8a8a8',
          500: '#d89a9a',
          600: '#c88a8a',
        },
        beige: {
          50: '#fefcfb',
          100: '#faf8f6',
          200: '#f5f1eb',
          300: '#e8e3db',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
