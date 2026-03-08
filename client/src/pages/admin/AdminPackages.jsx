import { useState, useEffect } from 'react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '100kWh',
    description: '',
    capacity: '',
    power: '',
    application: '',
    basePrice: 0,
    groupPrice: 0,
    minGroupSize: 2,
    stock: 10,
    isHot: false,
    status: 'active',
    components: []
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error('加载失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPackage 
        ? `http://localhost:3000/api/admin/packages/${editingPackage._id}`
        : 'http://localhost:3000/api/admin/packages';
      const method = editingPackage ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert(editingPackage ? '更新成功' : '创建成功');
        setShowModal(false);
        setEditingPackage(null);
        loadPackages();
      }
    } catch (err) {
      alert('操作失败');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个套餐吗？')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadPackages();
    } catch (err) {
      alert('删除失败');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || '',
      category: pkg.category || '100kWh',
      description: pkg.description || '',
      capacity: pkg.capacity || '',
      power: pkg.power || '',
      application: pkg.application || '',
      basePrice: pkg.basePrice || 0,
      groupPrice: pkg.groupPrice || 0,
      minGroupSize: pkg.minGroupSize || 2,
      stock: pkg.stock || 10,
      isHot: pkg.isHot || false,
      status: pkg.status || 'active',
      components: pkg.components || []
    });
    setShowModal(true);
  };

  const handleToggleHot = async (pkg) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/admin/packages/${pkg._id}/hot`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isHot: !pkg.isHot })
      });
      loadPackages();
    } catch (err) {
      alert('操作失败');
    }
  };

  const formatMoney = (amount) => {
    return '¥' + (amount / 10000).toFixed(1) + '万';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">套餐管理</h2>
        <button
          onClick={() => {
            setEditingPackage(null);
            setFormData({
              name: '',
              category: '100kWh',
              description: '',
              capacity: '',
              power: '',
              application: '',
              basePrice: 0,
              groupPrice: 0,
              minGroupSize: 2,
              stock: 10,
              isHot: false,
              status: 'active',
              components: []
            });
            setShowModal(true);
          }}
          className="bg-energy-500 text-white px-4 py-2 rounded-lg hover:bg-energy-600"
        >
          + 添加套餐
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">暂无套餐</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">套餐名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">库存</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-gray-500">{pkg.category}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pkg.capacity} / {pkg.power}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-energy-600">{formatMoney(pkg.groupPrice || pkg.basePrice)}</div>
                    <div className="text-xs text-gray-400 line-through">{formatMoney(pkg.basePrice)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{pkg.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${pkg.isHot ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {pkg.isHot ? '热门' : '普通'}
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${pkg.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {pkg.status === 'active' ? '上架' : '下架'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="text-energy-600 hover:underline text-sm"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleToggleHot(pkg)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {pkg.isHot ? '取消热门' : '设为热门'}
                      </button>
                      <button
                        onClick={() => handleDelete(pkg._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">{editingPackage ? '编辑套餐' : '添加套餐'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">套餐名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="50kWh">50kWh</option>
                    <option value="100kWh">100kWh</option>
                    <option value="200kWh">200kWh</option>
                    <option value="500kWh">500kWh</option>
                    <option value="1MWh">1MWh</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">容量</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="如: 100kWh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">功率</label>
                  <input
                    type="text"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="如: 50kW"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">原价 (分)</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">团购价 (分)</label>
                  <input
                    type="number"
                    value={formData.groupPrice}
                    onChange={(e) => setFormData({ ...formData, groupPrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">最小成团人数</label>
                  <input
                    type="number"
                    value={formData.minGroupSize}
                    onChange={(e) => setFormData({ ...formData, minGroupSize: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">库存</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">适用场景</label>
                <input
                  type="text"
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="如: 工厂、办公楼"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">设为热门</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-energy-500 text-white rounded-lg hover:bg-energy-600"
                >
                  {editingPackage ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
