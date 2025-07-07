import {
  alpha,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid2,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react'
import { addDays, subDays } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router'

import DashboardCard from '../../../components/cards/DashboardCard'
import { useApontamentoQueries } from '../../../hooks/queries/useApontamentoQueries'

type ProducaoPorEquipamentoCardProps = {
  equipamento: {
    id: string
    nome: string
  }
}

export const ProducaoPorEquipamento = ({
  equipamento,
}: ProducaoPorEquipamentoCardProps) => {
  const theme = useTheme()
  const { orgSlug } = useParams()
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())

  const { useTotaisProducao } = useApontamentoQueries()

  const {
    data: totais,
    isLoading,
    isError,
    refetch,
  } = useTotaisProducao(orgSlug, equipamento.id, startDate, endDate)

  const handlePrevDay = () => {
    const newStart = subDays(startDate, 1)
    setStartDate(newStart)
    setEndDate(newStart)
  }

  const handleNextDay = () => {
    const newStart = addDays(startDate, 1)
    setStartDate(newStart)
    setEndDate(newStart)
  }

  const getEfficiency = () => {
    if (!totais || totais.tempoTotal === 0) return 0
    return (totais.tempoProdutivo / totais.tempoTotal) * 100
  }

  const getEfficiencyColor = () => {
    const efficiency = getEfficiency()
    if (efficiency >= 80) return theme.palette.success.main
    if (efficiency >= 60) return theme.palette.warning.main
    return theme.palette.error.main
  }

  return (
    <DashboardCard
      title={equipamento.nome}
      subtitle="Produção em Tempo Real"
      action={
        totais && (
          <Chip
            icon={
              getEfficiency() >= 80 ? (
                <IconTrendingUp size={16} />
              ) : (
                <IconTrendingDown size={16} />
              )
            }
            label={`${getEfficiency().toFixed(0)}%`}
            size="small"
            sx={{
              backgroundColor: alpha(getEfficiencyColor(), 0.2),
              color: getEfficiencyColor(),
              fontWeight: 600,
            }}
          />
        )
      }
    >
      <Box>
        {/* Controles de Data */}
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
            p: 2,
            mb: 3,
          }}
        >
          <Grid2 container alignItems="center" spacing={2}>
            <Grid2 size="auto">
              <IconButton
                onClick={handlePrevDay}
                color="primary"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <IconChevronLeft size={20} />
              </IconButton>
            </Grid2>

            <Grid2 size="grow">
              <Stack direction="row" spacing={1} justifyContent="center">
                <DatePicker
                  label="Data Início"
                  value={startDate}
                  onChange={(newValue) => newValue && setStartDate(newValue)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="Data Fim"
                  value={endDate}
                  onChange={(newValue) => newValue && setEndDate(newValue)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Stack>
            </Grid2>

            <Grid2 size="auto">
              <IconButton
                onClick={handleNextDay}
                color="primary"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <IconChevronRight size={20} />
              </IconButton>
            </Grid2>
          </Grid2>
        </Box>

        {/* Indicador Principal de Produção */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          {isLoading ? (
            <Box textAlign="center">
              <CircularProgress size={80} thickness={4} />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Carregando dados...
              </Typography>
            </Box>
          ) : isError ? (
            <Box textAlign="center">
              <Typography color="error" variant="h6" mb={1}>
                Erro ao carregar dados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verifique sua conexão e tente novamente
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `3px solid ${theme.palette.primary.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" fontWeight={700} color="primary">
                {totais?.qtdeTotal.toFixed(2) || '0.00'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                unidades
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Estatísticas de Tempo */}
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                mb={1}
              >
                <IconTrendingUp size={16} color={theme.palette.success.main} />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.success.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Produtivo
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: theme.palette.success.main }}
              >
                {totais?.tempoProdutivo.toFixed(2) || '0.00'}h
              </Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                mb={1}
              >
                <IconTrendingDown size={16} color={theme.palette.error.main} />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.error.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Improdutivo
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: theme.palette.error.main }}
              >
                {totais?.tempoImprodutivo.toFixed(2) || '0.00'}h
              </Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                mb={1}
              >
                <IconClock size={16} color={theme.palette.primary.main} />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Total
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: theme.palette.primary.main }}
              >
                {totais?.tempoTotal.toFixed(2) || '0.00'}h
              </Typography>
            </Box>
          </Grid2>
        </Grid2>

        {/* Resumo de Eficiência */}
        {totais && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: alpha(getEfficiencyColor(), 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(getEfficiencyColor(), 0.2)}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Eficiência Operacional:{' '}
              <Typography
                component="span"
                variant="body2"
                fontWeight={600}
                sx={{ color: getEfficiencyColor() }}
              >
                {getEfficiency().toFixed(1)}%
              </Typography>
            </Typography>
          </Box>
        )}
      </Box>
    </DashboardCard>
  )
}
