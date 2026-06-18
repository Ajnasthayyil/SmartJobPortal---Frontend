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
        },
        jobfin: {
          primary: '#10b981',
          bg: '#F9F8F6',
          dark: '#0F1016',
          purple: '#E3DBFA',
          yellow: '#FFF3D2',
          blue: '#D5F0FF',
          pink: '#FCE5E4',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
}