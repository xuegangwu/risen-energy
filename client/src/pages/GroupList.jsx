import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupAPI } from '../api';
import { useAuthStore } from '../stores/authStore';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const res = await groupAPI.getList({});
      setGroups(res.data.groups);
    } catch (err) {
      console.error('加载团购列表失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupId) => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }
    try {
      await groupAPI.join(groupId);
      alert('参与成功');
      loadGroups();
    } catch (err) {
      alert(err.response?.data?.message || '参与失败');
    }
  };

  const getStatusText = (group) => {
    if (group.status === 'completed') return '已成团';
    if (group.status === 'expired') return '已过期';
    const remaining = group.targetCount - group.currentCount;
    return `还差 ${remaining} 人`;
  };

  const getStatusColor = (group) => {
    if (group.status === 'completed') return 'bg-green-100 text-green-800';
    if (group.status === 'expired') return 'bg-gray-100 text-gray-800';
    return 'bg-energy-100 text-energy-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">团购专区</h1>
        <p className="text-gray-600">参与拼团，享更低价格</p>
      </div>

      {loading ? (
        <div className="text-center py-12">加载中...</div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-energy-100 to-primary-100 flex items-center justify-center">
                <span className="text-5xl">🎯</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{group.groupName}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {group.package?.name}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">原价</span>
                    <span className="line-through text-gray-400">
                      ¥{group.package?.basePrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">团购价</span>
                    <span className="text-energy-600 font-bold text-xl">
                      ¥{group.groupPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>进度</span>
                    <span>{group.currentCount}/{group.targetCount} 人</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-energy-500 h-2 rounded-full"
                      style={{ width: `${(group.currentCount / group.targetCount) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(group)}`}>
                    {getStatusText(group)}
                  </span>
                  {group.status === 'ongoing' && (
                    <button
                      onClick={() => handleJoin(group._id)}
                      className="px-4 py-2 bg-energy-500 text-white rounded-lg hover:bg-energy-600 text-sm"
                    >
                      参与拼团
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-4">📦</div>
          <p>暂无进行中的团购活动</p>
          <Link to="/packages" className="text-energy-600 hover:underline mt-2 inline-block">
            去选购套餐
          </Link>
        </div>
      )}
    </div>
  );
}
