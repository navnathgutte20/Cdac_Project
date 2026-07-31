import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Divider, Grid } from '@mui/material'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import { orderService } from '../../services/orderService'
import { paymentService } from '../../services/paymentService'
import Loader from '../../components/Loader'
import Logo from '../../components/Logo'
import StatusChip from '../../components/StatusChip'

const Invoice = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    orderService.getInvoice(id).then((res) => setOrder(res.data.data)).catch(() => {})
  }, [id])

  useEffect(() => {
    if (!order?.orderId) return
    paymentService.getStatus(order.orderId)
      .then((res) => setPayment(res.data))
      .catch(() => {}) // e.g. COD orders may have no Payment record — fail silently
  }, [order?.orderId])

  if (!order) return <Loader />

  const paymentStatus = payment?.status || order.paymentStatus

  return (
    <Box className="page-container">
      <Paper sx={{ p: { xs: 3, md: 5 }, maxWidth: 760, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Logo size={30} color="#16241F" />
          <Button variant="outlined" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>Print</Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="overline" color="text.secondary">Order</Typography>
            <Typography className="mono" fontWeight={700}>#{order.orderId}</Typography>
            <Typography variant="body2" color="text.secondary">{new Date(order.orderDate).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="overline" color="text.secondary">customer Name</Typography>
            <Typography fontWeight={700}>{order.customerName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="overline" color="text.secondary">Order status</Typography>
            <Box sx={{ mt: 0.5 }}><StatusChip status={order.status} /></Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="overline" color="text.secondary">Payment status</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', gap: 1, alignItems: 'center' }}>
              <StatusChip status={paymentStatus} />
              <Typography variant="caption" color="text.secondary">{order.paymentMethod?.replace(/_/g, ' ')}</Typography>
            </Box>
            {payment?.razorpayPaymentId && (
              <Typography variant="caption" color="text.secondary" className="mono" sx={{ display: 'block', mt: 0.5 }}>
                {/* Txn: {payment.razorpayPaymentId} */}
              </Typography>
            )}
          </Grid>
          {order.trackingNumber && (
            <Grid item xs={12}>
              <Typography variant="overline" color="text.secondary">Tracking</Typography>
              <Typography className="mono" fontWeight={700}>{order.trackingNumber}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.productName}</TableCell>
                <TableCell align="right" className="mono">{item.quantity}</TableCell>
                <TableCell align="right" className="mono">₹{item.unitPrice}</TableCell>
                <TableCell align="right" className="mono">₹{item.subTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" className="mono" color="primary.main">₹{order.totalAmount}</Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Invoice