import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useUserQueries } from '@/hooks/queries/useUserQueries'

type FieldProps = {
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

export const UserAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllUsers } = useUserQueries()
  const { data: users = [], isLoading } = useGetAllUsers(orgSlug!)

  const selectedUser = users.find((user) => user.id === field.value) || null

  return (
    <Autocomplete
      value={selectedUser}
      options={users}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.id : null)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          onBlur={field.onBlur}
          label="Setor"
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
