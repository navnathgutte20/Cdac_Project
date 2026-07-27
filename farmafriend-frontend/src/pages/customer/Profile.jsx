import React from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider
} from '@mui/material'

const Profile = () => {
  const user = useSelector((s) => s.auth.user)

  console.log(user)

  return (
    <Box className="page-container">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 650 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: 'primary.main',
              fontSize: 30,
              fontWeight: 700
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700}>
              {user?.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user?.role?.replace(/_/g, ' ')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography color="text.secondary">User ID</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={600}>{user?.userId}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography color="text.secondary">Name</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={600}>{user?.name}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography color="text.secondary">Email</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={600}>{user?.email}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Profile