import { Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconEdit, IconEraser } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { role } from '../../constants'
import { useUserQueries } from '../../hooks/queries/useUserQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListUsersResponse } from '../../http/user/list-users'
import { useAlertStore } from '../../stores/alert-store'
import { UserModal } from './components/UserModal'

const Users = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedUser, setSelectedUser] = useState<{
    data: ListUsersResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const { useListPaginated: useGetUsersPaginated, useDelete: useDeleteUser } =
    useUserQueries()

  const { data, isLoading } = useGetUsersPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: deleteById } = useDeleteUser()

  const handleConfirmDelete = (user: ListUsersResponse) => {
    setSelectedUser({ data: user, type: 'DELETE' })
    setConfirmModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    deleteById(
      { id, orgSlug },
      {
        onSuccess: () => {
          setSelectedUser(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Usuário deletado com sucesso', {
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

  const handleEdit = (user: ListUsersResponse) => {
    setSelectedUser({ data: user, type: 'UPDATE' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListUsersResponse>[] = [
    { field: 'name', headerName: 'Nome', minWidth: 120, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 120, flex: 1 },
    {
      field: 'role',
      headerName: 'Cargo',
      minWidth: 120,
      flex: 1,
      valueFormatter: (_, row) => {
        return role.find((profile) => profile.value === row.role)?.label
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      minWidth: 120,
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
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
            onClick={() => handleConfirmDelete(params.row)}
          >
            <IconEraser />
          </IconButton>
        </>
      ),
    },
  ]

  const renderModals = () => (
    <>
      <UserModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedUser(undefined)
        }}
        form={selectedUser}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedUser(undefined)
        }}
        onConfirm={() => {
          if (!selectedUser) return
          handleDelete(selectedUser.data.id)
        }}
        title="Deletar usuário"
      >
        Tem certeza que deseja deletar esse usuário?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Usuários" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Usuários"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar usuário
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

export default Users
