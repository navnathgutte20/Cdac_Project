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
import { paymentService } from '../../services/paymentService' // create-order / verify calls
import { fetchCart } from '../../redux/slices/cartSlice'

const steps = ['Delivery address', 'Order summary', 'Payment method']

// Loads the Razorpay checkout script once, reuses it on subsequent calls.
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

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

  const selectedAddressDetail = addresses.find((a) => String(a.addressId) === String(selectedAddress))

  // Places the order (backend) and finalizes it — used both for COD and
  // after a successful Razorpay payment verification.
  const finalizeOrder = async (order, paymentDetails) => {
    if (paymentDetails) {
      await paymentService.verifyPayment({
        orderId: order.orderId,
        razorpayOrderId: paymentDetails.razorpay_order_id,
        razorpayPaymentId: paymentDetails.razorpay_payment_id,
        razorpaySignature: paymentDetails.razorpay_signature,
      })
    }
    dispatch(fetchCart())
    toast.success('Order placed successfully!')
    navigate('/customer/orders')
  }

  const openRazorpayCheckout = async (order) => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Unable to load payment gateway. Please try again.')
      setPlacing(false)
      return
    }

    // Ask the backend to create a Razorpay order for this FarmaFriend order.
    const { data } = await paymentService.createOrder({
      orderId: order.orderId,
      amount: checkoutTotal,
    })
    console.log('Razorpay create-order response:', data)

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency || 'INR',
      name: 'FarmaFriend',
      description: `Payment for Order #${order.orderId}`,
      order_id: data.razorpayOrderId,
      handler: async (response) => {
        try {
          await finalizeOrder(order, response)
        } catch (err) {
          toast.error('Payment verification failed. Please contact support.')
        } finally {
          setPlacing(false)
        }
      },
      modal: {
        ondismiss: () => {
          toast.info('Payment cancelled')
          setPlacing(false)
        },
      },
      prefill: {},
      theme: { color: '#2f5233' }, // fern green
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => {
      toast.error('Payment failed. Please try again.')
      setPlacing(false)
    })
    rzp.open()
  }

  const handleProceedToPayment = async () => {
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
        paymentMethod,
      }))

      if (!placeOrder.fulfilled.match(result)) {
        toast.error(result.payload || 'Failed to place order')
        setPlacing(false)
        return
      }

      const order = result.payload

      if (paymentMethod === 'CASH_ON_DELIVERY') {
        await finalizeOrder(order, null)
        setPlacing(false)
      } else {
        // Razorpay flow: create-order -> checkout -> verify happens inside.
        await openRazorpayCheckout(order)
      }
    } catch (err) {
      toast.error('Something went wrong while placing your order')
      setPlacing(false)
    }
  }

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
          {/* Step 1: Delivery address */}
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

          {/* Step 2: Review order */}
          {activeStep === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Review your order</Typography>

              <Typography variant="body2" color="text.secondary">Deliver to</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                {selectedAddressDetail
                  ? `${selectedAddressDetail.addressLine}, ${selectedAddressDetail.city}, ${selectedAddressDetail.state} - ${selectedAddressDetail.pincode}`
                  : '—'}
              </Typography>

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
                <Button onClick={handleBack} color="inherit">Back</Button>
                <Button variant="contained" onClick={handleNext}>Next</Button>
              </Box>
            </Paper>
          )}

          {/* Step 3: Payment method */}
          {activeStep === 2 && (
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
                <Button onClick={handleBack} color="inherit" disabled={placing}>Back</Button>
                <Button variant="contained" size="large" onClick={handleProceedToPayment} disabled={placing}>
                  {placing
                    ? 'Processing…'
                    : paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'Place order'
                      : 'Proceed to payment'}
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