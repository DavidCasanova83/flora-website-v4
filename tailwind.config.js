/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: [
    'left-0',
    '-left-[300px]'
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '15px',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      lineHeight: {
        '120': '120%',
      },
      colors: {
        'primary': '#242a2b',
        'secondary': '#808080',
        'customBg': 'rgba(255, 255, 255, 0.1)',
        accent: {
          DEFAULT: '#e2bb9e',
          secondary: '#FFFFFF',
          tertiary: '#F5C39E',
        },
        grey: '#EEEAE6',
      },
      fontFamily: {
        primary: 'Poppins',
      },
      boxShadow: {
        custom1: '0 2px 40px 0 rgba(8, 70, 78, 0.08)',
        custom2: '0 0px 30px 0 rgba(8, 73, 81, 0.06)',
      },
      backgroundImage: { 
        design: "url('/assets/img/design/bg-design.avif')",
        services: "url('/assets/img/services/bg.png')",
        testimonials: "url('/assets/img/testimonials/bg.png')",
        departments: "url('/assets/img/departments/bg.svg')",
        quoteLeft: "url('/assets/icons/testimonials/quote-left.svg')",
        quoteRight: "url('/assets/icons/testimonials/quote-right.svg')",
      },
    },
  },
  plugins: [],
};