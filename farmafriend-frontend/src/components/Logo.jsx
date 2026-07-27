import React from 'react'
import { Box, Typography } from '@mui/material'

/**
 * Brand mark: a leaf-and-drop glyph (agriculture + pharma in one form)
 * inside a rounded square, paired with the Fraunces wordmark.
 */
const Logo = ({ size = 32, showWordmark = true, color = '#FFFFFF', markColor }) => {
  const mc = markColor || '#0B6E4F'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill={mc} />
        <path
          d="M20 30C20 30 12 25.5 12 18.5C12 14.9101 14.9101 12 18.5 12C19.838 12 21.0784 12.4265 22.0938 13.1523C23.1092 12.4265 24.3488 12 25.6875 12C29.2774 12 32.1875 14.9101 32.1875 18.5"
          stroke="#FFFFFF"
          strokeWidth="0"
          fill="none"
        />
        <path
          d="M20 29C13 25 10.5 20.6 12.3 16.4C13.6 13.4 17.4 12.1 20 14.3C22.6 12.1 26.4 13.4 27.7 16.4C29.5 20.6 27 25 20 29Z"
          fill="#FFFFFF"
        />
        <circle cx="27.5" cy="12.5" r="2.5" fill="#E8A33D" />
      </svg>
      {showWordmark && (
        <Typography
          sx={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 600,
            fontSize: size * 0.62,
            color,
            letterSpacing: -0.3,
            lineHeight: 1,
          }}
        >
          FarmaFriend
        </Typography>
      )}
    </Box>
  )
}

export default Logo
