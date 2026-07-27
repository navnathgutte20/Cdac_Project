import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button, Paper } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { Link } from 'react-router-dom'
import { fetchCart, removeFromCart } from '../../redux/slices/cartSlice'
import EmptyState from '../../components/EmptyState'
import Loader from '../../components/Loader'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, totalAmount, status } = useSelector((s) => s.cart)

  useEffect(() => { dispatch(fetchCart()) }, [dispatch])

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
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Unit price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.cartItemId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{item.productName}</TableCell>
                    <TableCell align="right" className="mono">₹{item.unitPrice}</TableCell>
                    <TableCell align="right" className="mono">{item.quantity}</TableCell>
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
              Total: <Box component="span" className="mono" sx={{ fontWeight: 700, color: 'primary.main' }}>₹{totalAmount}</Box>
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/customer/checkout">
              Proceed to checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Cart
