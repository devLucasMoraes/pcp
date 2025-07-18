import { Box, CircularProgress, Grid2 } from '@mui/material'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import PageContainer from '../../components/container/PageContainer'
import { useEquipamentoQueries } from '../../hooks/queries/useEquipamentoQueries'
import { ProducaoPorEquipamento } from './components/ProducaoPorEquipamento'

const Dashboard = () => {
  const { orgSlug } = useParams()

  const { useGetAll: useGetAllEquipamentos } = useEquipamentoQueries()

  const { data: equipamentos, isLoading } = useGetAllEquipamentos(orgSlug || '')

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {orgSlug ? (
        <Box>
          <Grid2 container spacing={3}>
            {isLoading ? (
              <Grid2 size={{ xs: 12 }}>
                <CircularProgress />
              </Grid2>
            ) : equipamentos?.length ? (
              equipamentos.map((equipamento) => (
                <Grid2
                  key={equipamento.id}
                  size={{ xs: 12, sm: 6, md: 4, lg: 4.5 }}
                >
                  <ProducaoPorEquipamento equipamento={equipamento} />
                </Grid2>
              ))
            ) : (
              <Grid2 size={{ xs: 12 }}>
                <CenteredMessageCard message="Nenhum equipamento encontrado" />
              </Grid2>
            )}
          </Grid2>
        </Box>
      ) : (
        <CenteredMessageCard message="Selecione uma organização" />
      )}
    </PageContainer>
  )
}

export default Dashboard
