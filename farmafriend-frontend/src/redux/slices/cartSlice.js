import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cartService } from '../../services/cartService'

const initialState = { items: [], totalAmount: 0, selectedIds: [], status: 'idle', error: null }

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

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await cartService.updateItem(cartItemId, quantity)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update item')
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

// Keeps `selectedIds` in sync with whatever items actually exist: drops ids
// for items that disappeared (removed/checked out) and auto-selects any item
// that's new to the cart, so nothing you just added is silently left out.
const applyCart = (state, cart) => {
  state.items = cart.items
  state.totalAmount = cart.totalAmount
  const validIds = new Set(cart.items.map((i) => i.cartItemId))
  const selected = state.selectedIds.filter((id) => validIds.has(id))
  cart.items.forEach((i) => {
    if (!selected.includes(i.cartItemId)) selected.push(i.cartItemId)
  })
  state.selectedIds = selected
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => { state.items = []; state.totalAmount = 0; state.selectedIds = [] },
    toggleItemSelected: (state, action) => {
      const id = action.payload
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id]
    },
    selectAllItems: (state) => { state.selectedIds = state.items.map((i) => i.cartItemId) },
    deselectAllItems: (state) => { state.selectedIds = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading' })
      .addCase(fetchCart.fulfilled, (state, action) => { state.status = 'succeeded'; applyCart(state, action.payload) })
      .addCase(fetchCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
      .addCase(addToCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(updateCartItem.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(removeFromCart.fulfilled, (state, action) => applyCart(state, action.payload))
  },
})

export const { clearCartState, toggleItemSelected, selectAllItems, deselectAllItems } = cartSlice.actions
export default cartSlice.reducer
