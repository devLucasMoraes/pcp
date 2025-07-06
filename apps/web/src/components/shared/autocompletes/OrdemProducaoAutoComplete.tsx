import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useOrdemProducaoQueries } from '../../../hooks/queries/useOrdemProducaoQueries'

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

export const OrdemProducaoAutoComplete = ({
  field,
  error,
  size = 'medium',
}: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllOrdens } = useOrdemProducaoQueries()
  const { data: ordens = [], isLoading } = useGetAllOrdens(orgSlug!)

  const selectedOrdemProducao =
    ordens.find((ordem) => ordem.id === field.value) || null

  return (
    <Autocomplete
      value={selectedOrdemProducao}
      options={ordens}
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
          label="OrdemProducao"
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
