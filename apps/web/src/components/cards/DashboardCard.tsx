import {
  Box,
  Card,
  CardContent,
  Stack,
  styled,
  Typography,
} from '@mui/material'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.background.paper,
  elevation: theme.palette.mode === 'dark' ? 2 : 1,
}))

type Props = {
  title?: string
  subtitle?: string
  action?: JSX.Element
  footer?: JSX.Element
  cardheading?: string | JSX.Element
  headtitle?: string | JSX.Element
  headsubtitle?: string | JSX.Element
  children?: JSX.Element
  middlecontent?: string | JSX.Element
}

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}: Props) => {
  if (cardheading) {
    return (
      <StyledCard>
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
        {middlecontent}
        {footer}
      </StyledCard>
    )
  }

  return (
    <StyledCard>
      <CardContent sx={{ p: 4 }}>
        {title && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mb: 3 }}
            justifyContent="space-between"
          >
            <Box>
              {title && (
                <Typography variant="h5" fontWeight={600}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mt: 0.5 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action}
          </Stack>
        )}
        {children}
      </CardContent>
      {middlecontent}
      {footer}
    </StyledCard>
  )
}

export default DashboardCard
