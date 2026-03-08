import { useState, useEffect } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', paymentMethod: '' });

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.paymentMethod) params.append('paymentMethod', filter.paymentMethod);
      
      const res = await fetch(`http://localhost:3000/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.orders || []);
      setStats(data.stats || []);
    } catch (err) {
      console.error('加载失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      loadOrders();
    } catch (err) {
      alert('更新失败');
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

  const paymentMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank_transfer: '银行转账'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">订单管理</h2>
        <div className="flex gap-2">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">全部状态</option>
            <option value="pending">待付款</option>
            <option value="paid">已付款</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <select
            value={filter.paymentMethod}
            onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">全部支付方式</option>
            <option value="alipay">支付宝</option>
            <option value="wechat">微信支付</option>
            <option value="bank_transfer">银行转账</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">暂无订单</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支付方式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">下单时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.orderNo}</div>
                    {order.paymentNo && (
                      <div className="text-xs text-gray-400">{order.paymentNo}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{order.user?.username}</div>
                    <div className="text-xs text-gray-500">{order.user?.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.items?.map((item, idx) => (
                      <div key={idx}>{item.name} x {item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-bold text-energy-600">
                    {formatMoney(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {paymentMap[order.paymentMethod] || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${statusMap[order.status]?.color || ''}`}>
                      {statusMap[order.status]?.text || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                      disabled={order.status === 'cancelled'}
                    >
                      <option value="pending">待付款</option>
                      <option value="paid">已付款</option>
                      <option value="processing">处理中</option>
                      <option value="shipped">已发货</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
