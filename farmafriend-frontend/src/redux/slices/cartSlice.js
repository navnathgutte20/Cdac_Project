import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cartService } from '../../services/cartService'

const initialState = { items: [], totalAmount: 0, status: 'idle', error: null }

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartService.getCart()
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load cart')
  }
})

export const addToCart = createAsyncThunk('cart/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await cartService.addItem(payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add item')
  }
})

export const removeFromCart = createAsyncThunk('cart/remove', async (cartItemId, { rejectWithValue }) => {
  try {
    const { data } = await cartService.removeItem(cartItemId)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item')
  }
})

const applyCart = (state, cart) => {
  state.items = cart.items
  state.totalAmount = cart.totalAmount
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => { state.items = []; state.totalAmount = 0 },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading' })
      .addCase(fetchCart.fulfilled, (state, action) => { state.status = 'succeeded'; applyCart(state, action.payload) })
      .addCase(fetchCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
      .addCase(addToCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(removeFromCart.fulfilled, (state, action) => applyCart(state, action.payload))
  },
})

export const { clearCartState } = cartSlice.actions
export default cartSlice.reducer
