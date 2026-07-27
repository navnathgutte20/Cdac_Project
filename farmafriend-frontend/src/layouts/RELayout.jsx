import React from 'react'
import DashboardLayout from './DashboardLayout'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

const navItems = [
  { label: 'Assigned Customers', path: '/re/customers', icon: <PeopleOutlineIcon fontSize="small" /> },
]

const RELayout = () => <DashboardLayout title="Representative Executive" navItems={navItems} />

export default RELayout
