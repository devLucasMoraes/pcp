import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useOrgQueries } from '../../../hooks/queries/useOrgQueries'
import {
  CreateOrganizationDto,
  createOrganizationSchema,
} from '../../../http/orgs/create-organization'
import { ListOrganizationsResponse } from '../../../http/orgs/list-organizations'
import {
  UpdateOrganizationDto,
  updateOrganizationSchema,
} from '../../../http/orgs/update-organization'
import { useAlertStore } from '../../../stores/alert-store'

export const OrganizationModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListOrganizationsResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const isUpdate = form?.type === 'UPDATE'

  const schema =
    form?.data || isUpdate ? updateOrganizationSchema : createOrganizationSchema

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrganizationDto | UpdateOrganizationDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  })

  const { useCreate: useCreateOrg, useUpdate: useUpdateOrg } = useOrgQueries()

  useEffect(() => {
    if (!form?.data) {
      reset({
        name: '',
      })
      return
    }

    const { data } = form

    reset({
      name: data.name,
    })
  }, [form, reset])

  const { mutate: createOrg } = useCreateOrg()

  const { mutate: updateOrg } = useUpdateOrg()

  const onSubmit = (data: CreateOrganizationDto | UpdateOrganizationDto) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (isUpdate && form.data) {
      updateOrg(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Organização atualizada com sucesso', {
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
    } else {
      createOrg(data, {
        onSuccess: () => {
          onClose()
          reset()
          enqueueSnackbar('Organização criada com sucesso', {
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
  }
  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{form ? 'Editar' : 'Nova'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form
            ? 'Preencha os campos abaixo para editar a organização'
            : 'Preencha os campos abaixo para criar uma nova organização'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
