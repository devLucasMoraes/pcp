import { Typography } from '@mui/material'

import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'

const Settings = () => {
  return (
    <PageContainer title="Configurações" description="">
      <DashboardCard title="Configurações">
        <Typography>configurações page</Typography>
      </DashboardCard>
    </PageContainer>
  )
}

export default Settings
