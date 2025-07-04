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

import { RotinaAutoComplete } from '../../../components/shared/autocompletes/RotinaAutoComplete'
import { useEquipamentoQueries } from '../../../hooks/queries/useEquipamentoQueries'
import {
  CreateEquipamentoDTO,
  createEquipamentoSchema,
} from '../../../http/equipamento/create-equipamento'
import { ListEquipamentosResponse } from '../../../http/equipamento/list-equipamentos'
import {
  UpdateEquipamentoDTO,
  updateEquipamentoSchema,
} from '../../../http/equipamento/update-equipamento'
import { useAlertStore } from '../../../stores/alert-store'

export const EquipamentoModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListEquipamentosResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateEquipamentoSchema
      : createEquipamentoSchema

  const { useCreate: useCreateEquipamento, useUpdate: useUpdateEquipamento } =
    useEquipamentoQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateEquipamentoDTO | UpdateEquipamentoDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      rotinaTarefasId: '',
    },
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        nome: '',
        rotinaTarefasId: '',
      })
      return
    }

    const { data } = form

    reset({
      nome: data.nome,
      rotinaTarefasId: data.rotinaTarefas.id,
    })
  }, [form, reset])

  const { mutate: createEquipamento } = useCreateEquipamento()

  const { mutate: updateEquipamento } = useUpdateEquipamento()

  const onSubmit = (data: CreateEquipamentoDTO | UpdateEquipamentoDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateEquipamento(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            handleClose()
            enqueueSnackbar('Equipamento atualizado com sucesso', {
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
      createEquipamento(
        { orgSlug, data },
        {
          onSuccess: () => {
            handleClose()
            enqueueSnackbar('Equipamento criado com sucesso', {
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
            ? 'Preencha os campos abaixo para editar o equipamento'
            : 'Preencha os campos abaixo para criar um novo equipamento'}
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

          <Grid2 size={12}>
            <Controller
              name="rotinaTarefasId"
              control={control}
              render={({ field }) => (
                <RotinaAutoComplete
                  field={field}
                  error={errors.rotinaTarefasId}
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
