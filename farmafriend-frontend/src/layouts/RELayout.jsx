import React from 'react'
import DashboardLayout from './DashboardLayout'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

const navItems = [
  { label: 'Dashboard', path: '/re/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'Assigned Customers', path: '/re/customers', icon: <PeopleOutlineIcon fontSize="small" /> },
]

const RELayout = () => <DashboardLayout title="Representative Executive" navItems={navItems} />

export default RELayout
