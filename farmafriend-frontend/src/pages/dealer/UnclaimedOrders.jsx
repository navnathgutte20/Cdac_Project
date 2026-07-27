import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from '@mui/material'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { orderService } from '../../services/orderService'

const UnclaimedOrders = () => {
  const [unclaimed, setUnclaimed] = useState(null)
  const [claiming, setClaiming] = useState(null)

  const loadUnclaimed = () => {
    orderService
      .unclaimedOrders({ page: 0, size: 50 })
      .then((res) => setUnclaimed(res.data.data.content))
      .catch(() => setUnclaimed([]))
  }

  useEffect(() => {
    loadUnclaimed()
  }, [])

  const handleClaim = async (orderId) => {
    setClaiming(orderId)

    try {
      await orderService.claimOrder(orderId)
      toast.success(`Order #${orderId} claimed`)
      loadUnclaimed()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim order')
    } finally {
      setClaiming(null)
    }
  }

  if (!unclaimed) return <Loader />

  return (
    <Box>
      <PageHeader
        title="Orders Available to Claim"
        subtitle="Claim customer orders assigned to your dealership."
      />

      {unclaimed.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <EmptyState
            title="No unclaimed orders"
            description="New customer orders will appear here when available."
          />
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {unclaimed.map((order) => (
                <TableRow key={order.orderId} hover>
                  <TableCell sx={{ fontWeight: 700 }}>
                    #{order.orderId}
                  </TableCell>

                  <TableCell>{order.customerName}</TableCell>

                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="right">
                    ₹{order.totalAmount}
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={claiming === order.orderId}
                      onClick={() => handleClaim(order.orderId)}
                    >
                      {claiming === order.orderId
                        ? 'Claiming...'
                        : 'Claim Order'}
                    </Button>
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

export default UnclaimedOrders