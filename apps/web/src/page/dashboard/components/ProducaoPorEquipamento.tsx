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
  IconCalendarPause,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react'
import { addDays, subDays } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router'

import DashboardCard from '../../../components/cards/DashboardCard'
import { useApontamentoQueries } from '../../../hooks/queries/useApontamentoQueries'
import { GetAllEquipamentosResponse } from '../../../http/equipamento/get-all-equipamentos'
import { formatarMinutosParaHHMM } from '../../../util/time-utils'

export const ProducaoPorEquipamento = ({
  equipamento,
}: {
  equipamento: GetAllEquipamentosResponse
}) => {
  const theme = useTheme()
  const { orgSlug } = useParams()
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())

  const { useTotaisProducao } = useApontamentoQueries()

  const {
    data: totais,
    isLoading,
    isError,
  } = useTotaisProducao(orgSlug!, equipamento.id, startDate, endDate)

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
    if (efficiency >= 90) return theme.palette.success.main
    if (efficiency >= 80) return theme.palette.warning.main
    return theme.palette.error.main
  }

  return (
    <DashboardCard
      title={equipamento.nome}
      subtitle="Eficiência de Produção"
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
            p: 1,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={1}>
            <DatePicker
              label="Data Início"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="Data Fim"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </Stack>
        </Box>

        {/* Indicador Principal de Produção */}
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={3}
            >
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
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    border: `3px solid ${theme.palette.primary.main}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h2" fontWeight={800} color="primary">
                    {totais?.qtdeTotal || '0'}
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

        <Divider sx={{ mb: 3 }} />

        {/* Estatísticas de Tempo */}
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <IconMinus size={16} color={theme.palette.warning.main} />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.warning.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Preparação
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: theme.palette.warning.main }}
                >
                  {formatarMinutosParaHHMM(totais?.tempoPreparacao || 0)}h
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
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
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: theme.palette.success.main }}
                >
                  {formatarMinutosParaHHMM(totais?.tempoProdutivo || 0)}h
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
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
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: theme.palette.error.main }}
                >
                  {formatarMinutosParaHHMM(totais?.tempoImprodutivo || 0)}h
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <IconCalendarPause
                  size={16}
                  color={theme.palette.secondary.main}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.secondary.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Intervalos
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  {formatarMinutosParaHHMM(totais?.tempoIntervalo || 0)}h
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
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
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: theme.palette.primary.main }}
                >
                  {formatarMinutosParaHHMM(totais?.tempoTotal || 0)}h
                </Typography>
              </Stack>
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
