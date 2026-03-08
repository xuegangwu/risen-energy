import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSolutions() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'storage',
    icon: '🔋',
    description: '',
    features: [],
    capacity: '',
    power: '',
    efficiency: '',
    warranty: '',
    applications: [],
    benefits: [],
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/solutions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSolutions(data.solutions || []);
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
      const solutionData = {
        ...formData,
        specs: {
          capacity: formData.capacity,
          power: formData.power,
          efficiency: formData.efficiency,
          warranty: formData.warranty
        },
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        applications: formData.applications.split(',').map(a => a.trim()).filter(a => a),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b)
      };
      
      const url = editingSolution 
        ? `http://localhost:3000/api/admin/solutions/${editingSolution._id}`
        : 'http://localhost:3000/api/admin/solutions';
      const method = editingSolution ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(solutionData)
      });
      
      if (res.ok) {
        alert(editingSolution ? '更新成功' : '创建成功');
        setShowModal(false);
        setEditingSolution(null);
        loadSolutions();
      }
    } catch (err) {
      alert('操作失败');
    }
  };

  const handleEdit = (solution) => {
    setEditingSolution(solution);
    setFormData({
      title: solution.title || '',
      subtitle: solution.subtitle || '',
      type: solution.type || 'storage',
      icon: solution.icon || '🔋',
      description: solution.description || '',
      features: solution.features?.join(', ') || '',
      capacity: solution.specs?.capacity || '',
      power: solution.specs?.power || '',
      efficiency: solution.specs?.efficiency || '',
      warranty: solution.specs?.warranty || '',
      applications: solution.applications?.join(', ') || '',
      benefits: solution.benefits?.join(', ') || '',
      sortOrder: solution.sortOrder || 0,
      isActive: solution.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个方案吗？')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/admin/solutions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadSolutions();
    } catch (err) {
      alert('删除失败');
    }
  };

  const handleSeed = async () => {
    if (!confirm('确定要导入默认方案数据吗？')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/solutions/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('导入成功');
        loadSolutions();
      }
    } catch (err) {
      alert('导入失败');
    }
  };

  const typeLabels = {
    storage: '储能',
    solar: '光伏',
    hybrid: '光储一体'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">储能方案管理</h2>
          <p className="text-gray-500">管理解决方案资料</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeed}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            导入默认方案
          </button>
          <button
            onClick={() => {
              setEditingSolution(null);
              setFormData({
                title: '',
                subtitle: '',
                type: 'storage',
                icon: '🔋',
                description: '',
                features: '',
                capacity: '',
                power: '',
                efficiency: '',
                warranty: '',
                applications: '',
                benefits: '',
                sortOrder: 0,
                isActive: true
              });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-energy-500 text-white rounded-lg hover:bg-energy-600"
          >
            + 添加方案
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">排序</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">图标</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">方案名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {solutions.map((solution) => (
              <tr key={solution._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{solution.sortOrder}</td>
                <td className="px-6 py-4 text-2xl">{solution.icon}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{solution.title}</div>
                  <div className="text-sm text-gray-500">{solution.subtitle}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    solution.type === 'storage' ? 'bg-green-100 text-green-700' :
                    solution.type === 'solar' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {typeLabels[solution.type] || solution.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {solution.specs?.capacity || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    solution.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {solution.isActive ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(solution)}
                      className="text-energy-600 hover:text-energy-700 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(solution._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">
                {editingSolution ? '编辑方案' : '添加方案'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">方案名称</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">副标题</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="storage">储能</option>
                    <option value="solar">光伏</option>
                    <option value="hybrid">光储一体</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">图标</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="🔋"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">容量</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="100kWh-2MWh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">功率</label>
                  <input
                    type="text"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="50kW-1MW"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">效率</label>
                  <input
                    type="text"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="≥90%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">质保</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="5年/10000次循环"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">特点 (逗号分隔)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="峰谷套利, 需量管理, 应急备电"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">应用场景 (逗号分隔)</label>
                <input
                  type="text"
                  value={formData.applications}
                  onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="工业园区, 商业综合体"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">收益 (逗号分隔)</label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="电费节省30%+, 供电可靠性提升"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm">启用</label>
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
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
