import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Typography, Link as MuiLink, CircularProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { login } from '../../redux/slices/authSlice'

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const roleHome = {
  ADMIN: '/admin/dashboard',
  CUSTOMER: '/customer/home',
  DEALER: '/dealer/dashboard',
  REPRESENTATIVE_EXECUTIVE: '/re/customers',
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector((s) => s.auth.status)

  const onSubmit = async (formData) => {
    const result = await dispatch(login(formData))
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate(roleHome[result.payload.role] || '/')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>Sign in</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter your details to access your FarmaFriend workspace.
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth margin="normal" label="Email" type="email"
          {...register('email')} error={!!errors.email} helperText={errors.email?.message}
        />
        <TextField
          fullWidth margin="normal" label="Password" type="password"
          {...register('password')} error={!!errors.password} helperText={errors.password?.message}
        />
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Forgot password?
          </MuiLink>
        </Box>
        <Button fullWidth variant="contained" size="large" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign in'}
        </Button>
        <Typography align="center" sx={{ mt: 3 }} variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register" sx={{ color: 'primary.main', fontWeight: 700 }}>Create one</MuiLink>
        </Typography>
      </Box>
    </Box>
  )
}

export default Login
