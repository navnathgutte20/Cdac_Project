import React, { useEffect, useState } from 'react'
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { productService } from '../../services/productService'

const Products = () => {
  const user = useSelector((s) => s.auth.user)
  const [products, setProducts] = useState(null)
  const [editing, setEditing] = useState(null)
  const [stockValue, setStockValue] = useState('')

  const load = () => {
    if (!user) return
    productService.getForDealer(user.userId).then((res) => setProducts(res.data.data)).catch(() => setProducts([]))
  }

  useEffect(load, [user])

  const openStockEdit = (p) => {
    setEditing(p)
    setStockValue(p.stockQuantity ?? 0)
  }

  const handleSave = async () => {
    try {
      await productService.updateStock({ dealerId: user.userId, productId: editing.productId, stockQuantity: Number(stockValue) })
      toast.success('Stock updated')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock')
    }
  }

  if (!products) return <Loader />

  return (
    <Box>
      <PageHeader title="My products" subtitle="Products you're responsible for stocking" />
      {products.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No products assigned yet" description="Ask an admin to assign products to your dealer profile." /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock Quantity</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Reserved</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.productId} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.productName}</TableCell>
                  <TableCell align="right" className="mono">₹{p.price}</TableCell>
                  <TableCell align="right" className="mono">{p.stockQuantity}</TableCell>
                  <TableCell align="right" className="mono">{p.availableStock}</TableCell>
                  <TableCell align="right" className="mono">{p.reservedStock}</TableCell>
                  <TableCell align="right"><Button size="small" onClick={() => openStockEdit(p)}>Update stock</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update stock — {editing?.productName}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField fullWidth label="Stock Quantity" type="number" value={stockValue} onChange={(e) => setStockValue(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditing(null)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Products
