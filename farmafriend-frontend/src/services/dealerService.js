import axiosInstance from './axiosInstance'

export const dealerService = {
  getAll: () => axiosInstance.get('/dealer'),
  getById: (id) => axiosInstance.get(`/dealer/${id}`),

  // Admin/general lookups
  getInventory: (dealerId) => axiosInstance.get(`/dealer/${dealerId}/inventory`),
  updateStock: (payload) => axiosInstance.put('/dealer/inventory', payload),

  // Self-service — acts on the authenticated dealer's own inventory
  myInventory: () => axiosInstance.get('/dealer/my-inventory'),
  addProduct: (payload) => axiosInstance.post('/dealer/inventory/products', payload),
  updateOwnStock: (productId, stockQuantity) =>
    axiosInstance.put(`/dealer/inventory/${productId}/stock`, { stockQuantity }),
  removeProduct: (productId) => axiosInstance.delete(`/dealer/inventory/${productId}`),

  
  uploadImage(formData) {
    return axiosInstance.post(
        "/image/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
},
}
