import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  TextField, Button, Box, Typography, Link as MuiLink, CircularProgress,
  ToggleButtonGroup, ToggleButton,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { register as registerUser } from '../../redux/slices/authSlice'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  mobile: yup.string().required('Mobile number is required'),
  address: yup.string(),
  role: yup.string().required('Please select an account type'),
})

const roles = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'DEALER', label: 'Dealer' },
  { value: 'REPRESENTATIVE_EXECUTIVE', label: 'Rep. Executive' },
]

const Register = () => {
  const { register: registerField, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'CUSTOMER' },
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector((s) => s.auth.status)

  const onSubmit = async (formData) => {
    const result = await dispatch(registerUser(formData))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created — welcome to FarmaFriend!')
      navigate('/login')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>Create your account</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Join as a customer, dealer, or representative executive.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              exclusive
              fullWidth
              onChange={(e, val) => val && field.onChange(val)}
              sx={{ mb: 2 }}
            >
              {roles.map((r) => (
                <ToggleButton
                  key={r.value}
                  value={r.value}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '10px !important',
                    '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } },
                  }}
                >
                  {r.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />

        <TextField fullWidth margin="normal" label="Full Name" {...registerField('name')} error={!!errors.name} helperText={errors.name?.message} />
        <TextField fullWidth margin="normal" label="Email" type="email" {...registerField('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField fullWidth margin="normal" label="Password" type="password" {...registerField('password')} error={!!errors.password} helperText={errors.password?.message} />
        <TextField fullWidth margin="normal" label="Mobile Number" {...registerField('mobile')} error={!!errors.mobile} helperText={errors.mobile?.message} />
        <TextField fullWidth margin="normal" label="Address / Location" {...registerField('address')} error={!!errors.address} helperText={errors.address?.message} />

        <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 2 }} disabled={status === 'loading'}>
          {status === 'loading' ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create account'}
        </Button>
        <Typography align="center" sx={{ mt: 3 }} variant="body2" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 700 }}>Sign in</MuiLink>
        </Typography>
      </Box>
    </Box>
  )
}

export default Register
