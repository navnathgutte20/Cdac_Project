import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js'
import { dashboardService } from '../../services/dashboardService'
import Loader from '../../components/Loader'
import PageHeader from '../../components/PageHeader'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const STAT_ORDER = [
  { key: 'totalCustomers', label: 'Customers' },
  { key: 'totalDealers', label: 'Dealers' },
  { key: 'totalProducts', label: 'Products' },
  { key: 'totalOrders', label: 'Orders' },
  { key: 'totalShipments', label: 'Shipments' },
]

// Signature dashboard element: KPI cards linked by a single dotted "supply route"
// (Customers → Dealers → Products → Orders → Shipments), echoing how the
// business actually flows — not decoration, but a map of the pipeline.
const StatRow = ({ stats }) => (
  <Box sx={{ position: 'relative', mb: 4 }}>
    <Box
      component="svg"
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      sx={{ position: 'absolute', top: 28, left: 0, width: '100%', height: 40, display: { xs: 'none', md: 'block' }, zIndex: 0 }}
    >
      <line x1="100" y1="20" x2="900" y2="20" stroke="#C6D6CC" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
    </Box>
    <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
      {STAT_ORDER.map((s) => (
        <Grid item xs={6} md={12 / STAT_ORDER.length} key={s.key}>
          <Paper sx={{ p: 2.5, textAlign: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mx: 'auto', mb: 1.5 }} />
            <Typography className="mono" variant="h4" fontWeight={700} color="primary.main">{stats[s.key]}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
              {s.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    dashboardService.admin().then((res) => setStats(res.data.data)).catch(() => {})
  }, [])

  if (!stats) return <Loader />

  const chartData = {
    labels: ['Customers', 'Dealers', 'Products', 'Orders', 'Shipments'],
    datasets: [{
      label: 'Totals',
      data: [stats.totalCustomers, stats.totalDealers, stats.totalProducts, stats.totalOrders, stats.totalShipments],
      backgroundColor: '#0B6E4F',
      borderRadius: 6,
      maxBarThickness: 48,
    }],
  }

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="A live view of the FarmaFriend supply chain." />
      <StatRow stats={stats} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Operational totals</Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { grid: { color: '#EEF1EF' } }, x: { grid: { display: false } } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>
              Total revenue
            </Typography>
            <Typography className="mono" sx={{ fontSize: '2.4rem', fontWeight: 700, color: 'primary.main', my: 1 }}>
              ₹{stats.totalRevenue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recognized from orders with a successful payment.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
