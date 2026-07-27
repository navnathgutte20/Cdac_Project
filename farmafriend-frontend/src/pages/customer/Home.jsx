import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid, Chip } from '@mui/material'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { productService } from '../../services/productService'

const Home = () => {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    productService.search({ page: 0, size: 4 }).then((res) => setFeatured(res.data.data.content)).catch(() => {})
  }, [])

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0B6E4F 0%, #0F8560 55%, #0B6E4F 100%)',
          color: '#fff',
          py: { xs: 7, md: 10 },
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 800 400"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }}
        >
          <path d="M -40 380 C 120 340, 160 260, 280 250 S 460 160, 420 60 S 560 -40, 700 -20"
            stroke="#E8A33D" strokeWidth="2" strokeDasharray="2 10" fill="none" strokeLinecap="round" />
          <circle cx="280" cy="250" r="5" fill="#E8A33D" />
          <circle cx="420" cy="60" r="5" fill="#FFFFFF" />
        </Box>
        <Box className="page-container" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip label="Catalog · Orders · Fulfilment" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, mb: 2 }} />
          <Typography
            sx={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              lineHeight: 1.1,
              maxWidth: 640,
            }}
          >
            Everything your dealership needs, on one shelf.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4, maxWidth: 520, opacity: 0.9 }}>
            Browse the live catalog, track stock in real time, and follow every order from
            checkout to delivery — all in one place.
          </Typography>
          <Button
            component={Link} to="/customer/products" variant="contained" size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ bgcolor: '#E8A33D', color: '#16241F', '&:hover': { bgcolor: '#C6822A' } }}
          >
            Browse products
          </Button>
        </Box>
      </Box>

      {/* Featured products */}
      <Box className="page-container">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>Featured products</Typography>
          <Button component={Link} to="/customer/products" endIcon={<ArrowForwardIcon />} sx={{ color: 'primary.main', fontWeight: 700 }}>
            View all
          </Button>
        </Box>
        <Grid container spacing={3}>
          {featured.map((p) => (
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
          {featured.length === 0 && (
            <Grid item xs={12}><Typography color="text.secondary">No products available yet.</Typography></Grid>
          )}
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
