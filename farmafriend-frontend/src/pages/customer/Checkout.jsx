import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Radio, RadioGroup, FormControlLabel, Button, TextField, Grid, Divider,
  Stepper, Step, StepLabel,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { addressService } from '../../services/addressService'
import { placeOrder } from '../../redux/slices/orderSlice'
import { orderService } from '../../services/orderService'
import { fetchCart } from '../../redux/slices/cartSlice'

const steps = ['Delivery address', 'Payment method', 'Order summary']

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const [newAddress, setNewAddress] = useState({ addressLine: '', city: '', state: '', pincode: '' })
  const [placing, setPlacing] = useState(false)
  const { items, selectedIds } = useSelector((s) => s.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Only the products the customer checked off in the cart are part of this order.
  const checkoutItems = items.filter((i) => selectedIds.includes(i.cartItemId))
  const checkoutTotal = checkoutItems.reduce((sum, i) => sum + Number(i.subTotal), 0)

  useEffect(() => {
    if (checkoutItems.length === 0) {
      toast.error('Select at least one product in your cart before checking out')
      navigate('/customer/cart')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      toast.error('Please select or add a delivery address')
      return
    }
    setActiveStep((s) => s + 1)
  }

  const handleBack = () => setActiveStep((s) => s - 1)

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select or add a delivery address')
      return
    }
    if (checkoutItems.length === 0) {
      toast.error('Select at least one product to check out')
      return
    }
    setPlacing(true)
    try {
      const result = await dispatch(placeOrder({
        addressId: selectedAddress,
        cartItemIds: checkoutItems.map((i) => i.cartItemId),
      }))
      if (placeOrder.fulfilled.match(result)) {
        const order = result.payload
        await orderService.initiatePayment({ orderId: order.orderId, paymentMethod })
        // Only the checked-out items left the cart on the backend — refresh
        // so anything left unselected still shows up here.
        dispatch(fetchCart())
        toast.success('Order placed successfully!')
        navigate('/customer/orders')
      } else {
        toast.error(result.payload || 'Failed to place order')
      }
    } finally {
      setPlacing(false)
    }
  }

  const selectedAddressDetail = addresses.find((a) => String(a.addressId) === String(selectedAddress))

  return (
    <Box className="page-container">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Checkout</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Delivery address</Typography>
              {addresses.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You don&apos;t have any saved addresses yet — add one below.
                </Typography>
              )}
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="contained" onClick={handleNext}>Next</Button>
              </Box>
            </Paper>
          )}

          {activeStep === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Payment method</Typography>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="UPI" control={<Radio color="primary" />} label="UPI" />
                <FormControlLabel value="NET_BANKING" control={<Radio color="primary" />} label="Net Banking" />
                <FormControlLabel value="CREDIT_CARD" control={<Radio color="primary" />} label="Credit Card" />
                <FormControlLabel value="DEBIT_CARD" control={<Radio color="primary" />} label="Debit Card" />
                <FormControlLabel value="CASH_ON_DELIVERY" control={<Radio color="primary" />} label="Cash on Delivery" />
              </RadioGroup>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack} color="inherit">Back</Button>
                <Button variant="contained" onClick={handleNext}>Next</Button>
              </Box>
            </Paper>
          )}

          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Review your order</Typography>

              <Typography variant="body2" color="text.secondary">Deliver to</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                {selectedAddressDetail
                  ? `${selectedAddressDetail.addressLine}, ${selectedAddressDetail.city}, ${selectedAddressDetail.state} - ${selectedAddressDetail.pincode}`
                  : '—'}
              </Typography>

              <Typography variant="body2" color="text.secondary">Payment method</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>{paymentMethod.replace(/_/g, ' ')}</Typography>

              <Divider sx={{ my: 2 }} />

              {checkoutItems.map((item) => (
                <Box key={item.cartItemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.productName} × {item.quantity}</Typography>
                  <Typography variant="body2" className="mono">₹{item.subTotal}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" className="mono" color="primary.main">₹{checkoutTotal}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack} color="inherit" disabled={placing}>Back</Button>
                <Button variant="contained" size="large" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Placing order…' : 'Place order'}
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Order summary <Typography component="span" variant="body2" color="text.secondary">({checkoutItems.length} item{checkoutItems.length === 1 ? '' : 's'})</Typography>
            </Typography>
            {checkoutItems.map((item) => (
              <Box key={item.cartItemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{item.productName} × {item.quantity}</Typography>
                <Typography variant="body2" className="mono">₹{item.subTotal}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" className="mono" color="primary.main">₹{checkoutTotal}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Checkout
