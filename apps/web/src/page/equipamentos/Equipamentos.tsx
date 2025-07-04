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
import { useEquipamentoQueries } from '../../hooks/queries/useEquipamentoQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListEquipamentosResponse } from '../../http/equipamento/list-equipamentos'
import { useAlertStore } from '../../stores/alert-store'
import { EquipamentoModal } from './components/EquipamentoModal'

const Equipamentos = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedEquipamento, setSelectedEquipamento] = useState<{
    data: ListEquipamentosResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetEquipamentosPaginated,
    useDisable: useDisableEquipamento,
  } = useEquipamentoQueries()

  const { data, isLoading } = useGetEquipamentosPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: disableById } = useDisableEquipamento()

  const handleConfirmDisable = (equipamento: ListEquipamentosResponse) => {
    setSelectedEquipamento({ data: equipamento, type: 'DELETE' })
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
          setSelectedEquipamento(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Equipamento desabilitado com sucesso', {
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

  const handleEdit = (equipamento: ListEquipamentosResponse) => {
    setSelectedEquipamento({ data: equipamento, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (equipamento: ListEquipamentosResponse): void => {
    setSelectedEquipamento({ data: equipamento, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListEquipamentosResponse>[] = [
    { field: 'nome', headerName: 'Nome', minWidth: 155, flex: 0.3 },
    {
      field: 'rotinaTarefas',
      headerName: 'Rotina de Tarefas',
      minWidth: 155,
      flex: 0.1,
      valueGetter: (_, row) => {
        if (!row.rotinaTarefas?.descricao) {
          return ''
        }
        return row.rotinaTarefas.descricao
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
      <EquipamentoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedEquipamento(undefined)
        }}
        form={selectedEquipamento}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedEquipamento(undefined)
        }}
        onConfirm={() => {
          if (!selectedEquipamento) return
          handleDisable(selectedEquipamento.data.id)
        }}
        title="Desabilitar equipamento"
      >
        Tem certeza que deseja desabilitar esse equipamento?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Equipamentos" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Equipamentos"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar equipamento
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

export default Equipamentos
