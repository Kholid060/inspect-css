module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
     './src/**/*.vue',
    ],
  },
  theme: {
    borderRadius: {
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.5rem',
      lg: '0.9375rem',
      full: '9999px',
    },
    extend: {
      colors: {
        primary: '#4299E1',
        'primary-light': '#63B3ED',
        warning: '#ECC94B',
        danger: '#F56565',
        orange: '#F6AD55',
      },
      backgroundColor: {
        default: '#2d3748',
        light: 'rgba(255, 255, 255, 0.05)',
      },
      textColor: {
        default: '#f7f7f7',
        light: '#efefef',
      },
    },
  },
};