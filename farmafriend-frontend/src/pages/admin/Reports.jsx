import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Typography, Box } from '@mui/material'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { dashboardService } from '../../services/dashboardService'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const Reports = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    dashboardService.admin().then((res) => setStats(res.data.data)).catch(() => {})
  }, [])

  if (!stats) return <Loader />

  const pieData = {
    labels: ['Orders', 'Payments', 'Shipments', 'Finance Applications'],
    datasets: [{
      data: [stats.totalOrders, stats.totalPayments, stats.totalShipments, stats.totalFinanceApplications],
      backgroundColor: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0'],
    }],
  }

  const revenueData = {
    labels: ['Total Revenue'],
    datasets: [{ label: '₹', data: [stats.totalRevenue], backgroundColor: '#388e3c' }],
  }

  return (
    <Container maxWidth={false}>
      <PageHeader title="Reports" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Operational Distribution</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Revenue</Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={revenueData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Reports
