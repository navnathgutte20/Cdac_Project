import React, { useEffect, useState } from 'react'
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem, Button,
} from '@mui/material'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import StatusChip from '../../components/StatusChip'
import { orderService } from '../../services/orderService'

const statusOptions = ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']

const Shipments = () => {
  const user = useSelector((s) => s.auth.user)
  const [orders, setOrders] = useState(null)
  const [claimOrderId, setClaimOrderId] = useState('')

  const load = () => {
    if (!user) return
    orderService.ordersForDealer(user.userId, { page: 0, size: 50 }).then((res) => setOrders(res.data.data.content)).catch(() => setOrders([]))
  }

  useEffect(load, [user])

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateShipmentStatus(orderId, status)
      toast.success('Shipment status updated')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleClaim = async () => {
    if (!claimOrderId) {
      toast.error('Enter an order ID to claim')
      return
    }
    try {
      await orderService.createShipment({ orderId: Number(claimOrderId), dealerId: user.userId })
      toast.success('Order claimed and shipment created')
      setClaimOrderId('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim order')
    }
  }

  if (!orders) return <Loader />

  return (
    <Box>
      <PageHeader
        title="Shipments"
        subtitle="Orders routed through your dealership"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" placeholder="Order ID to claim" value={claimOrderId} onChange={(e) => setClaimOrderId(e.target.value)} sx={{ width: 160 }} />
            <Button variant="outlined" onClick={handleClaim}>Claim order</Button>
          </Box>
        }
      />
      {orders.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No shipments assigned yet" /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Tracking</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.orderId} hover>
                  <TableCell className="mono" sx={{ fontWeight: 700 }}>#{o.orderId}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell className="mono">{o.trackingNumber}</TableCell>
                  <TableCell><StatusChip status={o.shipmentStatus} /></TableCell>
                  <TableCell align="right">
                    <TextField
                      select size="small" defaultValue={o.shipmentStatus} sx={{ minWidth: 150 }}
                      onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                    >
                      {statusOptions.map((opt) => <MenuItem key={opt} value={opt}>{opt.replace(/_/g, ' ')}</MenuItem>)}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  )
}

export default Shipments
