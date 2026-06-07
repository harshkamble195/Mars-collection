const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth & Wishlist
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    register: async (name, email, password) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
    getWishlist: async () => {
      const res = await fetch(`${BASE_URL}/auth/wishlist`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    addToWishlist: async (productId) => {
      const res = await fetch(`${BASE_URL}/auth/wishlist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId }),
      });
      return handleResponse(res);
    },
    removeFromWishlist: async (productId) => {
      const res = await fetch(`${BASE_URL}/auth/wishlist/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Products
  products: {
    list: async (params = {}) => {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key]) query.append(key, params[key]);
      });
      const res = await fetch(`${BASE_URL}/products?${query.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    suggestions: async (keyword) => {
      const res = await fetch(`${BASE_URL}/products/suggestions?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    details: async (id) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (productData) => {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
      return handleResponse(res);
    },
    update: async (id, productData) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    review: async (productId, reviewData) => {
      const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });
      return handleResponse(res);
    },
  },

  // Orders
  orders: {
    create: async (orderData) => {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      return handleResponse(res);
    },
    details: async (id) => {
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    myOrders: async () => {
      const res = await fetch(`${BASE_URL}/orders/myorders`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    listAll: async () => {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, statusData) => {
      const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(statusData),
      });
      return handleResponse(res);
    },
    getAnalytics: async () => {
      const res = await fetch(`${BASE_URL}/orders/analytics`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
