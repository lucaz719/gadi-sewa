
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import JobList from './pages/JobList';
import CreateJob from './pages/CreateJob';
import JobDetails from './pages/JobDetails';
import Inventory from './pages/Inventory';
import Marketplace from './pages/Marketplace';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import Staff from './pages/Staff';
import Financials from './pages/Financials';
import Expenses from './pages/Expenses';
import Invoices from './pages/Invoices';
import CashFlow from './pages/CashFlow';
import POS from './pages/POS';
import Registration from './pages/Registration';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Appointments from './pages/Appointments';
import Marketing from './pages/Marketing';
import Subscription from './pages/Subscription';
import HelpSupport from './pages/HelpSupport';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import GlobalCatalog from './pages/admin/GlobalCatalog';
import UserManagement from './pages/admin/UserManagement';
import ActivityLogs from './pages/admin/ActivityLogs';
import PlanManagement from './pages/admin/PlanManagement';
import AdminSettings from './pages/admin/AdminSettings';
import VoucherManagement from './pages/admin/VoucherManagement';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSupport from './pages/admin/AdminSupport';
import EnterpriseDetail from './pages/admin/EnterpriseDetail';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorProductEdit from './pages/vendor/VendorProductEdit';
import VendorBulkImport from './pages/vendor/VendorBulkImport';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorOrderDetail from './pages/vendor/VendorOrderDetail';
import VendorNetwork from './pages/vendor/VendorNetwork';
import VendorGarageProfile from './pages/vendor/VendorGarageProfile';
import VendorFinancials from './pages/vendor/VendorFinancials';
import VendorMarketing from './pages/vendor/VendorMarketing';
import VendorSettings from './pages/vendor/VendorSettings';
import VendorPOS from './pages/vendor/VendorPOS';
import VendorCashFlow from './pages/vendor/VendorCashFlow';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyVehicles from './pages/customer/MyVehicles';
import BookService from './pages/customer/BookService';
import ServiceHistory from './pages/customer/ServiceHistory';
import FuelLog from './pages/customer/FuelLog';
import OffersRewards from './pages/customer/OffersRewards';
import EmergencySOS from './pages/customer/EmergencySOS';
import RewardsHub from './pages/RewardsHub';

import AiAssistantWidget from './components/AiAssistantWidget';
import AiAutomation from './pages/AiAutomation';

import { db } from './services/db';

// --- Theme Context ---
const ThemeContext = createContext({ isDark: false, toggleTheme: () => { } });

// --- Toast Context ---
interface ToastMsg { id: number; type: 'success' | 'error' | 'info'; message: string; }
const ToastContext = createContext({ showToast: (type: 'success' | 'error' | 'info', message: string) => { } });

export const useToast = () => useContext(ToastContext);

