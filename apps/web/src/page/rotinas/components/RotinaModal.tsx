import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid2,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { IconCircleMinus, IconPlus } from '@tabler/icons-react'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { OcorrenciaAutoComplete } from '../../../components/shared/autocompletes/OcorrenciaAutoComplete'
import { tarefaTipo } from '../../../constants'
import { TarefaTipo } from '../../../constants/TarefaTipo'
import { useRotinaQueries } from '../../../hooks/queries/useRotinaQueries'
import { createRotinaSchema } from '../../../http/rotina-tarefas/create-rotina'
import { ListRotinasResponse } from '../../../http/rotina-tarefas/list-rotinas'
import {
  UpdateRotinaDTO,
  updateRotinaSchema,
} from '../../../http/rotina-tarefas/update-rotina'
import { useAlertStore } from '../../../stores/alert-store'

export const RotinaModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListRotinasResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const { useCreate, useUpdate } = useRotinaQueries()

  const isUpdate = form?.type === 'UPDATE'

  const schema = isUpdate ? updateRotinaSchema : createRotinaSchema

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateRotinaDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      descricao: '',
      tarefas: [],
    },
  })

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'tarefas',
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        descricao: '',
        tarefas: [],
      })
      return
    }

    const { data } = form

    reset({
      descricao: data.descricao,
      tarefas: data.tarefas.map((item) => ({
        id: item.id,
        tipo: item.tipo as TarefaTipo,
        ocorrenciaId: item.ocorrencia.id,
      })),
    })
  }, [form, reset])

  const { mutate: createRotina } = useCreate()
  const { mutate: updateRotina } = useUpdate()

  const handleSuccess = () => {
    handleClose()
    enqueueSnackbar(
      `Requisição ${isUpdate ? 'atualizada' : 'criada'} com sucesso`,
      { variant: 'success' },
    )
  }

  const onSubmit = (data: UpdateRotinaDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (isUpdate && form?.data) {
      updateRotina(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: handleSuccess,
          onError: (error) => {
            console.error(error)
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            })
          },
        },
      )
    } else {
      createRotina(
        { orgSlug, data },
        {
          onSuccess: handleSuccess,
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

  const handleAddTarefa = () => {
    prepend({
      id: null,
      ocorrenciaId: '',
      tipo: '' as TarefaTipo,
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const renderItems = () => {
    if (fields.length === 0) {
      return (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Nenhuma tarefa adicionada
          </Typography>
          <Button
            startIcon={<IconPlus size={18} />}
            onClick={handleAddTarefa}
            variant="outlined"
            size="small"
          >
            Adicionar primeira tarefa
          </Button>
        </Box>
      )
    }

    return (
      <Box>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              px: 2,
              py: 2,
              mb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={2}>
                <Controller
                  name={`tarefas.${index}.tipo`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tipo"
                      error={!!errors.tarefas?.[index]?.tipo}
                      helperText={errors.tarefas?.[index]?.tipo?.message}
                      fullWidth
                      size="small"
                      select
                    >
                      {tarefaTipo.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid2>

              <Grid2 size={4}>
                <Controller
                  name={`tarefas.${index}.ocorrenciaId`}
                  control={control}
                  render={({ field }) => (
                    <OcorrenciaAutoComplete
                      size="small"
                      field={field}
                      error={errors.tarefas?.[index]?.ocorrenciaId}
                    />
                  )}
                />
              </Grid2>

              <Grid2
                size={1}
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <IconButton
                  onClick={() => remove(index)}
                  color="error"
                  size="small"
                >
                  <IconCircleMinus />
                </IconButton>
              </Grid2>
            </Grid2>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      fullWidth
      maxWidth="xl"
      disableRestoreFocus
    >
      <DialogTitle>{isUpdate ? 'Editar' : 'Nova'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isUpdate
            ? 'Preencha os campos abaixo para editar a rotina de tarefas'
            : 'Preencha os campos abaixo para criar uma nova rotina de tarefas'}
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
                  helperText={errors.descricao?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          {/* Items Section */}
          <Grid2 size={12}>
            <Box sx={{ mt: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
                gap={1}
              >
                <Divider textAlign="left" sx={{ flexGrow: 1 }}>
                  <Chip label="Tarefas" />
                </Divider>
                <Button
                  startIcon={<IconPlus size={18} />}
                  onClick={handleAddTarefa}
                  variant="outlined"
                  size="small"
                >
                  adicionar tarefa
                </Button>
              </Stack>

              {renderItems()}
            </Box>
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
