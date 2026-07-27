import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button, Paper,
  Checkbox, TextField,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  fetchCart, removeFromCart, updateCartItem, toggleItemSelected, selectAllItems, deselectAllItems,
} from '../../redux/slices/cartSlice'
import EmptyState from '../../components/EmptyState'
import Loader from '../../components/Loader'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, selectedIds, status } = useSelector((s) => s.cart)

  useEffect(() => { dispatch(fetchCart()) }, [dispatch])

  const allSelected = items.length > 0 && selectedIds.length === items.length
  const someSelected = selectedIds.length > 0 && !allSelected

  const selectedItems = items.filter((i) => selectedIds.includes(i.cartItemId))
  const selectedTotal = selectedItems.reduce((sum, i) => sum + Number(i.subTotal), 0)

  const handleQuantityChange = (cartItemId, quantity) => {
    const value = Number(quantity)
    if (!value || value < 1) return
    dispatch(updateCartItem({ cartItemId, quantity: value }))
  }

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one product to check out')
      return
    }
    navigate('/customer/checkout')
  }

  return (
    <Box className="page-container">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Your cart</Typography>

      {status === 'loading' ? <Loader /> : items.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <EmptyState
            icon={<ShoppingCartOutlinedIcon sx={{ fontSize: 44 }} />}
            title="Your cart is empty"
            description="Browse the catalog and add something to get started."
          />
        </Paper>
      ) : (
        <>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={() => dispatch(allSelected ? deselectAllItems() : selectAllItems())}
                    />
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Unit price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.cartItemId} hover selected={selectedIds.includes(item.cartItemId)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(item.cartItemId)}
                        onChange={() => dispatch(toggleItemSelected(item.cartItemId))}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{item.productName}</TableCell>
                    <TableCell align="right" className="mono">₹{item.unitPrice}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.cartItemId, e.target.value)}
                        inputProps={{ min: 1, style: { textAlign: 'right', width: 56 } }}
                      />
                    </TableCell>
                    <TableCell align="right" className="mono" sx={{ fontWeight: 700 }}>₹{item.subTotal}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => dispatch(removeFromCart(item.cartItemId))}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="h6">
              {selectedIds.length} of {items.length} selected — Total:{' '}
              <Box component="span" className="mono" sx={{ fontWeight: 700, color: 'primary.main' }}>₹{selectedTotal}</Box>
            </Typography>
            <Button variant="contained" size="large" onClick={handleCheckout} disabled={selectedIds.length === 0}>
              Checkout selected ({selectedIds.length})
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Cart
