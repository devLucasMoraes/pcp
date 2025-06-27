import { styled } from '@mui/material'
import { Link } from 'react-router'

// eslint-disable-next-line import/no-absolute-path
import LogoLight from '/assets/images/logos/light-logo.svg'

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}))

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '70px',
      }}
    >
      <img src={LogoLight} alt="Logo" />
    </LinkStyled>
  )
}

export default Logo
