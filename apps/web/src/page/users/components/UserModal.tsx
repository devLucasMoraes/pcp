import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  MenuItem,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { role } from '../../../constants'
import { Role } from '../../../constants/Role'
import { useUserQueries } from '../../../hooks/queries/useUserQueries'
import {
  CreateOrganizationalUserDTO,
  createOrganizationalUserSchema,
} from '../../../http/user/create-organizational-user'
import { ListUsersResponse } from '../../../http/user/list-users'
import { UpdateUserDTO, updateUserSchema } from '../../../http/user/update-user'
import { useAlertStore } from '../../../stores/alert-store'

export const UserModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListUsersResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const isUpdate = form?.type === 'UPDATE'

  const schema =
    form?.data || isUpdate ? updateUserSchema : createOrganizationalUserSchema

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrganizationalUserDTO | UpdateUserDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: Role.MEMBER,
      avatarUrl: null,
    },
  })

  const { useCreate: useCreateUser, useUpdate: useUpdateUser } =
    useUserQueries()

  useEffect(() => {
    if (!form?.data) {
      reset({
        name: '',
        email: '',
        password: '',
        role: Role.MEMBER,
        avatarUrl: null,
      })
      return
    }

    const { data } = form

    reset({
      name: data.name,
      email: data.email,
      password: '',
      avatarUrl: data.avatarUrl,
      role: data.role as Role,
    })
  }, [form, reset])

  const { mutate: createUser } = useCreateUser()

  const { mutate: updateUser } = useUpdateUser()

  const onSubmit = (data: UpdateUserDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (isUpdate && form.data) {
      updateUser(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Usuário atualizado com sucesso', {
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
      createUser(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Usuário criado com sucesso', {
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
      <DialogTitle>{form ? 'Editar' : 'Novo'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form
            ? 'Preencha os campos abaixo para editar o usuário'
            : 'Preencha os campos abaixo para criar um novo usuário'}
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
          <Grid2 size={6}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Senha"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size="grow">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size="auto">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Perfil"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  fullWidth
                  select
                >
                  {role.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
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
