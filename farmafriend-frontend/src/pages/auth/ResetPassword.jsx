import React, { useState } from 'react'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../../services/authService'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('This reset link is missing its token. Please request a new one.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, newPassword)
      toast.success('Password reset successfully — please sign in')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'This reset link is invalid or has expired')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>Choose a new password</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter and confirm your new password below.
      </Typography>
      {!token && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          No reset token found in the link. Please use the link from your email, or request a new one.
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal" label="New password" type="password"
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
        />
        <TextField
          fullWidth margin="normal" label="Confirm new password" type="password"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
        />
        <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'Resetting…' : 'Reset password'}
        </Button>
        <Typography align="center" sx={{ mt: 3 }} variant="body2">
          <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 700 }}>Back to sign in</Box>
        </Typography>
      </Box>
    </Box>
  )
}

export default ResetPassword
