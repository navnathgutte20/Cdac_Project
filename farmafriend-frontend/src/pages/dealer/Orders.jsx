import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Box } from '@mui/material'
import PageHeader from '../../components/PageHeader'

// Dealers fulfill orders via the Shipments workflow (create/track/update status).
// This page links out to that workflow for clarity within the dealer navigation.
const Orders = () => {
  return (
    <Container maxWidth={false}>
      <PageHeader title="Orders To Fulfill" />
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Order fulfillment for dealers is handled through the Shipments section — create a shipment for an order,
          then update its status as it moves from Pending → Dispatched → In Transit → Delivered.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Use the "Shipments" tab in the left navigation to view and manage all shipments assigned to you.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Orders
