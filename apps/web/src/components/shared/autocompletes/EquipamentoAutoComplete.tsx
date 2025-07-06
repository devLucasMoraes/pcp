import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useEquipamentoQueries } from '../../../hooks/queries/useEquipamentoQueries'

type FieldProps = {
  size?: 'small' | 'medium'
  field: {
    value: string | null
    onChange: (value: string | null) => void
    onBlur: () => void
    name: string
  }
  error?: {
    message?: string
  }
}

export const EquipamentoAutoComplete = ({
  field,
  error,
  size = 'medium',
}: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllEquipamentos } = useEquipamentoQueries()
  const { data: equipamentos = [], isLoading } = useGetAllEquipamentos(orgSlug!)

  const selectedEquipamento =
    equipamentos.find((equipamento) => equipamento.id === field.value) || null

  return (
    <Autocomplete
      value={selectedEquipamento}
      options={equipamentos}
      getOptionLabel={(option) => option.nome}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.id : null)
      }}
      size={size}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          onBlur={field.onBlur}
          label="Equipamento"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  )
}
