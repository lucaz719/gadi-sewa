
// Database Service for GadiSewa - Connecting to Python Backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const db = {
  // Helpers
  async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) {
      let errorMessage = `Error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch { }
      throw new Error(errorMessage);
    }
    return response.json();
  },


  // Auth
  login: async (credentials: any) => {
    const data = await db.fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    localStorage.setItem('gadisewa_auth_token', data.access_token);
    localStorage.setItem('gadisewa_auth_user', JSON.stringify(data.user));
    return data;
  },
  logout: () => {
    localStorage.removeItem('gadisewa_auth_user');
    localStorage.removeItem('gadisewa_auth_token');
  },
  getAuthUser: () => JSON.parse(localStorage.getItem('gadisewa_auth_user') || 'null'),
  getAuthToken: () => localStorage.getItem('gadisewa_auth_token'),

  // Plans (Static for now or fetch from backend)
  getPlans: async () => [
    { id: 'PLAN-FREE', name: 'Free Tier', price: 0, features: ['3 Jobs/mo', '1 Staff'], duration: 'Lifetime' },
    { id: 'PLAN-PRO', name: 'Garage Pro', price: 2999, features: ['Unlimited Jobs', '5 Staff', 'Marketplace'], duration: 'Monthly' }
  ],

  // Enterprises
  getEnterprises: async () => db.fetchApi('/admin/enterprises'),
  getPendingRegistrations: async () => {
    const ents = await db.getEnterprises();
    return ents.filter((e: any) => e.status === 'Pending');
  },
  approveRegistration: async (id: number | string) => db.fetchApi(`/admin/enterprises/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Active' })
  }),
  rejectRegistration: async (id: number | string) => db.fetchApi(`/admin/enterprises/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Rejected' })
  }),
  saveEnterprise: async (ent: any) => db.fetchApi('/admin/enterprises', {
    method: 'POST',
    body: JSON.stringify(ent)
  }),

  // Inventory
  getInventory: async () => db.fetchApi('/inventory'),
  saveInventoryItem: async (item: any) => db.fetchApi('/inventory', {
    method: 'POST',
    body: JSON.stringify(item)
  }),
  deleteInventoryItem: async (id: number | string) => db.fetchApi(`/inventory/${id}`, {
    method: 'DELETE'
  }),
  updateStock: async (skuOrName: string, change: number) => db.fetchApi('/inventory/update-stock', {
    method: 'POST',
    body: JSON.stringify({ skuOrName, change })
  }),

  // Jobs
  getJobs: async () => db.fetchApi('/jobs'),
  saveJob: async (job: any) => db.fetchApi('/jobs', {
    method: 'POST',
    body: JSON.stringify(job)
  }),
  updateJob: async (id: number, data: any) => db.fetchApi(`/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Transactions & Financials
  getTransactions: async (entId?: number) => {
    const query = entId ? `?enterprise_id=${entId}` : '';
    return db.fetchApi(`/financials/transactions${query}`);
  },
  getFinancialSummary: async (entId?: number) => {
    const query = entId ? `?enterprise_id=${entId}` : '';
    return db.fetchApi(`/financials/summary${query}`);
  },
  logTransaction: async (txn: any) => db.fetchApi('/financials/transactions', {
    method: 'POST',
    body: JSON.stringify(txn)
  }),

  // Held Carts
  getHeldCarts: async () => db.fetchApi('/pos/held-carts'),
  holdCart: async (cartData: any) => db.fetchApi('/pos/held-carts', {
    method: 'POST',
    body: JSON.stringify(cartData)
  }),
  removeHeldCart: async (id: number | string) => db.fetchApi(`/pos/held-carts/${id}`, {
    method: 'DELETE'
  }),

  // Admin Ops
  getUsers: async () => db.fetchApi('/admin/users'),
  toggleUserActive: async (id: number) => db.fetchApi(`/admin/users/${id}/toggle-active`, { method: 'PATCH' }),
  resetUserPassword: async (id: number, password?: string) => db.fetchApi(`/admin/users/${id}/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify({ password })
  }),
  getVouchers: async () => db.fetchApi('/admin/vouchers'),
  saveVoucher: async (v: any) => db.fetchApi('/admin/vouchers', {
    method: 'POST',
    body: JSON.stringify(v)
  }),
  toggleVoucher: async (id: number) => db.fetchApi(`/admin/vouchers/${id}/toggle-active`, { method: 'PATCH' }),

  // Global Catalog
  getGlobalCatalog: async () => db.fetchApi('/admin/global-catalog'),
  saveGlobalCatalog: async (items: any[]) => db.fetchApi('/admin/global-catalog', {
    method: 'POST',
    body: JSON.stringify(items)
  }),

  // Gamification
  getRewardsSummary: async (userId: number) => db.fetchApi(`/gamification/summary/${userId}`),
  generateReferral: async (userId: number) => db.fetchApi(`/gamification/referral/generate/${userId}`, { method: 'POST' }),
  addPoints: async (userId: number, points: number, action: string) => db.fetchApi('/gamification/points/add', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, points, action })
  }),

  // AI Assistant
  chatWithAi: async (message: string, role: string, path: string) => db.fetchApi('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, user_role: role, current_path: path })
  }),

  // Reports & Analytics
  getFinancialTrends: async (enterpriseId?: number) => db.fetchApi(`/reports/financial-trends${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  getJobAnalytics: async (enterpriseId?: number) => db.fetchApi(`/reports/job-analytics${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  getInventoryValuation: async () => db.fetchApi('/reports/inventory-valuation'),
  getCustomerInsights: async () => db.fetchApi('/reports/customer-insights'),

  // CRM
  getCRMSummary: async (enterpriseId?: number) => db.fetchApi(`/crm/summary${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  getFollowUps: async (enterpriseId?: number) => db.fetchApi(`/crm/followups${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  updateCRMSettings: async (settings: any) => db.fetchApi('/crm/settings', {
    method: 'POST',
    body: JSON.stringify(settings)
  }),

  // Initialization (No-op as backend handles it)
  init: () => {
    console.log("Connected to GadiSewa Backend");
  }
};
