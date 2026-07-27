import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'

const Dashboard = () => {
  const user = useSelector((s) => s.auth.user)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user) return
    Promise.all([
      productService.getForDealer(user.userId).catch(() => ({ data: { data: [] } })),
      orderService.ordersForDealer(user.userId, { page: 0, size: 1 }).catch(() => ({ data: { data: { totalElements: 0 } } })),
    ]).then(([productsRes, ordersRes]) => {
      const products = productsRes.data.data
      setStats({
        productCount: products.length,
        totalStock: products.reduce((sum, p) => sum + (p.availableStock || 0), 0),
        orderCount: ordersRes.data.data.totalElements,
      })
    })
  }, [user])

  if (!stats) return <Loader />

  return (
    <Box>
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]}`} subtitle="Here's what's moving through your shelf." />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #0B6E4F' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Products assigned</Typography>
            <Typography className="mono" variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{stats.productCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #E8A33D' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Units in stock</Typography>
            <Typography className="mono" variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{stats.totalStock}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #1C7C8C' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Orders to fulfil</Typography>
            <Typography className="mono" variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{stats.orderCount}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
