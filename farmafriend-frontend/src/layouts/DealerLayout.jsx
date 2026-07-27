import React from 'react'
import DashboardLayout from './DashboardLayout'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'

const navItems = [

  { label: 'Dashboard', path: '/dealer/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'My Inventory', path: '/dealer/inventory', icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { label: 'My Products', path: '/dealer/products', icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { label: 'Shipments', path: '/dealer/shipments', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
]

const DealerLayout = () => <DashboardLayout title="Dealer Portal" navItems={navItems} />

export default DealerLayout
