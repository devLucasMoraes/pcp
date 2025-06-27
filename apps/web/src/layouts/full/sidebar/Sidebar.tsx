import {
  alpha,
  Box,
  Drawer,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import Logo from '../shared/Logo'
import SidebarItems from './sidebarItems'

// Sidebar width constant
const SIDEBAR_WIDTH = 270

// Base drawer styles with theme integration
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    boxShadow: `0 0.5rem 1.25rem ${alpha(theme.palette.grey[500], 0.1)}`,
    backgroundColor: theme.palette.background.paper,
  },
}))

const ScrollableBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: theme.spacing(1),
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.grey[500], 0.2),
    borderRadius: theme.shape.borderRadius / 2,
  },
}))

const BorderBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

interface SidebarProps {
  isMobileSidebarOpen: boolean
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void
  isSidebarOpen: boolean
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: SidebarProps) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const theme = useTheme()

  // Desktop sidebar
  if (lgUp) {
    return (
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
        {/* Permanent drawer for desktop */}
        <StyledDrawer anchor="left" open={isSidebarOpen} variant="permanent">
          {/* Main sidebar container */}
          <Box
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {/* Logo section */}
            <BorderBox px={3}>
              <Logo />
            </BorderBox>

            {/* Navigation items with scroll */}

            <ScrollableBox>
              <SidebarItems />
            </ScrollableBox>
          </Box>
        </StyledDrawer>
      </Box>
    )
  }

  // Mobile sidebar
  return (
    <StyledDrawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      sx={{
        boxShadow: theme.shadows[8],
      }}
    >
      {/* Mobile logo section */}
      <Box px={2}>
        <Logo />
      </Box>
      {/* Mobile navigation */}
      {isMobileSidebarOpen && (
        <ScrollableBox>
          <SidebarItems />
        </ScrollableBox>
      )}
    </StyledDrawer>
  )
}

export default Sidebar
