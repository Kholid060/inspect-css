module.exports = {
  prefix: 'ui-',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.vue'],
  },
  theme: {
    borderRadius: {
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.5rem',
      lg: '0.9375rem',
      full: '9999px',
    },
    borderColor: theme => ({
      ...theme('colors'),
      default: 'rgba(255, 255, 255, 0.15)',
    }),
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
      40: '160px',
      48: '192px',
      56: '224px',
      64: '256px',
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
        light: '#384151',
      },
      textColor: {
        default: '#f7f7f7',
        light: '#efefef',
      },
    },
  },
};
