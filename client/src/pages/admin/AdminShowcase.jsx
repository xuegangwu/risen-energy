import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const typeOptions = [
  { value: 'storage', label: '🔋 储能' },
  { value: 'solar', label: '☀️ 光伏' },
];

export default function AdminShowcase() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    type: 'storage',
    image: '🏭',
    description: '',
    features: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/showcase');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('获取案例失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    try {
      const url = editingId 
        ? `/api/admin/showcase/${editingId}`
        : '/api/admin/showcase';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingId ? '更新成功' : '添加成功');
        setShowModal(false);
        resetForm();
        fetchProjects();
      }
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      name: project.name,
      location: project.location,
      capacity: project.capacity,
      type: project.type,
      image: project.image,
      description: project.description,
      features: project.features.join(', ')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个案例吗？')) return;
    
    try {
      const res = await fetch(`/api/admin/showcase/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('删除成功');
        fetchProjects();
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSeed = async () => {
    if (!confirm('确定要导入默认案例数据吗？这会清空现有数据。')) return;
    
    try {
      const res = await fetch('/api/admin/showcase/seed', {
        method: 'POST'
      });
      const data = await res.json();
      alert(data.message);
      fetchProjects();
    } catch (error) {
      alert('导入失败');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      type: 'storage',
      image: '🏭',
      description: '',
      features: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">案例管理</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            导入默认数据
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-energy-500 text-white rounded-lg hover:bg-energy-600"
          >
            + 添加案例
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">图标</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">容量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">地点</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="px-6 py-4 text-2xl">{project.image}</td>
                <td className="px-6 py-4 text-sm font-medium">{project.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.type === 'solar' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-energy-100 text-energy-700'
                  }`}>
                    {project.type === 'solar' ? '☀️ 光伏' : '🔋 储能'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{project.capacity}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{project.location}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-energy-600 hover:text-energy-800 mr-3"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            暂无案例数据，请点击"导入默认数据"或"添加案例"
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? '编辑案例' : '添加案例'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">案例名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">类型</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {typeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">图标</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="🏭"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">容量/功率</label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="500kW/1MWh"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">地点</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="江苏苏州"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">特点（用逗号分隔）</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="峰谷套利, 光伏配套, 智能EMS"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
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
