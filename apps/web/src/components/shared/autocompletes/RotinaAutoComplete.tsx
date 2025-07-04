import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useRotinaQueries } from '../../../hooks/queries/useRotinaQueries'

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

export const RotinaAutoComplete = ({
  field,
  error,
  size = 'medium',
}: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllRotinas } = useRotinaQueries()
  const { data: rotinas = [], isLoading } = useGetAllRotinas(orgSlug!)

  const selectedRotina =
    rotinas.find((rotina) => rotina.id === field.value) || null

  return (
    <Autocomplete
      value={selectedRotina}
      options={rotinas}
      getOptionLabel={(option) => option.descricao}
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
          label="Rotina"
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
