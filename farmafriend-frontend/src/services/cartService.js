import axiosInstance from './axiosInstance'

export const cartService = {
  getCart: () => axiosInstance.get('/cart'),
  addItem: (payload) => axiosInstance.post('/cart/add', payload),
  updateItem: (cartItemId, quantity) => axiosInstance.put(`/cart/item/${cartItemId}`, null, { params: { quantity } }),
  removeItem: (cartItemId) => axiosInstance.delete(`/cart/item/${cartItemId}`),
  clearCart: () => axiosInstance.delete('/cart/clear'),
}
