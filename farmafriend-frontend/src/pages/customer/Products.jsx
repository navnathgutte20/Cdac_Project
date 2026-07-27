import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, CardMedia, CardContent, Typography, TextField, MenuItem, Pagination, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../redux/slices/productSlice'
import EmptyState from '../../components/EmptyState'
import Loader from '../../components/Loader'

const categories = ['All','SEEDS', 
	'FERTILIZERS',
	'PESTICIDES', 
	'FUNGICIDES',
	'HERBICIDES', 
	'PLANT_GROWTH_REGULATORS', 
	'MICRONUTRIENTS', 
	'BIO_FERTILIZERS',
	'DRIP_IRRIGATION', 
  'SPRAYERS', 
	'IRRIGATION_EQUIPMENT', 
	'FARM_TOOLS',
	'AGRICULTURAL_MACHINERY',
	'ANIMAL_FEED', 
	'VETERINARY_PRODUCTS',
	'ORGANIC_FARMING', 
	'GREENHOUSE_SUPPLIES', 
	'HARVESTING_EQUIPMENT',
	'STORAGE_PRODUCTS', 
	'GARDENING_PRODUCTS']
const Products = () => {
  const dispatch = useDispatch()
  const { list, totalPages, status } = useSelector((s) => s.products)
  const [filters, setFilters] = useState({ name: '', category: '', page: 0 })

  useEffect(() => {
    dispatch(fetchProducts({
      name: filters.name || undefined,
      category: filters.category === 'All' || !filters.category ? undefined : filters.category,
      page: filters.page,
      size: 8,
    }))
  }, [dispatch, filters])

  return (
    <Box className="page-container">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Products</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products…" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value, page: 0 })}
          sx={{ minWidth: 260, flex: 1, maxWidth: 400 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <TextField
          select label="Category" value={filters.category || 'All'}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 0 })}
          sx={{ minWidth: 200 }}
        >
          {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Box>

      {status === 'loading' && list.length === 0 ? <Loader /> : (
        <Grid container spacing={3}>
          {list.map((p) => (
            <Grid item xs={12} sm={6} md={3} key={p.productId}>
              <Card component={Link} to={`/customer/products/${p.productId}`} sx={{ textDecoration: 'none', height: '100%', transition: 'transform 0.15s', '&:hover': { transform: 'translateY(-3px)' } }}>
                <CardMedia component="img" height="150" image={p.imageUrl || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'} alt={p.productName} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{p.productName}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.category}</Typography>
                  <Typography className="mono" variant="h6" color="primary.main" sx={{ mt: 1, fontWeight: 700 }}>₹{p.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {status === 'succeeded' && list.length === 0 && (
            <Grid item xs={12}><EmptyState title="No products found" description="Try a different search term or category." /></Grid>
          )}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination count={totalPages} page={filters.page + 1} onChange={(e, val) => setFilters({ ...filters, page: val - 1 })} color="primary" />
        </Box>
      )}
    </Box>
  )
}

export default Products
