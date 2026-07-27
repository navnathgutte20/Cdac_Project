import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Radio, RadioGroup, FormControlLabel, Button, TextField, Grid, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { addressService } from '../../services/addressService'
import { placeOrder } from '../../redux/slices/orderSlice'
import { orderService } from '../../services/orderService'
import { clearCartState } from '../../redux/slices/cartSlice'

const Checkout = () => {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const [newAddress, setNewAddress] = useState({ addressLine: '', city: '', state: '', pincode: '' })
  const { totalAmount, items } = useSelector((s) => s.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loadAddresses = () => {
    addressService.getAll().then((res) => {
      setAddresses(res.data.data)
      if (res.data.data.length > 0) setSelectedAddress(res.data.data[0].addressId)
    }).catch(() => {})
  }

  useEffect(loadAddresses, [])

  const handleAddAddress = async () => {
    if (!newAddress.addressLine || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill in all address fields')
      return
    }
    await addressService.add(newAddress)
    toast.success('Address added')
    setNewAddress({ addressLine: '', city: '', state: '', pincode: '' })
    loadAddresses()
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select or add a delivery address')
      return
    }
    const result = await dispatch(placeOrder({ addressId: selectedAddress }))
    if (placeOrder.fulfilled.match(result)) {
      const order = result.payload
      await orderService.initiatePayment({ orderId: order.orderId, paymentMethod })
      dispatch(clearCartState())
      toast.success('Order placed successfully!')
      navigate('/customer/orders')
    } else {
      toast.error(result.payload || 'Failed to place order')
    }
  }

  return (
    <Box className="page-container">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Checkout</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Delivery address</Typography>
            <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
              {addresses.map((a) => (
                <FormControlLabel
                  key={a.addressId} value={a.addressId} control={<Radio color="primary" />}
                  label={`${a.addressLine}, ${a.city}, ${a.state} - ${a.pincode}`}
                />
              ))}
            </RadioGroup>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>Add a new address</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField label="Address Line" value={newAddress.addressLine} onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })} sx={{ flex: 1, minWidth: 200 }} size="small" />
              <TextField label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} sx={{ width: 150 }} size="small" />
              <TextField label="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} sx={{ width: 150 }} size="small" />
              <TextField label="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} sx={{ width: 120 }} size="small" />
              <Button variant="outlined" onClick={handleAddAddress}>Add</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Payment method</Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel value="UPI" control={<Radio color="primary" />} label="UPI" />
              <FormControlLabel value="NET_BANKING" control={<Radio color="primary" />} label="Net Banking" />
              <FormControlLabel value="CREDIT_CARD" control={<Radio color="primary" />} label="Credit Card" />
              <FormControlLabel value="DEBIT_CARD" control={<Radio color="primary" />} label="Debit Card" />
              <FormControlLabel value="CASH_ON_DELIVERY" control={<Radio color="primary" />} label="Cash on Delivery" />
            </RadioGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Order summary</Typography>
            {items.map((item) => (
              <Box key={item.cartItemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{item.productName} × {item.quantity}</Typography>
                <Typography variant="body2" className="mono">₹{item.subTotal}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" className="mono" color="primary.main">₹{totalAmount}</Typography>
            </Box>
            <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }} onClick={handlePlaceOrder}>
              Place order
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Checkout
