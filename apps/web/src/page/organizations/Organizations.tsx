import { Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconEdit, IconEraser } from '@tabler/icons-react'
import { useState } from 'react'

import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { role } from '../../constants'
import { useOrgQueries } from '../../hooks/queries/useOrgQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListOrganizationsResponse } from '../../http/orgs/list-organizations'
import { useAlertStore } from '../../stores/alert-store'
import { OrganizationModal } from './components/OrganizationModal'

const Organizations = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const [selectedOrganization, setSelectedOrganization] = useState<{
    data: ListOrganizationsResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetOrganizationsPaginated,
    useShtutdown: useDeleteOrganization,
  } = useOrgQueries()

  const { data, isLoading } = useGetOrganizationsPaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: deleteBySlug } = useDeleteOrganization()

  const handleConfirmDelete = (organization: ListOrganizationsResponse) => {
    setSelectedOrganization({ data: organization, type: 'DELETE' })
    setConfirmModalOpen(true)
  }

  const handleDelete = (slug: string) => {
    deleteBySlug(slug, {
      onSuccess: () => {
        setSelectedOrganization(undefined)
        setConfirmModalOpen(false)
        enqueueSnackbar('Organização deletada com sucesso', {
          variant: 'success',
        })
      },
      onError: (error) => {
        console.error(error)
        enqueueSnackbar(error.response?.data.message || error.message, {
          variant: 'error',
        })
      },
    })
  }

  const handleEdit = (organization: ListOrganizationsResponse) => {
    setSelectedOrganization({ data: organization, type: 'UPDATE' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListOrganizationsResponse>[] = [
    { field: 'name', headerName: 'Nome', minWidth: 120, flex: 1 },
    { field: 'slug', headerName: 'Slug', minWidth: 120, flex: 1 },
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
      <OrganizationModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedOrganization(undefined)
        }}
        form={selectedOrganization}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedOrganization(undefined)
        }}
        onConfirm={() => {
          if (!selectedOrganization) return
          handleDelete(selectedOrganization.data.slug)
        }}
        title="Deletar organização"
      >
        Tem certeza que deseja deletar essa organização?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Organizações" description="">
      {renderModals()}

      <DashboardCard
        title="Organizações"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar organização
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
    </PageContainer>
  )
}

export default Organizations
