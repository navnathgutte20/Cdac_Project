import React from 'react'
import { Box, Typography } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

const EmptyState = ({ title = 'Nothing here yet', description, icon }) => (
  <Box sx={{ textAlign: 'center', py: 8, px: 3, color: 'text.secondary' }}>
    <Box sx={{ color: '#C6D6CC', mb: 1.5 }}>
      {icon || <InboxOutlinedIcon sx={{ fontSize: 44 }} />}
    </Box>
    <Typography variant="subtitle1" fontWeight={700} color="text.primary">{title}</Typography>
    {description && <Typography variant="body2" sx={{ mt: 0.5 }}>{description}</Typography>}
  </Box>
)

export default EmptyState
