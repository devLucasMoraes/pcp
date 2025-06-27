import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField'
import { LoginFormData, loginSchema } from '../../../schemas/auth'
import { useAlertStore } from '../../../stores/alert-store'
import { useAuthStore } from '../../../stores/auth-store'

interface loginType {
  title?: string
  subtitle?: JSX.Element | JSX.Element[]
  subtext?: JSX.Element | JSX.Element[]
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { login } = useAuthStore()
  const { enqueueSnackbar } = useAlertStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      await login(email, password)
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' })
    } catch (error) {
      console.error('Error signing in:', error)
      enqueueSnackbar('Falha ao realizar o login', { variant: 'error' })
    }
  }

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              id="username"
              variant="outlined"
              fullWidth
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Senha
            </Typography>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Lembrar-me"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Esqueceu sua senha ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isSubmitting}
          >
            Entrar
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  )
}

export default AuthLogin
