import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // incluye cookies HttpOnly automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests simultaneously
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de respuesta para manejar 401 globalmente e intentar refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es la ruta de login o refresh, intentamos refrescar el token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Falló el refresh token (expiro o invalido), forzar login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Si sigue fallando y estamos en el cliente, redirigir a login
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      originalRequest.url !== '/auth/login'
    ) {
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
  // Google Auth initiation is done via window.location.href to the backend
  getGoogleAuthUrl: () => `${API_URL}/auth/google`,
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
  getAll: (page = 1, limit = 10, search?: string) =>
    api.get('/clients', { params: { page, limit, search } }).then((r) => r.data),
  getOne: (id: string) => api.get(`/clients/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/clients', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/clients/${id}`, data).then((r) => r.data),
  deactivate: (id: string) => api.delete(`/clients/${id}`).then((r) => r.data),
};

// ─── Quotes ───────────────────────────────────────────────────────────────────
export const quotesApi = {
  getAll: (page = 1, limit = 10, search?: string) => 
    api.get('/quotes', { params: { page, limit, search } }).then((r) => r.data),
  getOne: (id: string) => api.get(`/quotes/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/quotes', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/quotes/${id}`, data).then((r) => r.data),
  getPdfUrl: (id: string) => `${API_URL}/quotes/${id}/pdf`,
  getTechnicalPdfUrl: (id: string) => `${API_URL}/quotes/${id}/technical-pdf`,
  getTechnicalExcelUrl: (id: string) => `${API_URL}/quotes/${id}/technical-excel`,
};

// ─── Equipment ────────────────────────────────────────────────────────────────
export const equipmentApi = {
  getAll: (page = 1, limit = 10, search?: string) =>
    api.get('/equipment', { params: { page, limit, search } }).then((r) => r.data),
  getOne: (id: string) => api.get(`/equipment/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/equipment', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/equipment/${id}`, data).then((r) => r.data),
};

export const workOrdersApi = {
  getAll: (page = 1, limit = 10, search?: string) =>
    api.get('/work-orders', { params: { page, limit, search } }).then((r) => r.data),
  getOne: (id: string) => api.get(`/work-orders/${id}`).then((r) => r.data),
  getItemHistory: (itemId: string) => api.get(`/work-orders/items/${itemId}/history`).then((r) => r.data),
  getItemStickerData: (itemId: string) => api.get(`/work-orders/items/${itemId}/sticker`).then((r) => r.data),
  getStats: () => api.get('/work-orders/stats').then((r) => r.data),
  create: (data: any) => api.post('/work-orders', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/work-orders/${id}`, data).then((r) => r.data),
  changeItemStatus: (itemId: string, data: any) =>
    api.patch(`/work-orders/items/${itemId}/status`, data).then((r) => r.data),
  getPdfUrl: (id: string) => `${API_URL}/work-orders/${id}/pdf`,
  getExcelUrl: (id: string) => `${API_URL}/work-orders/${id}/excel`,
};

// ─── Email Requests ───────────────────────────────────────────────────────────
export const settingsApi = {
  getAll: () => api.get('/settings').then((r) => r.data),
  update: (key: string, value: string, description?: string) => 
    api.put('/settings', { key, value, description }).then((r) => r.data),
};

export const requisitionsApi = {
  getAll: (page = 1, limit = 10, search?: string) => 
    api.get('/requisitions', { params: { page, limit, search } }).then((r) => r.data),
  getById: (id: string) => api.get(`/requisitions/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/requisitions', data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/requisitions/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/requisitions/${id}`).then((r) => r.data),
  getPdfUrl: (id: string) => `${API_URL}/requisitions/${id}/pdf`,
  getExcelUrl: (id: string) => `${API_URL}/requisitions/${id}/excel`,
};

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
  getAll: (limit: number = 100) => api.get(`/activity-logs?limit=${limit}`).then(res => res.data),
};

export const dashboardApi = {
  getKpis: () => api.get('/dashboard/kpis').then(res => res.data),
  getQuotesByStatus: () => api.get('/dashboard/quotes-by-status').then(res => res.data),
  getRevenueTimeline: (period: string) => api.get(`/dashboard/revenue?period=${period}`).then(res => res.data),
  getAdvancedMetrics: () => api.get('/dashboard/advanced-metrics').then(res => res.data),
  getAlerts: () => api.get('/dashboard/alerts').then(res => res.data),
  exportDashboard: () => api.get('/dashboard/export', { responseType: 'blob' }).then(res => res.data),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  getRecent: () => api.get('/notifications').then(res => res.data),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`).then(res => res.data),
};

// ─── Excel Import/Export ──────────────────────────────────────────────────────
export const excelApi = {
  downloadExcel: async (url: string, filename: string) => {
    const response = await api.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  },
  uploadExcel: async (url: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
