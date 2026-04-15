
// Database Service for GadiSewa - Connecting to Python Backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const db = {
  // Helpers
  async fetchApi(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('gadisewa_auth_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  // Plans
  getPlans: async () => db.fetchApi('/admin/plans'),
  savePlan: async (plan: any) => db.fetchApi('/admin/plans', {
    method: 'POST',
    body: JSON.stringify(plan)
  }),
  deletePlan: async (id: string) => db.fetchApi(`/admin/plans/${id}`, {
    method: 'DELETE'
  }),
  updateEnterprisePlan: async (entId: number | string, planId: string) => db.fetchApi(`/admin/enterprises/${entId}/plan`, {
    method: 'PATCH',
    body: JSON.stringify({ plan_id: planId })
  }),

  // Enterprises
  getEnterprises: async () => db.fetchApi('/admin/enterprises'),
  getPendingRegistrations: async () => db.fetchApi('/admin/pending-registrations'),
  approveRegistration: async (id: number | string) => db.fetchApi(`/admin/registrations/${id}/approve`, {
    method: 'POST'
  }),
  rejectRegistration: async (id: number | string) => db.fetchApi(`/admin/registrations/${id}/reject`, {
    method: 'POST'
  }),
  saveEnterprise: async (ent: any) => db.fetchApi('/admin/enterprises', {
    method: 'POST',
    body: JSON.stringify(ent)
  }),
  registerInterest: async (ent: any) => db.fetchApi('/admin/register-interest', {
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
  deleteJob: async (id: number) => db.fetchApi(`/jobs/${id}`, { method: 'DELETE' }),

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
  getActivityLogs: async () => db.fetchApi('/admin/logs'),

  // Admin Stats & Analytics
  getAdminStats: async () => db.fetchApi('/admin/stats'),
  getGrowthData: async () => db.fetchApi('/admin/growth-data'),
  getRevenueAnalytics: async () => db.fetchApi('/admin/revenue-analytics'),

  // Enterprise Detail
  getEnterpriseDetail: async (id: number | string) => db.fetchApi(`/admin/enterprises/${id}/detail`),

  // Platform Settings
  getAdminSettings: async () => db.fetchApi('/admin/settings'),
  saveAdminSettings: async (settings: any) => db.fetchApi('/admin/settings', {
    method: 'POST',
    body: JSON.stringify(settings)
  }),

  // Notifications
  getNotifications: async () => db.fetchApi('/admin/notifications'),
  createNotification: async (notif: any) => db.fetchApi('/admin/notifications', {
    method: 'POST',
    body: JSON.stringify(notif)
  }),
  markNotificationRead: async (id: number) => db.fetchApi(`/admin/notifications/${id}/read`, { method: 'PATCH' }),


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
  executeAiAction: async (action: string, params: Record<string, any> = {}, userRole: string = 'garage') => db.fetchApi('/ai/execute-action', {
    method: 'POST',
    body: JSON.stringify({ action, params, user_role: userRole })
  }),

  // Reports & Analytics
  getFinancialTrends: async (enterpriseId?: number) => db.fetchApi(`/reports/financial-trends${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  getJobAnalytics: async (enterpriseId?: number) => db.fetchApi(`/reports/job-analytics${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  getInventoryValuation: async () => db.fetchApi('/reports/inventory-valuation'),
  getCustomerInsights: async () => db.fetchApi('/reports/customer-insights'),

  // CRM
  getCustomers: async (enterpriseId?: number) => db.fetchApi(`/crm/customers${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  saveCustomer: async (customer: any) => db.fetchApi('/crm/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  }),
  getCRMSummary: async (enterpriseId?: number) => db.fetchApi(`/crm/summary${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  getFollowUps: async (enterpriseId?: number) => db.fetchApi(`/crm/followups${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  updateCRMSettings: async (settings: any) => db.fetchApi('/crm/settings', {
    method: 'POST',
    body: JSON.stringify(settings)
  }),

  // Phase 2: Operational & Commercial Integration
  getStaff: async (enterpriseId: number) => db.fetchApi(`/staff/?enterprise_id=${enterpriseId}`),
  saveStaff: async (staff: any, enterpriseId: number) => db.fetchApi(`/staff/?enterprise_id=${enterpriseId}`, {
    method: 'POST',
    body: JSON.stringify(staff)
  }),
  updateStaff: async (id: number, data: any) => db.fetchApi(`/staff/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteStaff: async (id: number) => db.fetchApi(`/staff/${id}`, { method: 'DELETE' }),

  getAppointments: async (enterpriseId: number) => db.fetchApi(`/appointments/?enterprise_id=${enterpriseId}`),
  saveAppointment: async (app: any, enterpriseId: number) => db.fetchApi(`/appointments/?enterprise_id=${enterpriseId}`, {
    method: 'POST',
    body: JSON.stringify(app)
  }),
  updateAppointmentStatus: async (id: number, status: string) => db.fetchApi(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  deleteAppointment: async (id: number) => db.fetchApi(`/appointments/${id}`, { method: 'DELETE' }),

  getSupportTickets: async (enterpriseId?: number) => db.fetchApi(`/support/tickets${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  saveSupportTicket: async (ticket: any, enterpriseId: number) => db.fetchApi(`/support/tickets?enterprise_id=${enterpriseId}`, {
    method: 'POST',
    body: JSON.stringify(ticket)
  }),
  updateTicketStatus: async (id: number, status: string) => db.fetchApi(`/support/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  getEnterpriseInvoices: async (enterpriseId?: number) => db.fetchApi(`/billing/invoices${enterpriseId ? `?enterprise_id=${enterpriseId}` : ''}`),
  generateEnterpriseInvoice: async (enterpriseId: number) => db.fetchApi(`/billing/generate-invoice?enterprise_id=${enterpriseId}`, {
    method: 'POST'
  }),

  // Phase 3: Marketplace Interoperability
  getMarketplaceProducts: async () => db.fetchApi('/marketplace/products'),
  getVendorProducts: async (vendorId: number) => db.fetchApi(`/marketplace/vendor/${vendorId}/products`),
  saveVendorProduct: async (product: any, vendorId: number) => db.fetchApi(`/marketplace/vendor/${vendorId}/products`, {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  placeMarketplaceOrder: async (order: any, garageId: number) => db.fetchApi(`/marketplace/orders?garage_id=${garageId}`, {
    method: 'POST',
    body: JSON.stringify(order)
  }),
  getVendorOrders: async (vendorId: number) => db.fetchApi(`/marketplace/vendor/${vendorId}/orders`),
  updateVendorOrderStatus: async (id: number, status: string, paymentStatus?: string) => db.fetchApi(`/marketplace/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, payment_status: paymentStatus })
  }),

  // Initialization (No-op as backend handles it)
  init: () => {
    console.log("Connected to GadiSewa Backend");
  }
};
