import React, { useEffect, useState } from 'react'
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Grid, IconButton, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import StatusChip from '../../components/StatusChip'
import { dealerService } from '../../services/dealerService'
import { PRODUCT_CATEGORIES, formatCategoryLabel } from '../../constants/productCategories'

const emptyProductForm = {
  productName: '', category: '', price: '', description: '', account: '', imageUrl: '', initialStock: '',
}

const Products = () => {
  const [products, setProducts] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [editing, setEditing] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [removing, setRemoving] = useState(null)

  const load = () => {
    dealerService.myInventory().then((res) => setProducts(res.data.data)).catch(() => setProducts([]))
  }

  useEffect(load, [])

  const openStockEdit = (p) => {
    setEditing(p)
    setStockValue(p.stockQuantity ?? 0)
  }

  const handleStockSave = async () => {
    try {
      await dealerService.updateOwnStock(editing.productId, Number(stockValue))
      toast.success('Stock updated')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock')
    }
  }

  const handleAddProduct = async () => {
    if (!productForm.productName || !productForm.category || !productForm.price || productForm.initialStock === '') {
      toast.error('Product name, category, price, and initial stock are required')
      return
    }
    try {
      await dealerService.addProduct({
        ...productForm,
        price: Number(productForm.price),
        initialStock: Number(productForm.initialStock),
      })
      toast.success('Product added to your inventory')
      setAddOpen(false)
      setProductForm(emptyProductForm)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    }
  }

  const handleRemove = async () => {
    try {
      await dealerService.removeProduct(removing.productId)
      toast.success('Product removed from your inventory')
      setRemoving(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove product')
      setRemoving(null)
    }
  }

  if (!products) return <Loader />

  return (
    <Box>
      <PageHeader
        title="My inventory"
        subtitle="Products you stock and fulfil"
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>Add product</Button>}
      />
      {products.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <EmptyState title="No products yet" description="Add your first product to start managing your own stock." />
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock Quantity</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Reserved</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.productId} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.productName}</TableCell>
                  <TableCell>{formatCategoryLabel(p.category)}</TableCell>
                  <TableCell align="right" className="mono">₹{p.price}</TableCell>
                  <TableCell align="right" className="mono">{p.stockQuantity}</TableCell>
                  <TableCell align="right" className="mono">{p.availableStock}</TableCell>
                  <TableCell align="right" className="mono">{p.reservedStock}</TableCell>
                  <TableCell><StatusChip status={p.active ? 'ACTIVE' : 'INACTIVE'} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Update stock">
                      <IconButton size="small" onClick={() => openStockEdit(p)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove product">
                      <IconButton size="small" color="error" onClick={() => setRemoving(p)} disabled={!p.active}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Update stock dialog */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update stock — {editing?.productName}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField fullWidth label="Stock Quantity" type="number" value={stockValue} onChange={(e) => setStockValue(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditing(null)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleStockSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add product dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add a product to your inventory</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Product name" value={productForm.productName}
                onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select fullWidth label="Category" value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{formatCategoryLabel(c)}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Price" type="number" value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Initial stock" type="number" value={productForm.initialStock}
                onChange={(e) => setProductForm({ ...productForm, initialStock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Account (ledger code)" value={productForm.account}
                onChange={(e) => setProductForm({ ...productForm, account: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Image URL" value={productForm.imageUrl}
                onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth multiline minRows={2} label="Description" value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}>Add product</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!removing}
        title="Remove product?"
        message={`"${removing?.productName}" will be deactivated and hidden from the catalog. This can't be undone from here.`}
        onConfirm={handleRemove}
        onClose={() => setRemoving(null)}
      />
    </Box>
  )
}

export default Products
