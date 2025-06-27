import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField'
import { SignUpFormData, signUpSchema } from '../../../schemas/auth'
import { useAlertStore } from '../../../stores/alert-store'
import { useAuthStore } from '../../../stores/auth-store'

interface registerType {
  title?: string
  subtitle?: JSX.Element | JSX.Element[]
  subtext?: JSX.Element | JSX.Element[]
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const { signUp } = useAuthStore()
  const { enqueueSnackbar } = useAlertStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data)
      enqueueSnackbar('Usuário criado com sucesso', { variant: 'success' })
      navigate('/auth/login')
    } catch (error) {
      console.error('Error signing up:', error)
      enqueueSnackbar('Erro ao criar usuário', { variant: 'error' })
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
        <Box>
          <Stack mb={3}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="name"
              mb="5px"
            >
              Nome
            </Typography>
            <CustomTextField
              id="name"
              variant="outlined"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
              mt="25px"
            >
              Email
            </Typography>
            <CustomTextField
              id="email"
              variant="outlined"
              fullWidth
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
              mt="25px"
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

            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="passwordConfirmation"
              mb="5px"
              mt="25px"
            >
              Confirmar Senha
            </Typography>
            <CustomTextField
              id="passwordConfirmation"
              type="password"
              variant="outlined"
              fullWidth
              {...register('passwordConfirmation')}
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation?.message}
            />
          </Stack>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isSubmitting}
          >
            Cadastrar
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  )
}

export default AuthRegister
