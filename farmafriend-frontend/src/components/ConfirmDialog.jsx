import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

const ConfirmDialog = ({ open, title, message, onConfirm, onClose }) => (
  <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ p: 2.5, pt: 0 }}>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>Confirm</Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmDialog
