import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, CssBaseline } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import { store } from './redux/store.js'
import theme from './theme.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
