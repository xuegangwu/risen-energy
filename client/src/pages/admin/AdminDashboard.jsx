import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, packageAPI } from '../../api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    statusStats: {}
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [ordersRes, packagesRes] = await Promise.all([
        fetch('http://localhost:3000/api/admin/orders/stats', { headers }).then(r => r.json()),
        fetch('http://localhost:3000/api/admin/packages?limit=5', { headers }).then(r => r.json())
      ]);
      
      setStats(ordersRes);
      setPackages(packagesRes.packages || []);
      
      const recentRes = await fetch('http://localhost:3000/api/admin/orders?limit=5', { headers });
      const recentData = await recentRes.json();
      setRecentOrders(recentData.orders || []);
    } catch (err) {
      console.error('加载数据失败', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return '¥' + (amount / 10000).toFixed(1) + '万';
  };

  const statusMap = {
    pending: { text: '待付款', color: 'bg-yellow-100 text-yellow-800' },
    paid: { text: '已付款', color: 'bg-blue-100 text-blue-800' },
    processing: { text: '处理中', color: 'bg-purple-100 text-purple-800' },
    shipped: { text: '已发货', color: 'bg-indigo-100 text-indigo-800' },
    completed: { text: '已完成', color: 'bg-green-100 text-green-800' },
    cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-800' }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <div className="text-gray-500 text-sm">总订单数</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-energy-600">{formatMoney(stats.totalRevenue)}</div>
          <div className="text-gray-500 text-sm">总收入</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold">{stats.todayOrders}</div>
          <div className="text-gray-500 text-sm">今日订单</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-energy-600">{formatMoney(stats.todayRevenue)}</div>
          <div className="text-gray-500 text-sm">今日收入</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">📋 最近订单</h3>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-energy-600 hover:underline text-sm"
            >
              查看全部 →
            </button>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{order.orderNo}</div>
                    <div className="text-sm text-gray-500">{order.user?.username || '用户'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-energy-600">{formatMoney(order.totalAmount)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusMap[order.status]?.color || ''}`}>
                      {statusMap[order.status]?.text || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">暂无订单</div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">📦 套餐管理</h3>
            <button
              onClick={() => navigate('/admin/packages')}
              className="text-energy-600 hover:underline text-sm"
            >
              管理套餐 →
            </button>
          </div>
          {packages.length > 0 ? (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div key={pkg._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-gray-500">{pkg.capacity} / {pkg.power}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-energy-600">{formatMoney(pkg.groupPrice || pkg.basePrice)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${pkg.isHot ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {pkg.isHot ? '热门' : '普通'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">暂无套餐</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">📊 订单状态分布</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(stats.statusStats).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{count}</div>
              <div className={`text-sm ${statusMap[status]?.color || ''}`}>
                {statusMap[status]?.text || status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
