import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useApontamentoQueries } from '../../../hooks/queries/useApontamentoQueries'
import { useEquipamentoQueries } from '../../../hooks/queries/useEquipamentoQueries'
import { useOcorrenciaQueries } from '../../../hooks/queries/useOcorrenciaQueries'
import { useOperadorQueries } from '../../../hooks/queries/useOperadorQueries'
import { CsvRow } from '../../../hooks/useCsvImport'
import {
  CreateMultipleApontamentosDTO,
  createMultipleApontamentosSchema,
} from '../../../http/apontamento/create-multiple-apontamentos'
import { useAlertStore } from '../../../stores/alert-store'
import { formatarDateBR } from '../../../util/time-utils'

interface ProcessedCsvRow extends CsvRow {
  ocorrenciaId?: string
  operadorId?: string
  equipamentoId?: string
  errors: string[]
}

export const ImportCsvModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: CsvRow[]
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()
  const { useCreateBulk: useCreateBulkApontamentos } = useApontamentoQueries()

  const [processedData, setProcessedData] = useState<ProcessedCsvRow[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Hooks para buscar os dados necessários
  const { useGetAll: useGetAllOcorrencias } = useOcorrenciaQueries()
  const { useGetAll: useGetAllOperadores } = useOperadorQueries()
  const { useGetAll: useGetAllEquipamentos } = useEquipamentoQueries()

  // Queries para buscar todos os dados
  const { data: ocorrencias } = useGetAllOcorrencias(orgSlug || '')
  const { data: operadores } = useGetAllOperadores(orgSlug || '')
  const { data: equipamentos } = useGetAllEquipamentos(orgSlug || '')

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<CreateMultipleApontamentosDTO>({
    resolver: zodResolver(createMultipleApontamentosSchema),
    defaultValues: {
      apontamentos: [],
    },
  })

  console.log({ errors })

  useEffect(() => {
    if (!form?.data || !ocorrencias || !operadores || !equipamentos) {
      return
    }

    setIsProcessing(true)

    const processedRows: ProcessedCsvRow[] = form.data.map((csvRow) => {
      const errors: string[] = []
      let ocorrenciaId: string | undefined
      let operadorId: string | undefined
      let equipamentoId: string | undefined

      // Buscar ocorrência por descrição
      if (csvRow.ocorrenciaDescricao) {
        const ocorrencia = ocorrencias.find(
          (o) =>
            o.descricao?.toLowerCase() ===
            csvRow.ocorrenciaDescricao?.toLowerCase(),
        )
        if (ocorrencia) {
          ocorrenciaId = ocorrencia.id
        } else {
          errors.push(
            `Ocorrência "${csvRow.ocorrenciaDescricao}" não encontrada`,
          )
        }
      } else {
        errors.push('Descrição da ocorrência não informada')
      }

      // Buscar operador por nome
      if (csvRow.operadorNome) {
        const operador = operadores.find(
          (o) => o.nome?.toLowerCase() === csvRow.operadorNome?.toLowerCase(),
        )
        if (operador) {
          operadorId = operador.id
        } else {
          errors.push(`Operador "${csvRow.operadorNome}" não encontrado`)
        }
      } else {
        errors.push('Nome do operador não informado')
      }

      // Buscar equipamento por nome
      if (csvRow.equipamentoNome) {
        const equipamento = equipamentos.find(
          (e) =>
            e.nome?.toLowerCase() === csvRow.equipamentoNome?.toLowerCase(),
        )
        if (equipamento) {
          equipamentoId = equipamento.id
        } else {
          errors.push(`Equipamento "${csvRow.equipamentoNome}" não encontrado`)
        }
      } else {
        errors.push('Nome do equipamento não informado')
      }

      return {
        ...csvRow,
        ocorrenciaId,
        operadorId,
        equipamentoId,
        errors,
      }
    })

    setProcessedData(processedRows)
    setIsProcessing(false)

    // Preparar dados para o formulário (apenas registros sem erro)
    const validRows = processedRows.filter((row) => row.errors.length === 0)
    const apontamentos = validRows.map((row) => ({
      dataInicio: row.dataInicio || '',
      dataFim: row.dataFim || '',
      qtdeApontada: Number(row.qtdeApontada) || 0,
      ocorrenciaId: row.ocorrenciaId!,
      operadorId: row.operadorId!,
      equipamentoId: row.equipamentoId!,
      ordemProducao: {
        cod: row.codOP,
        descricao: row.descricao,
        tiragem: Number(row.tiragem),
        valorServico: Number(row.valorServico),
        nomeCliente: row.nomeCliente,
      },
    }))

    setValue('apontamentos', apontamentos)
  }, [form, ocorrencias, operadores, equipamentos, setValue])

  const { mutate: createBulkApontamentos } = useCreateBulkApontamentos()

  const onSubmit = (data: CreateMultipleApontamentosDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }

    if (data.apontamentos.length === 0) {
      enqueueSnackbar('Nenhum apontamento válido para importar', {
        variant: 'error',
      })
      return
    }

    createBulkApontamentos(
      { orgSlug, data },
      {
        onSuccess: (response) => {
          handleClose()
          enqueueSnackbar(
            `${response.totalCreated} apontamentos criados com sucesso`,
            {
              variant: 'success',
            },
          )
        },
        onError: (error) => {
          console.error(error)
          enqueueSnackbar(error.response?.data.message || error.message, {
            variant: 'error',
          })
        },
      },
    )
  }

  const handleClose = () => {
    reset()
    setProcessedData([])
    onClose()
  }

  const validRows = processedData.filter((row) => row.errors.length === 0)
  const invalidRows = processedData.filter((row) => row.errors.length > 0)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>Importar Apontamentos via CSV</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Revise os dados importados do CSV. Os registros com erro não serão
          importados.
        </DialogContentText>

        {isProcessing ? (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography>Processando dados do CSV...</Typography>
          </Box>
        ) : processedData.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
              <Grid2 size="auto">
                <Chip
                  label={`${validRows.length} válidos`}
                  color="success"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 size="auto">
                <Chip
                  label={`${invalidRows.length} com erro`}
                  color="error"
                  variant="outlined"
                />
              </Grid2>
            </Grid2>

            {invalidRows.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {invalidRows.length} registro{invalidRows.length > 1 ? 's' : ''}{' '}
                com erro não ser{invalidRows.length > 1 ? 'ão' : 'á'} importado
                {invalidRows.length > 1 ? 's' : ''}.
              </Alert>
            )}

            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Data Início</TableCell>
                    <TableCell>Data Fim</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Ocorrência</TableCell>
                    <TableCell>Operador</TableCell>
                    <TableCell>Equipamento</TableCell>
                    <TableCell>Ordem Produção</TableCell>
                    <TableCell>Erros</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip
                          label={row.errors.length === 0 ? 'OK' : 'Erro'}
                          color={row.errors.length === 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatarDateBR(row.dataInicio)}</TableCell>
                      <TableCell>{formatarDateBR(row.dataFim)}</TableCell>
                      <TableCell>{row.qtdeApontada}</TableCell>
                      <TableCell>{row.ocorrenciaDescricao}</TableCell>
                      <TableCell>{row.operadorNome}</TableCell>
                      <TableCell>{row.equipamentoNome}</TableCell>
                      <TableCell>{row.codOP}</TableCell>
                      <TableCell>
                        {row.errors.length > 0 && (
                          <Box>
                            {row.errors.map((error, errorIndex) => (
                              <Typography
                                key={errorIndex}
                                variant="caption"
                                color="error"
                                display="block"
                              >
                                {error}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Nenhum dado encontrado para importar.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={validRows.length === 0 || isSubmitting || isProcessing}
        >
          {isSubmitting
            ? 'Importando...'
            : `Importar ${validRows.length} Apontamentos`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
