import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.adminKey) {
        await authAPI.register({
          username: formData.username,
          password: formData.password,
          adminKey: formData.adminKey
        });
        alert('管理员账号创建成功，请登录');
      } else {
        const res = await authAPI.login({
          username: formData.username,
          password: formData.password
        });

        if (res.data.user.role !== 'admin') {
          setError('权限不足，需要管理员账号');
          return;
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">⚙️</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isRegister ? '创建管理员账号' : '后台管理系统'}
          </h1>
          <p className="text-gray-500 mt-2">储能智选商城</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                管理员密钥
              </label>
              <input
                type="password"
                value={formData.adminKey}
                onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
                placeholder="请输入管理员密钥"
                required={isRegister}
              />
              <p className="text-xs text-gray-500 mt-1">密钥: admin2024</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-energy-500 text-white py-3 rounded-xl font-bold hover:bg-energy-600 disabled:opacity-50"
          >
            {loading ? '处理中...' : isRegister ? '创建账号' : '登录'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-energy-600 hover:underline text-sm"
          >
            {isRegister ? '已有账号？立即登录' : '创建管理员账号'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← 返回商城
          </button>
        </div>
      </div>
    </div>
  );
}
