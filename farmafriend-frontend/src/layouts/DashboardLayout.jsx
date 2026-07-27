import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Avatar, IconButton, Menu, MenuItem, Divider, Chip,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { logout } from '../redux/slices/authSlice'
import Logo from '../components/Logo'

const drawerWidth = 248

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  DEALER: 'Dealer',
  REPRESENTATIVE_EXECUTIVE: 'Representative Executive',
}

const DashboardLayout = ({ title, navItems }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#16241F',
            color: '#FFFFFF',
            border: 'none',
          },
        }}
      >
        <Box sx={{ px: 3, py: 3 }}>
          <Logo size={28} color="#FFFFFF" />
          <Chip
            label={title}
            size="small"
            sx={{ mt: 1.5, bgcolor: 'rgba(232,163,61,0.16)', color: '#E8A33D', fontWeight: 700, fontSize: '0.68rem' }}
          />
        </Box>
        <List sx={{ px: 1.5, mt: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                  bgcolor: active ? '#0B6E4F' : 'transparent',
                  '&:hover': { bgcolor: active ? '#0B6E4F' : 'rgba(255,255,255,0.06)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem' }} primary={item.label} />
              </ListItemButton>
            )
          })}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper' }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ gap: 1, borderRadius: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 200 } }}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{ROLE_LABELS[user?.role] || user?.role}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
