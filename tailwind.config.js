const plugin = require('tailwindcss/plugin');

const rotateY = plugin(function({addUtilities}){
  addUtilities({
    '.rotate-y-0': {
      transform: 'rotateY(0deg)',
    },
    '.rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
    '.rotate-y-n-180': {
      transform: 'rotateY(-180deg)',
    }
  });
});

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      fontFamily: {
        'grotesk': ['neue-haas-grotesk-display', 'sans-serif'],
        'sans': [
          '"Patrick Hand"'
        ]
     },
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [rotateY],
  }
