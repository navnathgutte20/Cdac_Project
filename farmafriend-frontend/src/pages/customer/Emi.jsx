import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from '@mui/material'
import { toast } from 'react-toastify'
import { financeService } from '../../services/financeService'

const statusColors = { PENDING: 'warning', PAID: 'success', OVERDUE: 'error', WAIVED: 'default' }

const Emi = () => {
  const { id } = useParams()
  const [schedule, setSchedule] = useState([])

  const load = () => {
    financeService.emiSchedule(id).then((res) => setSchedule(res.data.data)).catch(() => {})
  }

  useEffect(load, [id])

  const handlePay = async (emiId) => {
    try {
      await financeService.payEmi(emiId)
      toast.success('EMI paid successfully')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to pay EMI')
    }
  }

  return (
    <Container className="page-container">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>EMI Schedule — Application #{id}</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((emi) => (
              <TableRow key={emi.emiId}>
                <TableCell>{emi.emiNumber}</TableCell>
                <TableCell align="right">₹{emi.amount}</TableCell>
                <TableCell>{emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell><Chip size="small" label={emi.status} color={statusColors[emi.status] || 'default'} /></TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained" disabled={emi.status === 'PAID'} onClick={() => handlePay(emi.emiId)}>
                    {emi.status === 'PAID' ? 'Paid' : 'Pay Now'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {schedule.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No EMI schedule generated yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

export default Emi
