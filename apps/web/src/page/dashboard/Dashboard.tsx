import { Box, Grid2 } from '@mui/material'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import PageContainer from '../../components/container/PageContainer'

const Dashboard = () => {
  const { orgSlug } = useParams()
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {orgSlug ? (
        <Box>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, lg: 8 }}>
              <p>card</p>
            </Grid2>
            <Grid2 size={{ xs: 12, lg: 4 }}>
              <Grid2 container spacing={3}>
                <Grid2 size={12}>
                  <p>card</p>
                </Grid2>
                <Grid2 size={12}>
                  <p>card</p>
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, lg: 4 }}>
              <p>card</p>
            </Grid2>
            <Grid2 size={{ xs: 12, lg: 8 }}>
              <p>card</p>
            </Grid2>
          </Grid2>
        </Box>
      ) : (
        <CenteredMessageCard message="Selecione uma organização" />
      )}
    </PageContainer>
  )
}

export default Dashboard
