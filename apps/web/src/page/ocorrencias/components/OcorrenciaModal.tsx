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

import { useOcorrenciaQueries } from '../../../hooks/queries/useOcorrenciaQueries'
import {
  CreateOcorrenciaDTO,
  createOcorrenciaSchema,
} from '../../../http/ocorrencia/create-ocorrencia'
import { ListOcorrenciasResponse } from '../../../http/ocorrencia/list-ocorrencias'
import {
  UpdateOcorrenciaDTO,
  updateOcorrenciaSchema,
} from '../../../http/ocorrencia/update-ocorrencia'
import { useAlertStore } from '../../../stores/alert-store'

interface OcorrenciaModalProps {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListOcorrenciasResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}

export const OcorrenciaModal = ({
  open,
  onClose,
  form,
}: OcorrenciaModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateOcorrenciaSchema
      : createOcorrenciaSchema

  const { useCreate: useCreateOcorrencia, useUpdate: useUpdateOcorrencia } =
    useOcorrenciaQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOcorrenciaDTO | UpdateOcorrenciaDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      descricao: '',
      cor: '',
    },
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        descricao: '',
        cor: '',
      })
      return
    }
    const { data } = form

    reset({
      descricao: data.descricao,
      cor: data.cor,
    })
  }, [form, reset])

  const { mutate: createOcorrencia } = useCreateOcorrencia()

  const { mutate: updateOcorrencia } = useUpdateOcorrencia()

  const onSubmit = (data: CreateOcorrenciaDTO | UpdateOcorrenciaDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateOcorrencia(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Ocorrencia atualizada com sucesso', {
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
      createOcorrencia(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Ocorrencia criada com sucesso', {
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
      <DialogTitle>{form?.type === 'UPDATE' ? 'Editar' : 'Nova'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar a ocorrência'
            : 'Preencha os campos abaixo para criar uma nova ocorrência'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  error={!!errors.descricao}
                  helperText={errors.cor?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="cor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="color"
                  label="Cor"
                  error={!!errors.cor}
                  helperText={errors.cor?.message}
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
