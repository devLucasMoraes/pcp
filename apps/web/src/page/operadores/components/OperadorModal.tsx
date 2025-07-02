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

import { useOperadorQueries } from '../../../hooks/queries/useOperadorQueries'
import {
  CreateOperadorDTO,
  createOperadorSchema,
} from '../../../http/operador/create-operador'
import { ListOperadoresResponse } from '../../../http/operador/list-operadores'
import {
  UpdateOperadorDTO,
  updateOperadorSchema,
} from '../../../http/operador/update-operador'
import { useAlertStore } from '../../../stores/alert-store'

interface OperadorModalProps {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListOperadoresResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}

export const OperadorModal = ({ open, onClose, form }: OperadorModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateOperadorSchema
      : createOperadorSchema

  const { useCreate: useCreateOperador, useUpdate: useUpdateOperador } =
    useOperadorQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOperadorDTO | UpdateOperadorDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
    },
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        nome: '',
      })
      return
    }
    const { data } = form

    reset({
      nome: data.nome,
    })
  }, [form, reset])

  const { mutate: createOperador } = useCreateOperador()

  const { mutate: updateOperador } = useUpdateOperador()

  const onSubmit = (data: CreateOperadorDTO | UpdateOperadorDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateOperador(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Operador atualizado com sucesso', {
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
      createOperador(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Operador criado com sucesso', {
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
      <DialogTitle>{form?.type === 'UPDATE' ? 'Editar' : 'Novo'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar o operador'
            : 'Preencha os campos abaixo para criar um operador'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
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
