import React, { useEffect, useRef, useState } from 'react'
import { Box, Fab, Paper, Typography, IconButton, TextField, Avatar, CircularProgress } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined'
import { useSelector } from 'react-redux'
import { generateBotReply } from '../utils/chatbot'

const ChatWidget = () => {
  const user = useSelector((s) => s.auth.user)
  const cartItems = useSelector((s) => s.cart.items)
  const cartTotal = useSelector((s) => s.cart.totalAmount)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        sender: 'bot',
        text: `Hi${user?.name ? ' ' + user.name.split(' ')[0] : ''}! I'm the FarmaFriend Assistant. Ask me about your orders, cart, delivery, or payments.`,
      }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setMessages((m) => [...m, { sender: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const reply = await generateBotReply(text, { user, cartItems, cartTotal })
      setMessages((m) => [...m, { sender: 'bot', text: reply }])
    } catch {
      setMessages((m) => [...m, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen((o) => !o)}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}
        aria-label="Open chat assistant"
      >
        {open ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
      </Fab>

      {open && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed', bottom: 96, right: 24, width: 340, maxWidth: 'calc(100vw - 48px)',
            height: 460, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', zIndex: 1300,
          }}
        >
          <Box sx={{ bgcolor: 'primary.main', color: '#fff', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 30, height: 30 }}>
              <SpaOutlinedIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>FarmaFriend Assistant</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>Usually replies instantly</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5, bgcolor: '#F7F5F0' }}>
            {messages.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Box
                  sx={{
                    maxWidth: '82%', px: 1.5, py: 1, borderRadius: 2, whiteSpace: 'pre-line',
                    bgcolor: m.sender === 'user' ? 'primary.main' : '#fff',
                    color: m.sender === 'user' ? '#fff' : 'text.primary',
                    boxShadow: m.sender === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="body2">{m.text}</Typography>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <CircularProgress size={16} />
                </Box>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth size="small" placeholder="Ask about orders, cart, delivery…"
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || loading}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  )
}

export default ChatWidget
