import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const NotFound = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: 'background.default' }}>
    <Logo size={30} color="#16241F" />
    <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '3rem', color: 'primary.main', mt: 2 }}>404</Typography>
    <Typography variant="h6" fontWeight={700}>This page wandered off the shelf</Typography>
    <Button variant="contained" component={Link} to="/" sx={{ mt: 1 }}>Go home</Button>
  </Box>
)

export default NotFound
