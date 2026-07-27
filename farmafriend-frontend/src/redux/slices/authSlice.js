import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

const storedUser = localStorage.getItem('user')

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: localStorage.getItem('accessToken') || null,
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

const persistSession = (payload) => {
  localStorage.setItem('accessToken', payload.accessToken)
  localStorage.setItem('refreshToken', payload.refreshToken)
  localStorage.setItem(
    'user',
    JSON.stringify({ userId: payload.userId, name: payload.name, email: payload.email, role: payload.role })
  )
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.accessToken = null
      localStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.accessToken = action.payload.accessToken
        state.user = {
          userId: action.payload.userId, name: action.payload.name,
          email: action.payload.email, role: action.payload.role,
        }
        persistSession(action.payload)
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.accessToken = action.payload.accessToken
        state.user = {
          userId: action.payload.userId, name: action.payload.name,
          email: action.payload.email, role: action.payload.role,
        }
        persistSession(action.payload)
      })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
