import React, { useEffect, useState } from 'react'
import { Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { reService } from '../../services/reService'

const statusColors = { APPROVED: 'success', REJECTED: 'error', DISBURSED: 'success' }

// Read-only view for the RE: shows the approval outcome (approved amount / interest rate)
// for finance applications belonging to their assigned customers that have reached a final decision.
const Approvals = () => {
  const [applications, setApplications] = useState(null)

  useEffect(() => {
    reService.getFinanceApplications().then((res) => {
      const decided = res.data.data.filter((a) => ['APPROVED', 'REJECTED', 'DISBURSED'].includes(a.status))
      setApplications(decided)
    }).catch(() => setApplications([]))
  }, [])

  if (!applications) return <Loader />

  return (
    <Container maxWidth={false}>
      <PageHeader title="Approvals" />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Approved Amount</TableCell>
              <TableCell align="right">Interest Rate</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((a) => (
              <TableRow key={a.applicationId}>
                <TableCell>#{a.applicationId}</TableCell>
                <TableCell>{a.customerName}</TableCell>
                <TableCell align="right">{a.approvedAmount ? `₹${a.approvedAmount}` : '—'}</TableCell>
                <TableCell align="right">{a.interestRate ? `${a.interestRate}%` : '—'}</TableCell>
                <TableCell><Chip size="small" label={a.status} color={statusColors[a.status] || 'default'} /></TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No approval decisions yet for your customers.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

export default Approvals
