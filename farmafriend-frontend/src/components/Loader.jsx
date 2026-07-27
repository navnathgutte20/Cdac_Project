import React from 'react'
import { Box, CircularProgress } from '@mui/material'

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
    <CircularProgress sx={{ color: 'primary.main' }} />
  </Box>
)

export default Loader
