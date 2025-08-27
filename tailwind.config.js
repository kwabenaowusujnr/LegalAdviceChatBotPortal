/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          DEFAULT: '#FEC628', // Amber Yellow – heritage, pride
        },
        forest: {
          DEFAULT: '#228B22', // Forest Green – renewal, stability
        },
        royal: {
          DEFAULT: '#6A0DAD', // Royal Purple – dignity, wisdom
        },
        deepred: {
          DEFAULT: '#8B0000', // Deep Red – resilience & sacrifice
        },
        sand: {
          DEFAULT: '#F4E1C1', // Neutral Sand – background contrast
        },
      },
    },
  },
  plugins: [],
};
