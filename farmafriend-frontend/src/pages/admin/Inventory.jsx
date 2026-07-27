import React, { useEffect, useState } from 'react'
import {
  Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Box, MenuItem,
} from '@mui/material'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { dealerService } from '../../services/dealerService'
import { productService } from '../../services/productService'

const Inventory = () => {
  const [dealers, setDealers] = useState([])
  const [selectedDealer, setSelectedDealer] = useState('')
  const [inventory, setInventory] = useState(null)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ productId: '', stockQuantity: '' })

  useEffect(() => {
    dealerService.getAll().then((res) => setDealers(res.data.data)).catch(() => setDealers([]))
    productService.search({ page: 0, size: 100 }).then((res) => setProducts(res.data.data.content)).catch(() => setProducts([]))
  }, [])

  const loadInventory = (dealerId) => {
    if (!dealerId) return
    dealerService.getInventory(dealerId).then((res) => setInventory(res.data.data)).catch(() => setInventory([]))
  }

  useEffect(() => loadInventory(selectedDealer), [selectedDealer])

  const handleUpdate = async () => {
    if (!selectedDealer || !form.productId || form.stockQuantity === '') {
      toast.error('Select a dealer, product, and enter stock quantity')
      return
    }
    try {
      await dealerService.updateStock({
        dealerId: Number(selectedDealer),
        productId: Number(form.productId),
        stockQuantity: Number(form.stockQuantity),
      })
      toast.success('Stock updated')
      setForm({ productId: '', stockQuantity: '' })
      loadInventory(selectedDealer)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock')
    }
  }

  return (
    <Container maxWidth={false}>
      <PageHeader title="Inventory Management" />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField select label="Select Dealer" value={selectedDealer} onChange={(e) => setSelectedDealer(e.target.value)} sx={{ minWidth: 220 }}>
            {dealers.map((d) => <MenuItem key={d.dealerId} value={d.dealerId}>{d.dealerName}</MenuItem>)}
          </TextField>
          <TextField select label="Product" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} sx={{ minWidth: 220 }}>
            {products.map((p) => <MenuItem key={p.productId} value={p.productId}>{p.productName}</MenuItem>)}
          </TextField>
          <TextField label="Stock Quantity" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} sx={{ width: 160 }} />
          <Button variant="contained" onClick={handleUpdate}>Update Stock</Button>
        </Box>
      </Paper>

      {inventory === null ? null : inventory === undefined ? <Loader /> : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Stock Quantity</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Reserved</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((i) => (
                <TableRow key={i.inventoryId}>
                  <TableCell>{i.productName}</TableCell>
                  <TableCell align="right">{i.stockQuantity}</TableCell>
                  <TableCell align="right">{i.availableStock}</TableCell>
                  <TableCell align="right">{i.reservedStock}</TableCell>
                </TableRow>
              ))}
              {inventory.length === 0 && (
                <TableRow><TableCell colSpan={4} align="center">Select a dealer to view inventory.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  )
}

export default Inventory
