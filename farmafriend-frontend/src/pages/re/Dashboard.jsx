import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { dashboardService } from '../../services/dashboardService'

const StatCard = ({ label, value, color }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper sx={{ p: 3, borderLeft: `4px solid ${color}` }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography className="mono" variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
)

const Dashboard = () => {
  const user = useSelector((s) => s.auth.user)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    dashboardService.re().then((res) => setStats(res.data.data)).catch(() => setStats({
      totalCustomers: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0,
    }))
  }, [])

  if (!stats) return <Loader />

  return (
    <Box>
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]}`} subtitle="A snapshot of your customer portfolio." />
      <Grid container spacing={3}>
        <StatCard label="Customers assigned" value={stats.totalCustomers} color="#0B6E4F" />
        <StatCard label="Total orders" value={stats.totalOrders} color="#1C7C8C" />
        <StatCard label="Pending orders" value={stats.pendingOrders} color="#C6822A" />
        <StatCard label="Revenue collected" value={`₹${Number(stats.totalRevenue || 0).toLocaleString()}`} color="#E8A33D" />
      </Grid>
    </Box>
  )
}

export default Dashboard
