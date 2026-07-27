import React, { useEffect, useState } from 'react'
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar } from '@mui/material'
import PageHeader from '../../components/PageHeader'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { dealerService } from '../../services/dealerService'

const Dealers = () => {
  const [dealers, setDealers] = useState(null)

  useEffect(() => {
    dealerService.getAll().then((res) => setDealers(res.data.data)).catch(() => setDealers([]))
  }, [])

  if (!dealers) return <Loader />

  return (
    <Box>
      <PageHeader title="Dealers" subtitle={`${dealers.length} registered`} />
      {dealers.length === 0 ? (
        <Paper sx={{ p: 2 }}><EmptyState title="No dealers registered yet" /></Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dealer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dealers.map((d) => (
                <TableRow key={d.userId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.light', color: 'primary.main', fontSize: '0.8rem', fontWeight: 700 }}>
                        {d.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      {d.name}
                    </Box>
                  </TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>{d.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  )
}

export default Dealers
