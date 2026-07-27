import React from 'react'
import DashboardLayout from './DashboardLayout'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'Customers', path: '/admin/customers', icon: <PeopleOutlineIcon fontSize="small" /> },
  { label: 'Products', path: '/admin/products', icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { label: 'Dealers', path: '/admin/dealers', icon: <StorefrontOutlinedIcon fontSize="small" /> },
  { label: 'Orders', path: '/admin/orders', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
]

const AdminLayout = () => <DashboardLayout title="Admin Console" navItems={navItems} />

export default AdminLayout
