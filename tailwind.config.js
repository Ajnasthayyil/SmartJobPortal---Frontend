module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        talex: {
          black:  '#0a0a0a',
          amber:  '#f59e0b',
          white:  '#ffffff',
          gray:   '#6b7280',
          border: '#e5e7eb',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
}