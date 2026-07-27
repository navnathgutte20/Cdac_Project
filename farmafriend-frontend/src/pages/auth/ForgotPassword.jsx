import React, { useState } from 'react'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>Reset password</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your registered email and we'll send you a reset link.
      </Typography>
      {submitted && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>If this email is registered, a reset link is on its way.</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 2 }}>
          Send reset link
        </Button>
        <Typography align="center" sx={{ mt: 3 }} variant="body2">
          <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 700 }}>Back to sign in</Box>
        </Typography>
      </Box>
    </Box>
  )
}

export default ForgotPassword
