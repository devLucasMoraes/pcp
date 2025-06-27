import { createTheme } from '@mui/material'
import { ptBR as MaterialLocale } from '@mui/material/locale'
import { ptBR as DataGridLocale } from '@mui/x-data-grid/locales'

import components from './components'
import typography from './Typography'

// Common colors between themes - these maintain consistency across modes
const commonColors = {
  primary: {
    main: '#636BFF',
    light: '#ECF2FF',
    dark: '#5969FF',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7DCCFF',
    light: '#E8F7FF',
    dark: '#49BEFF',
    contrastText: '#ffffff',
  },
  success: {
    main: '#13DEB9',
    light: '#E6FFFA',
    dark: '#02b3a9',
    contrastText: '#ffffff',
  },
  info: {
    main: '#539BFF',
    light: '#EBF3FE',
    dark: '#1682d4',
    contrastText: '#ffffff',
  },
  error: {
    main: '#FA896B',
    light: '#FDEDE8',
    dark: '#f3704d',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#FFAE1F',
    light: '#FEF5E5',
    dark: '#ae8e59',
    contrastText: '#ffffff',
  },
}

// Light mode specific configuration
const lightPalette = {
  mode: 'light' as const,
  ...commonColors,
  background: {
    default: '#F2F6FA', // Light grey background
    paper: '#ffffff',
  },
  text: {
    primary: '#2A3547',
    secondary: '#5A6A85',
  },
  grey: {
    100: '#F2F6FA',
    200: '#EAEFF4',
    300: '#DFE5EF',
    400: '#7C8FAC',
    500: '#5A6A85',
    600: '#2A3547',
  },
  action: {
    active: '#636BFF',
    hover: '#f6f9fc',
    selected: 'rgba(99, 107, 255, 0.08)',
    disabled: 'rgba(73, 82, 88, 0.26)',
    disabledBackground: 'rgba(73, 82, 88, 0.12)',
    focus: 'rgba(99, 107, 255, 0.12)',
    hoverOpacity: 0.02,
  },
  divider: '#e5eaef',
}

// Dark mode specific configuration
const darkPalette = {
  mode: 'dark' as const,
  ...commonColors,
  background: {
    default: '#1a1f2b', // Darker background
    paper: '#242836', // Slightly lighter than background
  },
  text: {
    primary: '#e2e8f0',
    secondary: '#94a3b8',
  },
  grey: {
    100: '#2A3547',
    200: '#242836',
    300: '#374151',
    400: '#94a3b8',
    500: '#64748b',
    600: '#e2e8f0',
  },
  action: {
    active: '#636BFF',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(99, 107, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(99, 107, 255, 0.12)',
    hoverOpacity: 0.04,
  },
  divider: 'rgba(255, 255, 255, 0.12)',
}

// Theme creation function
export const getTheme = (mode: 'light' | 'dark') =>
  createTheme(
    {
      direction: 'ltr',
      palette: mode === 'light' ? lightPalette : darkPalette,
      typography,
      components,
      shape: {
        borderRadius: 8,
      },
    },
    DataGridLocale,
    MaterialLocale,
  )
