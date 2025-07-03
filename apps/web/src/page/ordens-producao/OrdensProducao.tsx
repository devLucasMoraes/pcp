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
import { useOrdemProducaoQueries } from '../../hooks/queries/useOrdemProducaoQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListOrdensProducaoResponse } from '../../http/ordem-producao/list-ordens-producao'
import { useAlertStore } from '../../stores/alert-store'
import { OrdemProducaoModal } from './components/OrdemProducaoModal'

const OrdensProducao = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedOrdemProducao, setSelectedOrdemProducao] = useState<{
    data: ListOrdensProducaoResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetOrdensProducaoPaginated,
    useDisable: useDisableOrdemProducao,
  } = useOrdemProducaoQueries()

  const { data, isLoading } = useGetOrdensProducaoPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDisableOrdemProducao()

  const handleConfirmDisable = (ordemProducao: ListOrdensProducaoResponse) => {
    setSelectedOrdemProducao({ data: ordemProducao, type: 'DELETE' })
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
          setSelectedOrdemProducao(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Ordem de Produção desativada com sucesso', {
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

  const handleEdit = (ordemProducao: ListOrdensProducaoResponse) => {
    setSelectedOrdemProducao({ data: ordemProducao, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (ordemProducao: ListOrdensProducaoResponse): void => {
    setSelectedOrdemProducao({ data: ordemProducao, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListOrdensProducaoResponse>[] = [
    {
      field: 'cod',
      headerName: 'OP',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'tiragem',
      headerName: 'Tiragem',
      minWidth: 120,
      flex: 1,
      type: 'number',
    },
    {
      field: 'valorServico',
      headerName: 'Valor Serviço',
      minWidth: 120,
      flex: 1,
      type: 'number',
      valueFormatter: (value: number) =>
        value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      field: 'nomeCliente',
      headerName: 'Cliente',
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
      <OrdemProducaoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedOrdemProducao(undefined)
        }}
        form={selectedOrdemProducao}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedOrdemProducao(undefined)
        }}
        onConfirm={() => {
          if (!selectedOrdemProducao) return
          handleDisable(selectedOrdemProducao.data.id)
        }}
        title="Desativar ordem de produção"
      >
        Tem certeza que deseja desativar esse ordem de produção?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Ordens de Produção" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Ordens de Produção"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar ordem de produção
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

export default OrdensProducao
