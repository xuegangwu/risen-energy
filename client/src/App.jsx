import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PackageList from './pages/PackageList';
import PackageDetail from './pages/PackageDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import GroupList from './pages/GroupList';
import About from './pages/About';
import Showcase from './pages/Showcase';
import ROICalculator from './pages/ROICalculator';
import Payment from './pages/Payment';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPackages from './pages/admin/AdminPackages';
import AdminOrders from './pages/admin/AdminOrders';
import AdminShowcase from './pages/admin/AdminShowcase';
import AdminSolutions from './pages/admin/AdminSolutions';
import AdminUsers from './pages/admin/AdminUsers';
import { useAuthStore } from './stores/authStore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const storedUser = localStorage.getItem('user');
  const userData = storedUser ? JSON.parse(storedUser) : null;
  return userData?.role === 'admin' ? children : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="packages" element={<PackageList />} />
        <Route path="packages/:id" element={<PackageDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="groups" element={<GroupList />} />
        <Route path="about" element={<About />} />
        <Route path="showcase" element={<Showcase />} />
        <Route path="roi" element={<ROICalculator />} />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="payment/:id" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="solutions" element={<AdminSolutions />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="showcase" element={<AdminShowcase />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
