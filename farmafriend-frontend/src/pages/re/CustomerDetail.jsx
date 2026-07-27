import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Typography,
  IconButton, Grid, Pagination,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import StatusChip from '../../components/StatusChip'
import { reService } from '../../services/reService'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    reService.getCustomer(id).then((res) => setCustomer(res.data.data)).catch(() => setCustomer(false))
  }, [id])

  useEffect(() => {
    reService.getCustomerOrders(id, { page, size: 10 }).then((res) => setOrders(res.data.data)).catch(() => setOrders({ content: [], totalPages: 0 }))
  }, [id, page])

  if (customer === null || orders === null) return <Loader />
  if (customer === false) return <Paper sx={{ p: 2 }}><EmptyState title="Customer not found" description="This customer may not be assigned to you." /></Paper>

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <IconButton onClick={() => navigate('/re/customers')} size="small">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">Back to assigned customers</Typography>
      </Box>

      <PageHeader
        title={customer.name}
        subtitle="Customer profile and order history"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700 }}>
              {customer.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Box>
        }
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body2" fontWeight={600}>{customer.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">Mobile</Typography>
            <Typography variant="body2" fontWeight={600}>{customer.phone || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">Address</Typography>
            <Typography variant="body2" fontWeight={600}>{customer.address || '—'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>Order history</Typography>
      {orders.content.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No orders yet" description="This customer hasn't placed any orders." /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.content.map((o) => (
                <TableRow key={o.orderId} hover>
                  <TableCell className="mono" sx={{ fontWeight: 700 }}>#{o.orderId}</TableCell>
                  <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell><StatusChip status={o.status} /></TableCell>
                  <TableCell>{o.paymentStatus ? <StatusChip status={o.paymentStatus} /> : '—'}</TableCell>
                  <TableCell align="right" className="mono" sx={{ fontWeight: 700 }}>₹{o.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination count={orders.totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} color="primary" />
            </Box>
          )}
        </Paper>
      )}
    </Box>
  )
}

export default CustomerDetail
