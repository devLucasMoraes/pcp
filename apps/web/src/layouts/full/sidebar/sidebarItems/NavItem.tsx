import {
  alpha,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material'
import { NavLink } from 'react-router'

type NavItem = {
  id?: string
  title?: string
  icon?: any
  href?: string
  external?: boolean
  disabled?: boolean
}

interface Props {
  item: NavItem
  pathDirect: string
  onClick?: () => void
}

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.mode === 'dark' ? 0.2 : 0.08,
    ),
    color:
      theme.palette.primary[theme.palette.mode === 'dark' ? 'light' : 'main'],

    '& .MuiListItemIcon-root': {
      color:
        theme.palette.primary[theme.palette.mode === 'dark' ? 'light' : 'main'],
    },
  },

  '&.Mui-selected': {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.mode === 'dark' ? 0.25 : 0.12,
    ),
    color:
      theme.palette.primary[theme.palette.mode === 'dark' ? 'light' : 'main'],

    '& .MuiListItemIcon-root': {
      color:
        theme.palette.primary[theme.palette.mode === 'dark' ? 'light' : 'main'],
    },

    '&:hover': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.mode === 'dark' ? 0.3 : 0.15,
      ),
    },
  },
})) as typeof ListItemButton

const NavItem = ({ item, pathDirect, onClick }: Props) => {
  const Icon = item.icon
  const isSelected = pathDirect === item.href

  return (
    <List component="div" disablePadding>
      <StyledListItem
        component={item.external ? 'a' : NavLink}
        to={item.href}
        href={item.external ? item.href : ''}
        disabled={item.disabled}
        selected={isSelected}
        target={item.external ? '_blank' : ''}
        onClick={onClick}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: 'inherit',
              transition: 'color 0.2s ease-in-out',
            }}
          >
            <Icon stroke={1.5} size="1.3rem" />
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.title}
          slotProps={{
            primary: {
              sx: {
                fontSize: '0.875rem',
                fontWeight: isSelected ? 600 : 400,
              },
            },
          }}
        />
      </StyledListItem>
    </List>
  )
}

export default NavItem
