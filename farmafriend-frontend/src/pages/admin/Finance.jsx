import React, { useState } from 'react'
import {
  Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Box,
} from '@mui/material'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'
import { financeService } from '../../services/financeService'

// Admin can look up any application by ID and take the same verify/approve actions
// available to Finance Officers / Approval Heads.
const Finance = () => {
  const [appId, setAppId] = useState('')
  const [application, setApplication] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [approvedAmount, setApprovedAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')

  const lookup = async () => {
    if (!appId) return
    try {
      const res = await financeService.getById(appId)
      setApplication(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application not found')
      setApplication(null)
    }
  }

  const verify = async (approved) => {
    try {
      await financeService.verify(appId, { approved, remarks })
      toast.success('Verification recorded')
      lookup()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed')
    }
  }

  const approve = async (approved) => {
    try {
      await financeService.approve(appId, {
        approved,
        approvedAmount: approvedAmount ? Number(approvedAmount) : undefined,
        interestRate: interestRate ? Number(interestRate) : undefined,
      })
      toast.success('Approval decision recorded')
      lookup()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed')
    }
  }

  return (
    <Container maxWidth={false}>
      <PageHeader title="Finance Applications" />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Application ID" value={appId} onChange={(e) => setAppId(e.target.value)} sx={{ width: 200 }} />
          <Button variant="contained" onClick={lookup}>Look Up</Button>
        </Box>
      </Paper>

      {application && (
        <Paper sx={{ p: 3 }}>
          <Table>
            <TableBody>
              <TableRow><TableCell>Applicant</TableCell><TableCell>{application.customerName}</TableCell></TableRow>
              <TableRow><TableCell>Requested Amount</TableCell><TableCell>₹{application.requestedAmount}</TableCell></TableRow>
              <TableRow><TableCell>Tenure</TableCell><TableCell>{application.tenureMonths} months</TableCell></TableRow>
              <TableRow><TableCell>CIBIL Score</TableCell><TableCell>{application.cibilScore || '—'}</TableCell></TableRow>
              <TableRow><TableCell>Status</TableCell><TableCell>{application.status}</TableCell></TableRow>
            </TableBody>
          </Table>

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
            <TextField label="Verification Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} multiline rows={2} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" color="success" onClick={() => verify(true)}>Verify — Approve</Button>
              <Button variant="outlined" color="error" onClick={() => verify(false)}>Verify — Reject</Button>
            </Box>

            <TextField label="Approved Amount" type="number" value={approvedAmount} onChange={(e) => setApprovedAmount(e.target.value)} />
            <TextField label="Interest Rate (% p.a.)" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" color="success" onClick={() => approve(true)}>Approve Loan</Button>
              <Button variant="outlined" color="error" onClick={() => approve(false)}>Reject Loan</Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default Finance
