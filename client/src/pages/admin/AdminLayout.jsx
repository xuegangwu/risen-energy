import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/admin/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const menus = [
    { id: 'dashboard', label: '数据概览', icon: '📊', path: '/admin' },
    { id: 'solutions', label: '方案管理', icon: '💡', path: '/admin/solutions' },
    { id: 'packages', label: '套餐管理', icon: '📦', path: '/admin/packages' },
    { id: 'orders', label: '订单管理', icon: '📋', path: '/admin/orders' },
    { id: 'showcase', label: '案例管理', icon: '🏗️', path: '/admin/showcase' },
    { id: 'users', label: '用户管理', icon: '👥', path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-energy-600">⚙️ 管理后台</h1>
          <p className="text-xs text-gray-500">储能智选商城</p>
        </div>
        
        <nav className="flex-1 p-4">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => navigate(menu.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition ${
                activeMenu === menu.id
                  ? 'bg-energy-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{menu.icon}</span>
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-energy-100 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <div className="font-medium text-sm">{user?.username || '管理员'}</div>
              <div className="text-xs text-gray-500">管理员</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
          >
            退出登录
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {menus.find(m => m.id === activeMenu)?.label || '数据概览'}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-energy-600"
            >
              查看商城 →
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
