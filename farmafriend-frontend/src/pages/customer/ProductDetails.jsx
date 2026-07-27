import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Button, Chip, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { productService } from '../../services/productService'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'
import Loader from '../../components/Loader'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    productService.getById(id).then((res) => setProduct(res.data.data)).catch(() => toast.error('Product not found'))
  }, [id])

  const handleAddToCart = async () => {
    const result = await dispatch(addToCart({ productId: Number(id), quantity }))
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart')
    } else {
      toast.error(result.payload || 'Please login as a customer to add items to cart')
      navigate('/login')
    }
  }

  if (!product) return <Loader />

  const inStock = (product.availableStock ?? 0) > 0

  return (
    <Box className="page-container">
      <Grid container spacing={5}>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={product.imageUrl || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=700'}
            alt={product.productName}
            sx={{ width: '100%', borderRadius: 3, border: '1px solid #E1E8E3' }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Chip label={product.category} sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700, mb: 1.5 }} size="small" />
          <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '2.2rem' }}>{product.productName}</Typography>
          <Typography className="mono" variant="h4" color="primary.main" fontWeight={700} sx={{ my: 2 }}>₹{product.price}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520 }}>{product.description}</Typography>
          {product.dealerName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Fulfilled by <b>{product.dealerName}</b></Typography>
          )}
          <Typography variant="body2" sx={{ mb: 3, fontWeight: 600, color: inStock ? 'primary.main' : 'error.main' }}>
            {inStock ? `${product.availableStock} in stock` : 'Out of stock'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              type="number" label="Qty" value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              sx={{ width: 100 }} inputProps={{ min: 1 }}
            />
            <Button variant="contained" size="large" onClick={handleAddToCart} disabled={!inStock}>
              Add to cart
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductDetails
