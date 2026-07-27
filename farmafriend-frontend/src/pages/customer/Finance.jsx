import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { financeService } from '../../services/financeService'

const statusColors = {
  APPLIED: 'default', UNDER_VERIFICATION: 'info', VERIFIED: 'info',
  REJECTED_AT_VERIFICATION: 'error', PENDING_APPROVAL: 'warning',
  APPROVED: 'success', REJECTED: 'error', DISBURSED: 'success', CLOSED: 'default',
}

const Finance = () => {
  const [applications, setApplications] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ requestedAmount: '', tenureMonths: '', cibilScore: '' })

  const loadApplications = () => {
    financeService.myApplications().then((res) => setApplications(res.data.data)).catch(() => {})
  }

  useEffect(loadApplications, [])

  const handleApply = async () => {
    if (!form.requestedAmount || !form.tenureMonths) {
      toast.error('Please fill in the requested amount and tenure')
      return
    }
    try {
      await financeService.apply({
        requestedAmount: Number(form.requestedAmount),
        tenureMonths: Number(form.tenureMonths),
        cibilScore: form.cibilScore ? Number(form.cibilScore) : undefined,
      })
      toast.success('Finance application submitted')
      setOpen(false)
      setForm({ requestedAmount: '', tenureMonths: '', cibilScore: '' })
      loadApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application')
    }
  }

  return (
    <Container className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Finance Applications</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Apply for Finance</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application #</TableCell>
              <TableCell align="right">Requested Amount</TableCell>
              <TableCell>Tenure</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">EMI Schedule</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((a) => (
              <TableRow key={a.applicationId}>
                <TableCell>#{a.applicationId}</TableCell>
                <TableCell align="right">₹{a.requestedAmount}</TableCell>
                <TableCell>{a.tenureMonths} months</TableCell>
                <TableCell><Chip label={a.status} color={statusColors[a.status] || 'default'} size="small" /></TableCell>
                <TableCell align="right">
                  <Button size="small" component={Link} to={`/customer/emi/${a.applicationId}`} disabled={a.status !== 'APPROVED' && a.status !== 'DISBURSED'}>
                    View EMI
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No finance applications yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Apply for Finance</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Requested Amount (₹)" type="number" value={form.requestedAmount} onChange={(e) => setForm({ ...form, requestedAmount: e.target.value })} />
          <TextField label="Tenure (months)" type="number" value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} />
          <TextField label="CIBIL Score (optional)" type="number" value={form.cibilScore} onChange={(e) => setForm({ ...form, cibilScore: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Finance
