import React, { useEffect, useState } from 'react'
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@mui/material'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import StatusChip from '../../components/StatusChip'
import { orderService } from '../../services/orderService'

const Orders = () => {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    orderService.allOrders({ page, size: 10 }).then((res) => setData(res.data.data)).catch(() => setData({ content: [], totalPages: 0 }))
  }, [page])

  if (!data) return <Loader />

  return (
    <Box>
      <PageHeader title="All orders" />
      {data.content.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No orders found" /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Tracking</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((o) => (
                <TableRow key={o.orderId} hover>
                  <TableCell className="mono" sx={{ fontWeight: 700 }}>#{o.orderId}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell><StatusChip status={o.status} /></TableCell>
                  <TableCell align="right" className="mono">₹{o.totalAmount}</TableCell>
                  <TableCell>{o.paymentStatus ? <StatusChip status={o.paymentStatus} /> : '—'}</TableCell>
                  <TableCell className="mono">{o.trackingNumber || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {data.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={data.totalPages} page={page + 1} onChange={(e, val) => setPage(val - 1)} color="primary" />
        </Box>
      )}
    </Box>
  )
}

export default Orders
