import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useOcorrenciaQueries } from '../../../hooks/queries/useOcorrenciaQueries'

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

export const OcorrenciaAutoComplete = ({
  field,
  error,
  size = 'medium',
}: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllOcorrencias } = useOcorrenciaQueries()
  const { data: ocorrencias = [], isLoading } = useGetAllOcorrencias(orgSlug!)

  const selectedOcorrencia =
    ocorrencias.find((ocorrencia) => ocorrencia.id === field.value) || null

  return (
    <Autocomplete
      value={selectedOcorrencia}
      options={ocorrencias}
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
          label="Ocorrencia"
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
