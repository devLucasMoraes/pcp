import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import {
  IconBuildings,
  IconChevronCompactDown,
  IconPlus,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'

import { useOrgQueries } from '../../../hooks/queries/useOrgQueries'
import { useCurrentOrg } from '../../../hooks/useCurrentOrg'
import { GetOrganizationsResponse } from '../../../http/orgs/get-organizations'
import { useAlertStore } from '../../../stores/alert-store'
import CreateOrganizationDialog from './OrganizationDialogForm'

const OrganizationBreadcrumbs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { orgSlug } = useParams()

  const { enqueueSnackbar } = useAlertStore()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Custom hook para gerenciar organização selecionada
  const { currentOrg, updateCurrentOrg } = useCurrentOrg()
  const { useGetAll } = useOrgQueries()

  // Busca organizações do usuário
  const {
    data: organizations = [],
    isLoading: isLoadingOrgs,
    error: orgsError,
  } = useGetAll()

  // Gera breadcrumbs dinâmicos baseado na rota
  const getBreadcrumbs = () => {
    const path = location.pathname
    const segments = path.split('/').filter(Boolean)

    if (segments[0] === 'organizations' && segments[1]) {
      // Remove 'organizations' e slug, pega o resto
      return segments
        .slice(2)
        .map(
          (segment) =>
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, ' '),
        )
    }

    return segments.map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    )
  }

  const breadcrumbs = getBreadcrumbs()

  // Efeito para sincronizar organização selecionada com a URL
  useEffect(() => {
    if (orgSlug && orgSlug !== currentOrg?.slug) {
      const org = organizations.find((o) => o.slug === orgSlug)
      if (org) {
        updateCurrentOrg(org)
      }
    } else {
      if (currentOrg?.slug && !location.pathname.includes('/organizations/')) {
        const org = organizations.find((o) => o.slug === currentOrg.slug)
        if (org) {
          updateCurrentOrg(org)
          // Redirecionar apenas se não estamos já numa rota de organização
          const currentPath =
            location.pathname === '/'
              ? 'dashboard'
              : location.pathname.replace('/', '')
          navigate(`/organizations/${org.slug}/${currentPath}`, {
            replace: true,
          })
        }
      }
    }
  }, [
    orgSlug,
    organizations,
    currentOrg,
    updateCurrentOrg,
    location.pathname,
    navigate,
  ])

  const handleSelectOrg = (org: GetOrganizationsResponse) => {
    updateCurrentOrg(org)
    const currentPath = location.pathname.split('/').pop() || 'dashboard'
    navigate(`/organizations/${org.slug}/${currentPath}`, { replace: true })
    setAnchorEl(null)
  }

  const handleCreateSuccess = (orgSlug: string) => {
    navigate(`/organizations/${orgSlug}/dashboard`, { replace: true })
    enqueueSnackbar('Organização criada com sucesso!', { variant: 'success' })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      {/* Seletor de Organização */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconBuildings color="primary" />
        <Button
          variant="outlined"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={<IconChevronCompactDown />}
          sx={{ minWidth: 200 }}
          disabled={isLoadingOrgs}
        >
          {currentOrg
            ? currentOrg.name
            : isLoadingOrgs
              ? 'Carregando...'
              : 'Selecionar Organização'}
        </Button>
      </Box>

      {/* Breadcrumbs Dinâmicos */}
      {currentOrg && breadcrumbs.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              <Typography
                key={index}
                color={
                  index === breadcrumbs.length - 1
                    ? 'text.primary'
                    : 'text.secondary'
                }
                sx={{ textTransform: 'capitalize' }}
              >
                {crumb}
              </Typography>
            ))}
          </Breadcrumbs>
        </>
      )}

      {/* Menu de Organizações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {isLoadingOrgs && (
          <MenuItem disabled>Carregando organizações...</MenuItem>
        )}

        {orgsError && (
          <MenuItem disabled>Erro ao carregar organizações</MenuItem>
        )}

        {organizations.map((org) => (
          <MenuItem
            key={org.id}
            onClick={() => handleSelectOrg(org)}
            selected={org.slug === currentOrg?.slug}
          >
            <Box>
              <Typography variant="body2">{org.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                /{org.slug}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          onClick={() => {
            setCreateDialogOpen(true)
            setAnchorEl(null)
          }}
        >
          <IconPlus />
          Criar Nova Organização
        </MenuItem>
      </Menu>

      {/* Diálogo de Criação */}
      <CreateOrganizationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  )
}

export default OrganizationBreadcrumbs
