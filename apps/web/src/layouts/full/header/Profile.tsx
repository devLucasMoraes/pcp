import {
  alpha,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material'
import {
  IconListCheck,
  IconLogout,
  IconMail,
  IconUser,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuthStore } from '../../../stores/auth-store'

interface ProfileOption {
  icon: typeof IconUser
  label: string
  onClick?: () => void
  divider?: boolean
}

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const theme = useTheme()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/auth/login')
  }

  const profileOptions: ProfileOption[] = [
    {
      icon: IconUser,
      label: 'Meu Perfil',
      onClick: () => {
        /* Implementar navegação */
      },
    },
    {
      icon: IconMail,
      label: 'Minha Conta',
      onClick: () => {
        /* Implementar navegação */
      },
    },
    {
      icon: IconListCheck,
      label: 'Minhas Tarefas',
      onClick: () => {
        /* Implementar navegação */
      },
      divider: true,
    },
    {
      icon: IconLogout,
      label: 'Sair',
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <Tooltip title="Configurações da conta" placement="bottom">
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{
            ml: 1,
            p: 0.5,
            color: 'text.primary',
            bgcolor: open
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Avatar
            // src={user?.image}
            alt={user?.name || 'Usuário'}
            sx={{
              width: 35,
              height: 35,
              border: open
                ? `2px solid ${theme.palette.primary.main}`
                : '2px solid transparent',
              transition: 'border-color 0.2s ease-in-out',
            }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          root: {
            'aria-labelledby': 'profile-button',
          },
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
              mt: 1.5,
              width: 220,
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
        <MenuItem
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 2,
          }}
        >
          <div>
            <div className="text-sm font-semibold">
              {user?.name || 'Usuário'}
            </div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </MenuItem>

        {profileOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <div key={index}>
              <MenuItem
                onClick={option.onClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Icon
                  width={18}
                  height={18}
                  style={{
                    color: theme.palette.text.secondary,
                  }}
                />
                {option.label}
              </MenuItem>
              {option.divider && <Divider />}
            </div>
          )
        })}
      </Menu>
    </>
  )
}

export default Profile
