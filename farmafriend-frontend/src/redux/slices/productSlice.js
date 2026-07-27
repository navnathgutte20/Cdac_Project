import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productService } from '../../services/productService'

const initialState = { list: [], totalPages: 0, totalElements: 0, pageNumber: 0, status: 'idle', error: null }

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await productService.search(params)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load products')
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading' })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload.content
        state.totalPages = action.payload.totalPages
        state.totalElements = action.payload.totalElements
        state.pageNumber = action.payload.pageNumber
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  },
})

export default productSlice.reducer
