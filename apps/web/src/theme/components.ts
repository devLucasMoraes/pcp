import { alpha, Components, Theme } from '@mui/material'

const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.3s ease, color 0.3s ease',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        transition: 'box-shadow 0.2s ease-in-out',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
      },
      contained: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
          transform: 'translateY(-1px)',
        },
        '&:active': {
          backgroundColor: theme.palette.primary.dark,
          transform: 'translateY(0)',
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          borderColor: theme.palette.primary.dark,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
      }),
      text: ({ theme }) => ({
        color: theme.palette.primary.main,
        position: 'relative',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '8px',
        margin: '2px 8px',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
          },
        },
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
          },
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: '40px',
        color: 'inherit',
        transition: 'color 0.2s ease-in-out',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
      }),
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: '70px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: theme.palette.background.paper,
        transition: 'box-shadow 0.2s ease-in-out',
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`
            : `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
      }),
      elevation1: ({ theme }) => ({
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 2px 4px ${alpha(theme.palette.common.black, 0.12)}`
            : `0 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
      }),
      elevation8: ({ theme }) => ({
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 8px 16px ${alpha(theme.palette.common.black, 0.18)}`
            : `0 8px 16px ${alpha(theme.palette.common.black, 0.08)}`,
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
        borderRadius: '12px',
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 8px 32px ${alpha(theme.palette.common.black, 0.24)}`
            : `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
      }),
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.12)
            : alpha(theme.palette.common.black, 0.08),
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.12)
              : alpha(theme.palette.common.black, 0.12),
          transition: 'border-color 0.2s ease-in-out',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.2)
              : alpha(theme.palette.common.black, 0.2),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '2px',
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.12)
            : alpha(theme.palette.common.black, 0.08)
        }`,
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        },
      }),
    },
  },
}

export default components