const SidebarItem = ({ icon, label, path, active }: { icon: string, label: string, path: string, active: boolean }) => (
  <Link to={path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-primary-500/10 text-primary-600 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </Link>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = db.getAuthToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useToast();

  const isPOS = path === '/pos' || path === '/vendor/pos';
  const isRegistration = path === '/register';
  const isLogin = path === '/login' || path === '/admin-portal';
  const isVendor = path.startsWith('/vendor');
  const isCustomer = path.startsWith('/portal');
  const isAdmin = path.startsWith('/admin');

  useEffect(() => {
    db.init();
  }, []);

  const handleLogout = () => {
    db.logout();
    showToast('info', 'Logged out successfully');
    navigate('/login');
  };

  if (isPOS || isRegistration || isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#101a22] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16222d] flex flex-col transition-colors duration-200">
        <div className="p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl ${isVendor ? 'bg-purple-600' : isCustomer ? 'bg-orange-500' : isAdmin ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-primary-500'}`}>
            {isVendor ? 'V' : isCustomer ? 'C' : isAdmin ? 'A' : 'G'}
          </div>
          <div>
            <h1 className="font-bold text-base">GadiSewa</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isVendor ? 'Vendor Portal' : isCustomer ? 'Vehicle Owner' : isAdmin ? 'Administrator' : 'Main Garage'}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {isAdmin ? (
            <>
              <SidebarItem icon="dashboard" label="Admin Home" path="/admin" active={path === '/admin'} />
              <SidebarItem icon="bar_chart" label="Revenue" path="/admin/revenue" active={path === '/admin/revenue'} />
              <SidebarItem icon="inventory" label="Global Catalog" path="/admin/global-catalog" active={path === '/admin/global-catalog'} />
              <SidebarItem icon="confirmation_number" label="Voucher Center" path="/admin/vouchers" active={path === '/admin/vouchers'} />
              <SidebarItem icon="payments" label="Plan Mgmt" path="/admin/plans" active={path === '/admin/plans'} />
              <SidebarItem icon="group" label="Enterprise Users" path="/admin/users" active={path === '/admin/users'} />
              <SidebarItem icon="campaign" label="Notifications" path="/admin/notifications" active={path === '/admin/notifications'} />
              <SidebarItem icon="support_agent" label="Support Hub" path="/admin/support" active={path === '/admin/support'} />
              <SidebarItem icon="history" label="System Logs" path="/admin/logs" active={path === '/admin/logs'} />
            </>
          ) : isCustomer ? (
            <>
              <SidebarItem icon="dashboard" label="Overview" path="/portal" active={path === '/portal'} />
              <SidebarItem icon="directions_car" label="My Vehicles" path="/portal/vehicles" active={path === '/portal/vehicles'} />
              <SidebarItem icon="calendar_add_on" label="Book Service" path="/portal/book" active={path === '/portal/book'} />
              <SidebarItem icon="history" label="Service History" path="/portal/history" active={path === '/portal/history'} />
              <SidebarItem icon="local_gas_station" label="Fuel Log" path="/portal/fuel" active={path === '/portal/fuel'} />
              <SidebarItem icon="confirmation_number" label="Offers & Rewards" path="/portal/offers" active={path === '/portal/offers'} />
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link to="/portal/sos" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                  <span className="material-symbols-outlined filled">sos</span>
                  <span className="text-sm">Emergency SOS</span>
                </Link>
              </div>
            </>
          ) : isVendor ? (
            <>
              <SidebarItem icon="dashboard" label="Dashboard" path="/vendor" active={path === '/vendor'} />
              <SidebarItem icon="point_of_sale" label="Vendor POS" path="/vendor/pos" active={false} />
              <SidebarItem icon="inventory_2" label="Product Catalog" path="/vendor/products" active={path.startsWith('/vendor/products')} />
              <SidebarItem icon="shopping_cart" label="Orders" path="/vendor/orders" active={path.startsWith('/vendor/orders')} />
              <SidebarItem icon="store" label="Garage Network" path="/vendor/network" active={path.startsWith('/vendor/network')} />
              <SidebarItem icon="account_balance_wallet" label="Cash Flow & Budget" path="/vendor/cash-flow" active={path === '/vendor/cash-flow'} />
              <SidebarItem icon="payments" label="Financials" path="/vendor/financials" active={path === '/vendor/financials'} />
              <SidebarItem icon="campaign" label="Marketing" path="/vendor/marketing" active={path === '/vendor/marketing'} />
              <SidebarItem icon="settings_suggest" label="Subscription" path="/subscription" active={path === '/subscription'} />
            </>
          ) : (
            <>
              <SidebarItem icon="dashboard" label="Dashboard" path="/" active={path === '/'} />
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Operations</div>
              <SidebarItem icon="calendar_month" label="Job Board" path="/jobs" active={path === '/jobs' || path === '/jobs/new' || path === '/jobs/list'} />
              <SidebarItem icon="schedule" label="Appointments" path="/appointments" active={path === '/appointments'} />
              <SidebarItem icon="point_of_sale" label="POS" path="/pos" active={false} />
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Procurement</div>
              <SidebarItem icon="storefront" label="Marketplace" path="/marketplace" active={path === '/marketplace'} />
              <SidebarItem icon="inventory_2" label="My Inventory" path="/inventory" active={path === '/inventory'} />
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Management</div>
              <SidebarItem icon="group" label="Customers" path="/customers" active={path.startsWith('/customers')} />
              <SidebarItem icon="badge" label="Staff & HR" path="/staff" active={path === '/staff'} />
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Finance & Growth</div>
              <SidebarItem icon="account_balance_wallet" label="Cash Flow & Budget" path="/cash-flow" active={path === '/cash-flow'} />
              <SidebarItem icon="attach_money" label="Income" path="/financials" active={path === '/financials'} />
              <SidebarItem icon="money_off" label="Expenses" path="/expenses" active={path === '/expenses'} />
              <SidebarItem icon="receipt" label="Invoices" path="/invoices" active={path === '/invoices'} />
              <SidebarItem icon="bar_chart" label="Reports" path="/reports" active={path === '/reports'} />
              <SidebarItem icon="auto_awesome" label="AI & Automation" path="/ai-automation" active={path === '/ai-automation'} />
              <SidebarItem icon="settings_suggest" label="Subscription" path="/subscription" active={path === '/subscription'} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <SidebarItem
            icon="settings"
            label="Settings"
            path={isAdmin ? "/admin/settings" : isVendor ? "/vendor/settings" : "/settings"}
            active={path.includes('/settings')}
          />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-2"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16222d] flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-200">
          <h2 className="text-xl font-bold capitalize">
            {path === '/' ? 'Dashboard' :
              path === '/admin' ? 'Admin Center' :
                path === '/portal' ? 'My Garage' :
                  path.split('/').pop()?.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div onClick={() => navigate(isAdmin ? '/admin/settings' : isVendor ? '/vendor/settings' : '/profile')} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border cursor-pointer hover:opacity-80 transition-opacity ${isVendor ? 'bg-purple-100 text-purple-600 border-purple-200' : isCustomer ? 'bg-orange-100 text-orange-600 border-orange-200' : isAdmin ? 'bg-red-100 text-red-600 border-red-200' : 'bg-indigo-100 text-indigo-600 border-indigo-200'}`} title="Settings">
              {isVendor ? 'VP' : isCustomer ? 'JD' : isAdmin ? 'AD' : 'AG'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#101a22] transition-colors duration-200">
          {children}
        </main>
        <AiAssistantWidget />
      </div>
    </div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ToastContext.Provider value={{ showToast }}>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-portal" element={<AdminLogin />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/help" element={<HelpSupport />} />

              {/* Protected Routes */}
              <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/jobs/list" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
              <Route path="/jobs/new" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
              <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/customers/:id" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
              <Route path="/cash-flow" element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
              <Route path="/financials" element={<ProtectedRoute><Financials /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/ai-automation" element={<ProtectedRoute><AiAutomation /></ProtectedRoute>} />

              {/* Admin Pages */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/global-catalog" element={<ProtectedRoute><GlobalCatalog /></ProtectedRoute>} />
              <Route path="/admin/plans" element={<ProtectedRoute><PlanManagement /></ProtectedRoute>} />
              <Route path="/admin/vouchers" element={<ProtectedRoute><VoucherManagement /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/revenue" element={<ProtectedRoute><AdminRevenue /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
              <Route path="/admin/support" element={<ProtectedRoute><AdminSupport /></ProtectedRoute>} />
              <Route path="/admin/enterprises/:id" element={<ProtectedRoute><EnterpriseDetail /></ProtectedRoute>} />

              {/* Vendor Pages */}
              <Route path="/vendor/products" element={<ProtectedRoute><VendorProducts /></ProtectedRoute>} />
              <Route path="/vendor/products/new" element={<ProtectedRoute><VendorProductEdit /></ProtectedRoute>} />
              <Route path="/vendor/products/edit/:id" element={<ProtectedRoute><VendorProductEdit /></ProtectedRoute>} />
              <Route path="/vendor/products/bulk-import" element={<ProtectedRoute><VendorBulkImport /></ProtectedRoute>} />
              <Route path="/vendor/orders" element={<ProtectedRoute><VendorOrders /></ProtectedRoute>} />
              <Route path="/vendor/orders/:id" element={<ProtectedRoute><VendorOrderDetail /></ProtectedRoute>} />
              <Route path="/vendor/network" element={<ProtectedRoute><VendorNetwork /></ProtectedRoute>} />
              <Route path="/vendor/network/:id" element={<ProtectedRoute><VendorGarageProfile /></ProtectedRoute>} />
              <Route path="/vendor/financials" element={<ProtectedRoute><VendorFinancials /></ProtectedRoute>} />
              <Route path="/vendor/marketing" element={<ProtectedRoute><VendorMarketing /></ProtectedRoute>} />
              <Route path="/vendor/settings" element={<ProtectedRoute><VendorSettings /></ProtectedRoute>} />
              <Route path="/vendor/pos" element={<ProtectedRoute><VendorPOS /></ProtectedRoute>} />
              <Route path="/vendor/cash-flow" element={<ProtectedRoute><VendorCashFlow /></ProtectedRoute>} />
              <Route path="/vendor" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />

              {/* Customer Pages */}
              <Route path="/portal" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/portal/vehicles" element={<ProtectedRoute><MyVehicles /></ProtectedRoute>} />
              <Route path="/portal/book" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
              <Route path="/portal/history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
              <Route path="/portal/fuel" element={<ProtectedRoute><FuelLog /></ProtectedRoute>} />
              <Route path="/portal/offers" element={<ProtectedRoute><RewardsHub /></ProtectedRoute>} />
              <Route path="/portal/sos" element={<ProtectedRoute><EmergencySOS /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
              {toasts.map(toast => (
                <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-slide-in ${toast.type === 'success' ? 'bg-white dark:bg-slate-800 border-green-500 text-green-600' :
                  toast.type === 'error' ? 'bg-white dark:bg-slate-800 border-red-500 text-red-600' :
                    'bg-white dark:bg-slate-800 border-blue-500 text-blue-600'
                  }`}>
                  <span className="material-symbols-outlined text-lg">
                    {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">{toast.message}</span>
                </div>
              ))}
            </div>
          </Layout>
        </HashRouter>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}
