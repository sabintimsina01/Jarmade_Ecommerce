export default {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './server/**/*.js',
    './routes/**/*.js',
    './controllers/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FDF6EC',
          sage: '#7C9A6E',
          terracotta: '#7A3E4D',
          gold: '#E9DADF',
          brown: '#2C1A0E',
          lightbrown: '#8a6b56',
          border: '#e7d8c4'
        }
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif']
      }
    }
  }
};
