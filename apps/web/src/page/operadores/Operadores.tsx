import { Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconBan, IconCopy, IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useOperadorQueries } from '../../hooks/queries/useOperadorQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListOperadoresResponse } from '../../http/operador/list-operadores'
import { useAlertStore } from '../../stores/alert-store'
import { OperadorModal } from './components/OperadorModal'

const Operadores = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedOperador, setSelectedOperador] = useState<{
    data: ListOperadoresResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetOperadoresPaginated,
    useDisable: useDisableOperador,
  } = useOperadorQueries()

  const { data, isLoading } = useGetOperadoresPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDisableOperador()

  const handleConfirmDisable = (operador: ListOperadoresResponse) => {
    setSelectedOperador({ data: operador, type: 'DELETE' })
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
          setSelectedOperador(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Operador desativado com sucesso', {
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

  const handleEdit = (operador: ListOperadoresResponse) => {
    setSelectedOperador({ data: operador, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (operador: ListOperadoresResponse): void => {
    setSelectedOperador({ data: operador, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListOperadoresResponse>[] = [
    {
      field: 'nome',
      headerName: 'Nome',
      minWidth: 120,
      flex: 1,
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
      <OperadorModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedOperador(undefined)
        }}
        form={selectedOperador}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedOperador(undefined)
        }}
        onConfirm={() => {
          if (!selectedOperador) return
          handleDisable(selectedOperador.data.id)
        }}
        title="Desativar operador"
      >
        Tem certeza que deseja desativar esse operador?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Operadores" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Operadores"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar operador
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

export default Operadores
