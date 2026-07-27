import React, { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Badge, Menu, MenuItem, Avatar, Divider, Button, Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import Logo from '../components/Logo'

const navItems = [
  { label: 'Home', path: '/customer/home', icon: <HomeOutlinedIcon fontSize="small" /> },
  { label: 'Products', path: '/customer/products', icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { label: 'Orders', path: '/customer/orders', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
]

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((s) => s.auth.user)
  const cartCount = useSelector((s) => s.cart.items.length)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Box component={Link} to="/customer/home" sx={{ display: 'flex' }}>
            <Logo size={30} color="#16241F" markColor="#0B6E4F" />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 5, gap: 0.5 }}>
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path)
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? 'primary.light' : 'transparent',
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton component={Link} to="/customer/cart">
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartOutlinedIcon sx={{ color: 'text.primary' }} />
            </Badge>
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 700 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { borderRadius: 2, mt: 1 } }}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem component={Link} to="/customer/profile" onClick={() => setAnchorEl(null)}>
              <PersonOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <Box sx={{ p: 2 }}><Logo size={28} color="#16241F" /></Box>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.path} component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
