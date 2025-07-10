import { Button, IconButton, Input, Stack } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconBan, IconCopy, IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useApontamentoQueries } from '../../hooks/queries/useApontamentoQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { CsvRow, useCsvImport } from '../../hooks/useCsvImport'
import { ListApontamentosResponse } from '../../http/apontamento/list-apontamentos'
import { useAlertStore } from '../../stores/alert-store'
import { formatarMinutosParaHHMM } from '../../util/time-utils'
import { ApontamentoModal } from './components/ApontamentoModal'
import { ImportCsvModal } from './components/ImportCsvModal'

const Apontamentos = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [importCsvModalOpen, setImportCsvModalFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedApontamento, setSelectedApontamento] = useState<{
    data: ListApontamentosResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()

  const [selectedApontamentos, setSelectedApontamentos] = useState<{
    data: CsvRow[]
  }>()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const { parseCsvFile } = useCsvImport({
    onSuccess: (csvData) => {
      console.log({ csvData })

      setSelectedApontamentos({ data: csvData })

      setImportCsvModalFormOpen(true)
      enqueueSnackbar('XML importado com sucesso!', { variant: 'success' })
    },
    onError: (error) => {
      enqueueSnackbar(error, { variant: 'error' })
    },
    onValidationError: (error) => {
      enqueueSnackbar(error, { variant: 'error' })
    },
  })

  const {
    useListPaginated: useGetApontamentosPaginated,
    useDisable: useDisableApontamento,
  } = useApontamentoQueries()

  const { data, isLoading } = useGetApontamentosPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: disableById } = useDisableApontamento()

  const handleConfirmDisable = (apontamento: ListApontamentosResponse) => {
    setSelectedApontamento({ data: apontamento, type: 'DELETE' })
    setConfirmModalOpen(true)
  }

  const handleDisable = (id: string) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    disableById(
      { id, orgSlug },
      {
        onSuccess: () => {
          setSelectedApontamento(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Apontamento desabilitado com sucesso', {
            variant: 'success',
          })
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

  const handleEdit = (apontamento: ListApontamentosResponse) => {
    setSelectedApontamento({ data: apontamento, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (apontamento: ListApontamentosResponse): void => {
    setSelectedApontamento({ data: apontamento, type: 'COPY' })
    setFormOpen(true)
  }

  const handleImportCsv = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    await parseCsvFile(file)

    event.target.value = ''
  }

  const columns: GridColDef<ListApontamentosResponse>[] = [
    {
      field: 'dataInicio',
      headerName: 'Data de Início',
      minWidth: 180,
      flex: 0.3,
      type: 'dateTime',
      valueGetter: (value) => (value ? new Date(value) : ''),
      valueFormatter: (params) => {
        if (!params) return ''

        const date = new Date(params)
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
    },
    {
      field: 'dataFim',
      headerName: 'Data de Fim',
      minWidth: 180,
      flex: 0.3,
      type: 'dateTime',
      valueGetter: (value) => (value ? new Date(value) : ''),
      valueFormatter: (params) => {
        if (!params) return ''

        const date = new Date(params)
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
    },
    {
      field: 'duracao',
      headerName: 'Duração',
      minWidth: 155,
      flex: 0.3,
      valueGetter: (_, row) => {
        if (!row.duracao) {
          return '00:00'
        }
        return formatarMinutosParaHHMM(row.duracao)
      },
    },
    {
      field: 'qtdeApontada',
      headerName: 'Quantidade apontada',
      minWidth: 155,
      flex: 0.3,
      type: 'number',
    },
    {
      field: 'ocorrencia',
      headerName: 'Ocorrência',
      minWidth: 155,
      flex: 0.1,
      valueGetter: (_, row) => {
        if (!row.ocorrencia?.descricao) {
          return ''
        }
        return row.ocorrencia.descricao
      },
    },
    {
      field: 'operador',
      headerName: 'Operador',
      minWidth: 155,
      flex: 0.1,
      valueGetter: (_, row) => {
        if (!row.operador?.nome) {
          return ''
        }
        return row.operador.nome
      },
    },
    {
      field: 'equipamento',
      headerName: 'Equipamento',
      minWidth: 155,
      flex: 0.1,
      valueGetter: (_, row) => {
        if (!row.equipamento?.nome) {
          return ''
        }
        return row.equipamento.nome
      },
    },
    {
      field: 'ordemProducao',
      headerName: 'Ordem de Produção',
      minWidth: 155,
      flex: 0.1,
      valueGetter: (_, row) => {
        if (!row.ordemProducao?.descricao) {
          return ''
        }
        return row.ordemProducao.descricao
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      minWidth: 130,
      flex: 0.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleCopy(params.row)}
          >
            <IconCopy />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleEdit(params.row)}
          >
            <IconEdit />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleConfirmDisable(params.row)}
          >
            <IconBan />
          </IconButton>
        </>
      ),
    },
  ]

  const renderModals = () => (
    <>
      <ApontamentoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedApontamento(undefined)
        }}
        form={selectedApontamento}
      />
      <ImportCsvModal
        open={importCsvModalOpen}
        onClose={() => {
          setImportCsvModalFormOpen(false)
          setSelectedApontamentos(undefined)
        }}
        form={selectedApontamentos}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedApontamento(undefined)
        }}
        onConfirm={() => {
          if (!selectedApontamento) return
          handleDisable(selectedApontamento.data.id)
        }}
        title="Desabilitar apontamento"
      >
        Tem certeza que deseja desabilitar esse apontamento?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Apontamentos" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Apontamentos"
          action={
            <Stack spacing={2} direction="row">
              <Button variant="outlined" component="label">
                importar csv
                <Input
                  inputProps={{ accept: '.csv' }}
                  type="file"
                  sx={{ display: 'none' }}
                  onChange={handleImportCsv}
                />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setFormOpen(true)}
              >
                adicionar apontamento
              </Button>
            </Stack>
          }
        >
          <ServerDataTable
            rows={data?.content || []}
            columns={columns}
            isLoading={isLoading}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            totalRowCount={data?.totalElements || 0}
          />
        </DashboardCard>
      ) : (
        <CenteredMessageCard message="Selecione uma organização" />
      )}
    </PageContainer>
  )
}

export default Apontamentos
