import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // incluye cookies HttpOnly automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta para manejar 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get('/users').then((r) => r.data),
  create: (data: any) => api.post('/users', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data).then((r) => r.data),
  deactivate: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};

// ─── Clients ──────────────────────────────────────────────────────────────────
export const clientsApi = {
  getAll: (search?: string) =>
    api.get('/clients', { params: search ? { search } : {} }).then((r) => r.data),
  getOne: (id: string) => api.get(`/clients/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/clients', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/clients/${id}`, data).then((r) => r.data),
  deactivate: (id: string) => api.delete(`/clients/${id}`).then((r) => r.data),
};

// ─── Quotes ───────────────────────────────────────────────────────────────────
export const quotesApi = {
  getAll: () => api.get('/quotes').then((r) => r.data),
  getOne: (id: string) => api.get(`/quotes/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/quotes', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/quotes/${id}`, data).then((r) => r.data),
  getPdfUrl: (id: string) => `${API_URL}/quotes/${id}/pdf`,
};

// ─── Equipment ────────────────────────────────────────────────────────────────
export const equipmentApi = {
  getAll: (search?: string) =>
    api.get('/equipment', { params: search ? { search } : {} }).then((r) => r.data),
  getOne: (id: string) => api.get(`/equipment/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/equipment', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/equipment/${id}`, data).then((r) => r.data),
};

// ─── Work Orders ──────────────────────────────────────────────────────────────
export const workOrdersApi = {
  getAll: (status?: string) =>
    api.get('/work-orders', { params: status ? { status } : {} }).then((r) => r.data),
  getOne: (id: string) => api.get(`/work-orders/${id}`).then((r) => r.data),
  getHistory: (id: string) => api.get(`/work-orders/${id}/history`).then((r) => r.data),
  getStickerData: (id: string) => api.get(`/work-orders/${id}/sticker`).then((r) => r.data),
  getStats: () => api.get('/work-orders/stats').then((r) => r.data),
  create: (data: any) => api.post('/work-orders', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/work-orders/${id}`, data).then((r) => r.data),
  changeStatus: (id: string, data: any) =>
    api.patch(`/work-orders/${id}/status`, data).then((r) => r.data),
};

// ─── Email Requests ───────────────────────────────────────────────────────────
export const emailRequestsApi = {
  getAll: () => api.get('/email-requests').then((r) => r.data),
  create: (rawContent: string) =>
    api.post('/email-requests', { rawContent }).then((r) => r.data),
  process: (id: string, clientId?: string) =>
    api.patch(`/email-requests/${id}/process`, { clientId }).then((r) => r.data),
  discard: (id: string) =>
    api.patch(`/email-requests/${id}/discard`, {}).then((r) => r.data),
};

// ─── Activity Logs ────────────────────────────────────────────────────────────
export const activityLogsApi = {
  getAll: (limit?: number) =>
    api.get('/activity-logs', { params: { limit } }).then((r) => r.data),
};
