import React, { useEffect, useState } from 'react'
import { Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import { reService } from '../../services/reService'

const statusColors = {
  APPLIED: 'default', UNDER_VERIFICATION: 'info', VERIFIED: 'info',
  REJECTED_AT_VERIFICATION: 'error', PENDING_APPROVAL: 'warning',
  APPROVED: 'success', REJECTED: 'error', DISBURSED: 'success', CLOSED: 'default',
}

const FinanceApplications = () => {
  const [applications, setApplications] = useState(null)

  useEffect(() => {
    reService.getFinanceApplications().then((res) => setApplications(res.data.data)).catch(() => setApplications([]))
  }, [])

  if (!applications) return <Loader />

  return (
    <Container maxWidth={false}>
      <PageHeader title="Finance Applications" />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Requested Amount</TableCell>
              <TableCell>Tenure</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((a) => (
              <TableRow key={a.applicationId}>
                <TableCell>#{a.applicationId}</TableCell>
                <TableCell>{a.customerName}</TableCell>
                <TableCell align="right">₹{a.requestedAmount}</TableCell>
                <TableCell>{a.tenureMonths} months</TableCell>
                <TableCell><Chip size="small" label={a.status} color={statusColors[a.status] || 'default'} /></TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No finance applications from your assigned customers yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

export default FinanceApplications
