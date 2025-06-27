import {
  alpha,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material'
import { IconDeviceDesktop, IconMoonStars, IconSun } from '@tabler/icons-react'
import { useState } from 'react'

import { useThemeMode } from '../../../hooks/useThemeMode'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeOption {
  value: ThemeMode
  label: string
  icon: typeof IconSun | typeof IconMoonStars | typeof IconDeviceDesktop
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Modo Claro', icon: IconSun },
  { value: 'dark', label: 'Modo Escuro', icon: IconMoonStars },
  { value: 'system', label: 'Sistema', icon: IconDeviceDesktop },
]

export default function ThemeToggle() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const theme = useTheme()

  const { mode, setMode } = useThemeMode()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode)
    handleClose()
  }

  const currentTheme = themeOptions.find((option) => option.value === mode)
  const CurrentIcon = currentTheme?.icon || IconSun

  return (
    <>
      <Tooltip title="Alterar tema" placement="bottom">
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{
            ml: 1,
            p: 1,
            color: 'text.primary',
            bgcolor: open
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <CurrentIcon width={22} height={22} />
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          root: {
            'aria-labelledby': 'theme-button',
          },
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
              mt: 1.5,
              minWidth: 200,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.5,
                typography: 'body2',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {themeOptions.map((option) => {
          const Icon = option.icon
          return (
            <MenuItem
              key={option.value}
              selected={mode === option.value}
              onClick={() => handleModeChange(option.value)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <Icon
                width={18}
                height={18}
                style={{
                  color:
                    mode === option.value
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                }}
              />
              {option.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
