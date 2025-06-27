import { ListSubheader, styled } from '@mui/material'

const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.overline,
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(0.375, 1.5),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  lineHeight: '26px',
  letterSpacing: '0.5px',
}))

interface NavGroupItem {
  navlabel?: boolean
  subheader?: string
}

interface NavGroupProps {
  item: NavGroupItem
}

const NavGroup = ({ item }: NavGroupProps) => (
  <StyledSubheader disableSticky disableGutters>
    {item.subheader}
  </StyledSubheader>
)

export default NavGroup
