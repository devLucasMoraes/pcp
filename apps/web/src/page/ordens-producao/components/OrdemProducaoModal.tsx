import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useOrdemProducaoQueries } from '../../../hooks/queries/useOrdemProducaoQueries'
import {
  CreateOrdemProducaoDTO,
  createOrdemProducaoSchema,
} from '../../../http/ordem-producao/create-ordem-producao'
import { ListOrdensProducaoResponse } from '../../../http/ordem-producao/list-ordens-producao'
import {
  UpdateOrdemProducaoDTO,
  updateOrdemProducaoSchema,
} from '../../../http/ordem-producao/update-ordem-producao'
import { useAlertStore } from '../../../stores/alert-store'

interface OrdemProducaoModalProps {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListOrdensProducaoResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}

export const OrdemProducaoModal = ({
  open,
  onClose,
  form,
}: OrdemProducaoModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateOrdemProducaoSchema
      : createOrdemProducaoSchema

  const {
    useCreate: useCreateOrdemProducao,
    useUpdate: useUpdateOrdemProducao,
  } = useOrdemProducaoQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrdemProducaoDTO | UpdateOrdemProducaoDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      cod: '',
      descricao: '',
      tiragem: 0,
      valorServico: 0,
      nomeCliente: '',
    },
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        cod: '',
        descricao: '',
        tiragem: 0,
        valorServico: 0,
        nomeCliente: '',
      })
      return
    }
    const { data } = form

    reset({
      cod: data.cod,
      descricao: data.descricao,
      tiragem: data.tiragem,
      valorServico: data.valorServico,
      nomeCliente: data.nomeCliente,
    })
  }, [form, reset])

  const { mutate: createOrdemProducao } = useCreateOrdemProducao()

  const { mutate: updateOrdemProducao } = useUpdateOrdemProducao()

  const onSubmit = (data: CreateOrdemProducaoDTO | UpdateOrdemProducaoDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateOrdemProducao(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Ordem de Produção atualizada com sucesso', {
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
      createOrdemProducao(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Ordem de Produção criada com sucesso', {
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
            ? 'Preencha os campos abaixo para editar a ordem de produção'
            : 'Preencha os campos abaixo para criar uma nova ordem de produção'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="cod"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="OP"
                  error={!!errors.cod}
                  helperText={errors.cod?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  error={!!errors.descricao}
                  helperText={errors.descricao?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="nomeCliente"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cliente"
                  error={!!errors.nomeCliente}
                  helperText={errors.nomeCliente?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="valorServico"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor Serviço"
                  error={!!errors.valorServico}
                  helperText={errors.valorServico?.message}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="tiragem"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Tiragem"
                  error={!!errors.tiragem}
                  helperText={errors.tiragem?.message}
                  fullWidth
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
