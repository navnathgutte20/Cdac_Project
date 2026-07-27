import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchMyOrders } from '../../redux/slices/orderSlice'
import { orderService } from '../../services/orderService'
import StatusChip from '../../components/StatusChip'
import EmptyState from '../../components/EmptyState'
import Loader from '../../components/Loader'

const Orders = () => {
  const dispatch = useDispatch()
  const { list, status } = useSelector((s) => s.orders)

  useEffect(() => { dispatch(fetchMyOrders({ page: 0, size: 20 })) }, [dispatch])

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId)
      toast.success('Order cancelled')
      dispatch(fetchMyOrders({ page: 0, size: 20 }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    }
  }

  return (
    <Box className="page-container">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>My orders</Typography>

      {status === 'loading' ? <Loader /> : list.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <EmptyState icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 44 }} />} title="No orders yet" description="Your placed orders will show up here." />
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((o) => (
                <TableRow key={o.orderId} hover>
                  <TableCell className="mono" sx={{ fontWeight: 700 }}>#{o.orderId}</TableCell>
                  <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell><StatusChip status={o.status} /></TableCell>
                  <TableCell align="right" className="mono" sx={{ fontWeight: 700 }}>₹{o.totalAmount}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button size="small" component={Link} to={`/customer/orders/${o.orderId}/invoice`}>Invoice</Button>
                      {['CREATED', 'CONFIRMED'].includes(o.status) && (
                        <Button size="small" color="error" onClick={() => handleCancel(o.orderId)}>Cancel</Button>
                      )}
                    </Box>
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

export default Orders
