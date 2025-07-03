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
import { useRotinaQueries } from '../../hooks/queries/useRotinaQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListRotinasResponse } from '../../http/rotina-tarefas/list-rotinas'
import { useAlertStore } from '../../stores/alert-store'
import { RotinaModal } from './components/RotinaModal'

const Rotinas = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedRotina, setSelectedRotina] = useState<{
    data: ListRotinasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetRotinasPaginated,
    useDisable: useDisableRotina,
  } = useRotinaQueries()

  const { data, isLoading } = useGetRotinasPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDisableRotina()

  const handleConfirmDisable = (rotina: ListRotinasResponse) => {
    setSelectedRotina({ data: rotina, type: 'DELETE' })
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
          setSelectedRotina(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Rotina desativada com sucesso', {
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

  const handleEdit = (rotina: ListRotinasResponse) => {
    setSelectedRotina({ data: rotina, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (rotina: ListRotinasResponse): void => {
    setSelectedRotina({ data: rotina, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListRotinasResponse>[] = [
    {
      field: 'descricao',
      headerName: 'Descricao',
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
      <RotinaModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedRotina(undefined)
        }}
        form={selectedRotina}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedRotina(undefined)
        }}
        onConfirm={() => {
          if (!selectedRotina) return
          handleDisable(selectedRotina.data.id)
        }}
        title="Desativar rotina"
      >
        Tem certeza que deseja desativar essa rotina?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Rotinas" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Rotinas"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar rotina
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

export default Rotinas
