import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Typography, Stack } from '@mui/material'
import Logo from '../components/Logo'

const FEATURES = [
  'Live product catalog with dealer-managed stock',
  'One cart, one checkout, one order timeline',
  'Shipment tracking from dispatch to doorstep',
]

const AuthLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '44%',
          minWidth: 420,
          px: 6,
          py: 6,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0B6E4F 0%, #084F39 100%)',
          color: '#fff',
        }}
      >
        {/* signature: connected-route motif */}
        <Box
          component="svg"
          viewBox="0 0 400 500"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.16 }}
        >
          <path
            d="M -20 420 C 80 380, 100 300, 190 280 S 300 180, 260 100 S 340 -20, 420 -40"
            stroke="#E8A33D"
            strokeWidth="2"
            strokeDasharray="2 10"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="190" cy="280" r="5" fill="#E8A33D" />
          <circle cx="260" cy="100" r="5" fill="#FFFFFF" />
          <circle cx="-20" cy="420" r="5" fill="#FFFFFF" />
        </Box>

        <Logo size={34} color="#FFFFFF" />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 500,
              fontStyle: 'italic',
              fontSize: '2.1rem',
              lineHeight: 1.25,
              mb: 4,
            }}
          >
            From the dealer's shelf to the customer's door — one connected ledger.
          </Typography>
          <Stack spacing={1.5}>
            {FEATURES.map((f) => (
              <Stack key={f} direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#E8A33D', mt: 1, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ opacity: 0.88 }}>{f}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.6, position: 'relative', zIndex: 1 }}>
          © {new Date().getFullYear()} FarmaFriend ERP
        </Typography>
      </Box>

      {/* Form panel */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, py: 6 }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
            <Logo size={30} color="#16241F" />
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AuthLayout
