import React, { useEffect, useState } from 'react'
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { reService } from '../../services/reService'

const emptyForm = { name: '', email: '', password: '', phone: '', address: '' }

const AssignedCustomers = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    reService.getAssignedCustomers().then((res) => setCustomers(res.data.data)).catch(() => setCustomers([]))
  }

  useEffect(load, [])

  const handleOnboard = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required')
      return
    }
    try {
      await reService.onboardCustomer(form)
      toast.success('Customer onboarded successfully')
      setOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to onboard customer')
    }
  }

  if (!customers) return <Loader />

  return (
    <Box>
      <PageHeader
        title="Assigned customers"
        subtitle={`${customers.length} customers under your care`}
        action={<Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setOpen(true)}>Onboard customer</Button>}
      />
      {customers.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No customers assigned yet" description="Onboard a new customer or ask an admin to assign one to you." /></Paper>
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
                <TableRow key={c.userId} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/re/customers/${c.userId}`)}>
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Onboard a new customer</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} helperText="At least 6 characters" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Mobile" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleOnboard}>Onboard</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AssignedCustomers
