import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { dashboardService } from '../../services/dashboardService'

const StatCard = ({ label, value, color }) => (
  <Grid item xs={12} sm={6} md={4}>
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
    dashboardService.dealer().then((res) => setStats(res.data.data)).catch(() => setStats({
      totalProducts: 0, totalStockUnits: 0, lowStockProducts: 0, totalOrders: 0, pendingShipments: 0, totalRevenue: 0,
    }))
  }, [])

  if (!stats) return <Loader />

  return (
    <Box>
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]}`} subtitle="Here's what's moving through your shelf." />
      <Grid container spacing={3}>
        <StatCard label="Products in inventory" value={stats.totalProducts} color="#0B6E4F" />
        <StatCard label="Units in stock" value={stats.totalStockUnits} color="#E8A33D" />
        <StatCard label="Low stock products" value={stats.lowStockProducts} color="#C0392B" />
        <StatCard label="Orders to fulfil" value={stats.totalOrders} color="#1C7C8C" />
        <StatCard label="Pending shipments" value={stats.pendingShipments} color="#C6822A" />
        <StatCard label="Revenue collected" value={`₹${Number(stats.totalRevenue || 0).toLocaleString()}`} color="#0B6E4F" />
      </Grid>
    </Box>
  )
}

export default Dashboard
