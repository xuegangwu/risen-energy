import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { orderAPI } from '../api';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    company: user?.company || ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.getList({ limit: 10 });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('加载订单失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      alert('更新成功');
    } catch (err) {
      alert('更新失败');
    }
  };

  const statusMap = {
    pending: { text: '待付款', color: 'bg-yellow-100 text-yellow-800' },
    paid: { text: '已付款', color: 'bg-blue-100 text-blue-800' },
    processing: { text: '处理中', color: 'bg-purple-100 text-purple-800' },
    shipped: { text: '已发货', color: 'bg-indigo-100 text-indigo-800' },
    completed: { text: '已完成', color: 'bg-green-100 text-green-800' },
    cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-800' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">个人中心</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-energy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="font-semibold text-lg">{user?.username}</h3>
              <p className="text-gray-500 text-sm">{user?.company || '个人用户'}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'orders' ? 'bg-energy-50 text-energy-600' : 'hover:bg-gray-50'
                }`}
              >
                我的订单
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'info' ? 'bg-energy-50 text-energy-600' : 'hover:bg-gray-50'
                }`}
              >
                个人信息
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">我的订单</h2>
              </div>
              
              {loading ? (
                <div className="p-6 text-center">加载中...</div>
              ) : orders.length > 0 ? (
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order._id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-medium">{order.orderNo}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          statusMap[order.status]?.color || 'bg-gray-100'
                        }`}>
                          {statusMap[order.status]?.text || order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>¥{item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-lg font-semibold">
                          合计: <span className="text-energy-600">¥{order.totalAmount.toLocaleString()}</span>
                        </div>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => navigate(`/payment/${order._id}`)}
                            className="px-4 py-2 bg-energy-500 text-white rounded-lg hover:bg-energy-600"
                          >
                            去付款
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  暂无订单
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">个人信息</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-energy-600 hover:underline"
                  >
                    编辑
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">用户名</label>
                  <div className="font-medium">{user?.username}</div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">手机号</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <div className="font-medium">{user?.phone || '未设置'}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">邮箱</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <div className="font-medium">{user?.email || '未设置'}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">公司名称</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <div className="font-medium">{user?.company || '未设置'}</div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-energy-500 text-white rounded-lg hover:bg-energy-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
