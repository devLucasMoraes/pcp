import { Box, CircularProgress } from '@mui/material'

const LoadingScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={(theme) => theme.palette.background.default}
    >
      <CircularProgress />
    </Box>
  )
}

export default LoadingScreen
