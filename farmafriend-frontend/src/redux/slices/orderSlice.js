import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { orderService } from '../../services/orderService'

const initialState = { list: [], current: null, status: 'idle', error: null }

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderService.myOrders(params)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders')
  }
})

export const placeOrder = createAsyncThunk('orders/place', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await orderService.placeOrder(payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to place order')
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.status = 'loading' })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload.content })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
      .addCase(placeOrder.fulfilled, (state, action) => { state.current = action.payload })
  },
})

export default orderSlice.reducer
