import { TypographyOptions } from '@mui/material/styles/createTypography'

const typography: TypographyOptions = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",

  h1: {
    fontWeight: 700,
    fontSize: '1.75rem', // 28px
    lineHeight: 1.3,
  },
  h2: {
    fontWeight: 600,
    fontSize: '1.5rem', // 24px
    lineHeight: 1.3,
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.25rem', // 20px
    lineHeight: 1.3,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.125rem', // 18px
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1rem', // 16px
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 600,
    fontSize: '0.938rem', // 15px
    lineHeight: 1.4,
  },

  body1: {
    fontSize: '0.938rem', // 15px
    fontWeight: 400,
    lineHeight: 1.4,
  },
  body2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.4,
  },

  subtitle1: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  subtitle2: {
    fontSize: '0.813rem', // 13px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },

  button: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.938rem', // 15px
    letterSpacing: '0.01em',
  },
} as const

export default typography
