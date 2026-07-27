import React, { useEffect, useState } from 'react'
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem, Button, Avatar,
} from '@mui/material'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { customerService } from '../../services/customerService'
import { dealerService } from '../../services/dealerService'

const Customers = () => {
  const [customers, setCustomers] = useState(null)
  const [reOptions, setReOptions] = useState([])
  const [assigning, setAssigning] = useState({})

  const load = () => {
    customerService.getAll().then((res) => setCustomers(res.data.data)).catch(() => setCustomers([]))
  }

  useEffect(load, [])

  useEffect(() => {
    // Representative Executives share the /dealer-style listing pattern via the users table;
    // fetched here through the customer list's representativeName is read-only, so for the
    // assignment dropdown we ask the backend for all customers with role context omitted —
    // in absence of a dedicated RE-list endpoint we reuse the assigned customers the admin
    // already sees and let them type an RE id directly if needed.
  }, [])

  const handleAssign = async (customerId) => {
    const reId = assigning[customerId]
    if (!reId) {
      toast.error('Enter a Representative Executive user ID first')
      return
    }
    try {
      await customerService.assignRe(customerId, reId)
      toast.success('Representative executive assigned')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign representative executive')
    }
  }

  if (!customers) return <Loader />

  return (
    <Box>
      <PageHeader title="Customers" subtitle={`${customers.length} registered`} />
      {customers.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No customers yet" /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Assigned RE</TableCell>
                <TableCell align="right">Assign RE (by user ID)</TableCell>
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
                  <TableCell>{c.representativeName || '—'}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <TextField
                        size="small" placeholder="RE user ID" sx={{ width: 120 }}
                        value={assigning[c.userId] || ''}
                        onChange={(e) => setAssigning({ ...assigning, [c.userId]: e.target.value })}
                      />
                      <Button size="small" variant="outlined" onClick={() => handleAssign(c.userId)}>Assign</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  )
}

export default Customers
