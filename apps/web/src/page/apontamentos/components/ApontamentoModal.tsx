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
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { EquipamentoAutoComplete } from '../../../components/shared/autocompletes/EquipamentoAutoComplete'
import { OcorrenciaAutoComplete } from '../../../components/shared/autocompletes/OcorrenciaAutoComplete'
import { OperadorAutoComplete } from '../../../components/shared/autocompletes/OperadorAutoComplete'
import { OrdemProducaoAutoComplete } from '../../../components/shared/autocompletes/OrdemProducaoAutoComplete'
import { useApontamentoQueries } from '../../../hooks/queries/useApontamentoQueries'
import {
  CreateApontamentoDTO,
  createApontamentoSchema,
} from '../../../http/apontamento/create-apontamento'
import { ListApontamentosResponse } from '../../../http/apontamento/list-apontamentos'
import {
  UpdateApontamentoDTO,
  updateApontamentoSchema,
} from '../../../http/apontamento/update-apontamento'
import { useAlertStore } from '../../../stores/alert-store'

export const ApontamentoModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListApontamentosResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateApontamentoSchema
      : createApontamentoSchema

  const { useCreate: useCreateApontamento, useUpdate: useUpdateApontamento } =
    useApontamentoQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateApontamentoDTO | UpdateApontamentoDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      dataInicio: null as unknown as Date,
      dataFim: null as unknown as Date,
      qtdeApontada: 0,
      ocorrenciaId: '',
      operadorId: '',
      equipamentoId: '',
      ordemProducaoId: '',
    },
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        dataInicio: null as unknown as Date,
        dataFim: null as unknown as Date,
        qtdeApontada: 0,
        ocorrenciaId: '',
        operadorId: '',
        equipamentoId: '',
        ordemProducaoId: '',
      })
      return
    }

    const { data } = form

    reset({
      dataInicio: new Date(data.dataInicio),
      dataFim: new Date(data.dataFim),
      qtdeApontada: data.qtdeApontada,
      ocorrenciaId: data.ocorrencia.id,
      operadorId: data.operador.id,
      equipamentoId: data.equipamento.id,
      ordemProducaoId: data.ordemProducao.id,
    })
  }, [form, reset])

  const { mutate: createApontamento } = useCreateApontamento()

  const { mutate: updateApontamento } = useUpdateApontamento()

  const onSubmit = (data: CreateApontamentoDTO | UpdateApontamentoDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateApontamento(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            handleClose()
            enqueueSnackbar('Apontamento atualizado com sucesso', {
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
      createApontamento(
        { orgSlug, data },
        {
          onSuccess: () => {
            handleClose()
            enqueueSnackbar('Apontamento criado com sucesso', {
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
            ? 'Preencha os campos abaixo para editar o apontamento'
            : 'Preencha os campos abaixo para criar um novo apontamento'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size="auto">
            <Controller
              name="dataInicio"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Data de início"
                  slotProps={{
                    textField: {
                      error: !!errors.dataInicio,
                      helperText: errors.dataInicio?.message,
                    },
                  }}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size="auto">
            <Controller
              name="dataFim"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Data de finalização"
                  slotProps={{
                    textField: {
                      error: !!errors.dataFim,
                      helperText: errors.dataFim?.message,
                    },
                  }}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="qtdeApontada"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantidade"
                  error={!!errors.qtdeApontada}
                  helperText={errors.qtdeApontada?.message}
                  fullWidth
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="ocorrenciaId"
              control={control}
              render={({ field }) => (
                <OcorrenciaAutoComplete
                  field={field}
                  error={errors.ocorrenciaId}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="ordemProducaoId"
              control={control}
              render={({ field }) => (
                <OrdemProducaoAutoComplete
                  field={field}
                  error={errors.ordemProducaoId}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="equipamentoId"
              control={control}
              render={({ field }) => (
                <EquipamentoAutoComplete
                  field={field}
                  error={errors.equipamentoId}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="operadorId"
              control={control}
              render={({ field }) => (
                <OperadorAutoComplete field={field} error={errors.operadorId} />
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
