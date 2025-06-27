import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import { useOrgQueries } from '../../../hooks/queries/useOrgQueries'
import {
  CreateOrganizationDto,
  createOrganizationSchema,
} from '../../../http/orgs/create-organization'
import { useAlertStore } from '../../../stores/alert-store'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (orgSlug: string) => void
}

const CreateOrganizationDialog = ({ open, onClose, onSuccess }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrganizationDto>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
    },
  })

  const { enqueueSnackbar } = useAlertStore()

  const { useCreate } = useOrgQueries()
  const { mutate: createOrg, isPending } = useCreate()

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: CreateOrganizationDto) => {
    createOrg(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData.slug)
        handleClose()
      },
      onError: (error) => {
        console.error(error)
        enqueueSnackbar(error.response?.data.message || error.message, {
          variant: 'error',
        })
      },
    })
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>
        <Typography>Criar nova organização</Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome da organização"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                autoFocus
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancelar
        </Button>

        <Button type="submit" variant="contained" loading={isPending}>
          Criar organização
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOrganizationDialog
