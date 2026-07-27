import React, { useEffect, useState } from 'react'
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar } from '@mui/material'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { reService } from '../../services/reService'

const AssignedCustomers = () => {
  const [customers, setCustomers] = useState(null)

  useEffect(() => {
    reService.getAssignedCustomers().then((res) => setCustomers(res.data.data)).catch(() => setCustomers([]))
  }, [])

  if (!customers) return <Loader />

  return (
    <Box>
      <PageHeader title="Assigned customers" subtitle={`${customers.length} customers under your care`} />
      {customers.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No customers assigned yet" description="An admin can assign customers to you from the Customers page." /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.userId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.light', color: 'primary.main', fontSize: '0.8rem', fontWeight: 700 }}>
                        {c.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      {c.name}
                    </Box>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.address || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  )
}

export default AssignedCustomers
