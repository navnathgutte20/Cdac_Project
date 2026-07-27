import React from 'react'
import { Chip } from '@mui/material'

// Central color mapping so every status pill in the app (orders, payments, shipments)
// reads consistently at a glance.
const PALETTES = {
  // order status
  CREATED: { bg: '#EEF1EF', fg: '#5B6B63' },
  CONFIRMED: { bg: '#E4F1EA', fg: '#0B6E4F' },
  PROCESSING: { bg: '#FDF1DC', fg: '#C6822A' },
  SHIPPED: { bg: '#E3F0F2', fg: '#1C7C8C' },
  DELIVERED: { bg: '#E4F1EA', fg: '#0B6E4F' },
  CANCELLED: { bg: '#FBEAE8', fg: '#C0392B' },
  RETURNED: { bg: '#FDF1DC', fg: '#C6822A' },
  // payment status
  PENDING: { bg: '#FDF1DC', fg: '#C6822A' },
  SUCCESS: { bg: '#E4F1EA', fg: '#0B6E4F' },
  FAILED: { bg: '#FBEAE8', fg: '#C0392B' },
  REFUNDED: { bg: '#E3F0F2', fg: '#1C7C8C' },
  // shipment status
  DISPATCHED: { bg: '#E3F0F2', fg: '#1C7C8C' },
  IN_TRANSIT: { bg: '#FDF1DC', fg: '#C6822A' },
  // generic
  ACTIVE: { bg: '#E4F1EA', fg: '#0B6E4F' },
  INACTIVE: { bg: '#EEF1EF', fg: '#5B6B63' },
}

const StatusChip = ({ status, label, size = 'small' }) => {
  const palette = PALETTES[status] || { bg: '#EEF1EF', fg: '#5B6B63' }
  return (
    <Chip
      size={size}
      label={label || (status ? status.replace(/_/g, ' ') : '—')}
      sx={{
        bgcolor: palette.bg,
        color: palette.fg,
        fontWeight: 700,
        fontSize: '0.7rem',
        letterSpacing: 0.3,
        textTransform: 'capitalize',
      }}
    />
  )
}

export default StatusChip
