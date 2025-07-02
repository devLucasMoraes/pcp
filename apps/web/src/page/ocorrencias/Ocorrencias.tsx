import { Button, Chip, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconBan, IconCopy, IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useOcorrenciaQueries } from '../../hooks/queries/useOcorrenciaQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListOcorrenciasResponse } from '../../http/ocorrencia/list-ocorrencias'
import { useAlertStore } from '../../stores/alert-store'
import { OcorrenciaModal } from './components/OcorrenciaModal'

const Ocorrencias = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedOcorrencia, setSelectedOcorrencia] = useState<{
    data: ListOcorrenciasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetOcorrenciasPaginated,
    useDisable: useDisableOcorrencia,
  } = useOcorrenciaQueries()

  const { data, isLoading } = useGetOcorrenciasPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDisableOcorrencia()

  const handleConfirmDisable = (ocorrencia: ListOcorrenciasResponse) => {
    setSelectedOcorrencia({ data: ocorrencia, type: 'DELETE' })
    setConfirmModalOpen(true)
  }

  const handleDisable = (id: string) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    deleteById(
      { id, orgSlug },
      {
        onSuccess: () => {
          setSelectedOcorrencia(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Ocorrencia desativada com sucesso', {
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

  const handleEdit = (ocorrencia: ListOcorrenciasResponse) => {
    setSelectedOcorrencia({ data: ocorrencia, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (ocorrencia: ListOcorrenciasResponse): void => {
    setSelectedOcorrencia({ data: ocorrencia, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListOcorrenciasResponse>[] = [
    {
      field: 'descricao',
      headerName: 'Descricao',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'cor',
      headerName: 'Cor',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Chip
          sx={{
            backgroundColor: params.value,
            color: params.value,
            width: 100,
          }}
          label={params.value}
        />
      ),
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
      <OcorrenciaModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedOcorrencia(undefined)
        }}
        form={selectedOcorrencia}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedOcorrencia(undefined)
        }}
        onConfirm={() => {
          if (!selectedOcorrencia) return
          handleDisable(selectedOcorrencia.data.id)
        }}
        title="Desativar ocorrencia"
      >
        Tem certeza que deseja desativar essa ocorrência?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Ocorrencias" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Ocorrencias"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar ocorrencia
            </Button>
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

export default Ocorrencias
