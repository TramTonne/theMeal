// tailwind.config.js
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          akzidenz: ['"Akzidenz-Grotesk"', 'sans-serif'],
        },
        colors: {
          primaryPurple: '#8b61c2',
        },
      },
    },
    plugins: [],
  };

