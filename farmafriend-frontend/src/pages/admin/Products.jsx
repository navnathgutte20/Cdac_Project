import React, { useEffect, useState } from 'react'
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Pagination, MenuItem,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import StatusChip from '../../components/StatusChip'
import ConfirmDialog from '../../components/ConfirmDialog'
import { productService } from '../../services/productService'
import { dealerService } from '../../services/dealerService'

const emptyForm = { productName: '', category: '', price: '', description: '', account: '', imageUrl: '', dealerId: '' }

const Products = () => {
  const [data, setData] = useState(null)
  const [dealers, setDealers] = useState([])
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [stockDialog, setStockDialog] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [stockDealer, setStockDealer] = useState('')

  const load = () => {
    productService.search({ page, size: 10 }).then((res) => setData(res.data.data)).catch(() => setData({ content: [], totalPages: 0 }))
  }

  useEffect(load, [page])
  useEffect(() => { dealerService.getAll().then((res) => setDealers(res.data.data)).catch(() => setDealers([])) }, [])

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setOpen(true) }

  const openEdit = (p) => {
    setEditingId(p.productId)
    setForm({ productName: p.productName, category: p.category || '', price: p.price, description: p.description || '', account: p.account || '', imageUrl: p.imageUrl || '', dealerId: p.dealerId || '' })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.productName || !form.price) {
      toast.error('Product name and price are required')
      return
    }
    try {
      const payload = { ...form, price: Number(form.price), dealerId: form.dealerId || undefined }
      if (editingId) {
        await productService.update(editingId, payload)
        toast.success('Product updated')
      } else {
        await productService.create(payload)
        toast.success('Product created')
      }
      setOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async () => {
    try {
      await productService.remove(confirmDelete)
      toast.success('Product removed')
      setConfirmDelete(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    }
  }

  const openStockDialog = (p) => {
    setStockDialog(p)
    setStockValue(p.stockQuantity ?? 0)
    setStockDealer(p.dealerId || '')
  }

  const handleStockSave = async () => {
    if (!stockDealer) {
      toast.error('Select a dealer responsible for this stock')
      return
    }
    try {
      await productService.updateStock({ dealerId: Number(stockDealer), productId: stockDialog.productId, stockQuantity: Number(stockValue) })
      toast.success('Stock updated')
      setStockDialog(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock')
    }
  }

  if (!data) return <Loader />

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle="Catalog and stock, in one place"
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add product</Button>}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Dealer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.content.map((p) => (
              <TableRow key={p.productId} hover>
                <TableCell sx={{ fontWeight: 600 }}>{p.productName}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell align="right" className="mono">₹{p.price}</TableCell>
                <TableCell align="right" className="mono">{p.availableStock}</TableCell>
                <TableCell>{p.dealerName || '—'}</TableCell>
                <TableCell><StatusChip status={p.active ? 'ACTIVE' : 'INACTIVE'} /></TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openStockDialog(p)} title="Update stock">
                    <Inventory2OutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => openEdit(p)}><EditOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => setConfirmDelete(p.productId)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {data.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={data.totalPages} page={page + 1} onChange={(e, val) => setPage(val - 1)} color="primary" />
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit product' : 'Add product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Product Name" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
          <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Account Code" value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} />
          <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <TextField select label="Fulfilling Dealer" value={form.dealerId} onChange={(e) => setForm({ ...form, dealerId: e.target.value })}>
            <MenuItem value="">None</MenuItem>
            {dealers.map((d) => <MenuItem key={d.userId} value={d.userId}>{d.name}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!stockDialog} onClose={() => setStockDialog(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update stock — {stockDialog?.productName}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField select label="Dealer" value={stockDealer} onChange={(e) => setStockDealer(e.target.value)}>
            {dealers.map((d) => <MenuItem key={d.userId} value={d.userId}>{d.name}</MenuItem>)}
          </TextField>
          <TextField label="Stock Quantity" type="number" value={stockValue} onChange={(e) => setStockValue(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setStockDialog(null)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleStockSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete product"
        message="Are you sure you want to delete this product? This cannot be undone."
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

export default Products
