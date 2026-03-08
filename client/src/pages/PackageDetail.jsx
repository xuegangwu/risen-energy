import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageAPI, groupAPI } from '../api';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && (
        <div className="bg-energy-600 text-white px-3 py text-center min-w-[50px-2 rounded-lg]">
          <div className="text-xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">天</div>
        </div>
      )}
      <div className="bg-energy-600 text-white px-3 py-2 rounded-lg text-center min-w-[50px]">
        <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs">时</div>
      </div>
      <div className="bg-energy-600 text-white px-3 py-2 rounded-lg text-center min-w-[50px]">
        <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs">分</div>
      </div>
      <div className="bg-energy-600 text-white px-3 py-2 rounded-lg text-center min-w-[50px]">
        <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs">秒</div>
      </div>
    </div>
  );
}

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('config');
  const addItem = useCartStore(state => state.addItem);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadPackage();
  }, [id]);

  const loadPackage = async () => {
    try {
      const res = await packageAPI.getById(id);
      setPkg(res.data);
      if (res.data.groupPrice) {
        setSelectedGroup('group');
      }
    } catch (err) {
      console.error('加载套餐详情失败', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = () => {
    if (selectedGroup === 'group' && pkg?.groupPrice) {
      return pkg.groupPrice;
    }
    return pkg?.basePrice || 0;
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...pkg,
      groupPrice: selectedGroup === 'group' ? pkg.groupPrice : null
    };
    addItem(itemToAdd, quantity);
    alert('已添加到购物车');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const itemToAdd = {
      ...pkg,
      groupPrice: selectedGroup === 'group' ? pkg.groupPrice : null
    };
    addItem(itemToAdd, quantity);
    navigate('/cart');
  };

  const handleStartGroup = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const endTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      await groupAPI.create({
        packageId: pkg._id,
        groupName: `${pkg.name}拼团`,
        targetCount: 3,
        endTime
      });
      alert('拼团已发起！');
    } catch (err) {
      alert(err.response?.data?.message || '发起拼团失败');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-energy-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-500">加载中...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">套餐不存在</h2>
        <p className="text-gray-500">请返回套餐列表重新选择</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-energy-600 to-primary-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-2">
            <a href="/" className="hover:underline">首页</a>
            <span>/</span>
            <a href="/packages" className="hover:underline">套餐中心</a>
            <span>/</span>
            <span>{pkg.name}</span>
          </div>
          <h1 className="text-3xl font-bold">{pkg.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-energy-50 to-primary-50 flex items-center justify-center">
              <span className="text-[10rem]">🔋</span>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-energy-50 text-energy-700 text-sm px-3 py-1 rounded-full">
                  {pkg.category}
                </span>
                {pkg.isHot && (
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    热门推荐
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{pkg.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">容量</div>
                  <div className="font-bold text-lg">{pkg.capacity}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">功率</div>
                  <div className="font-bold text-lg">{pkg.power}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">适用场景</div>
                  <div className="font-bold text-lg">{pkg.application}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">库存</div>
                  <div className="font-bold text-lg">{pkg.stock} 套</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-gray-500">选择购买方式:</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                      selectedGroup === null
                        ? 'border-energy-500 bg-energy-50 text-energy-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div>单独购买</div>
                    <div className="text-sm text-gray-500">¥{(pkg.basePrice / 10000).toFixed(1)}万</div>
                  </button>
                  {pkg.groupPrice && (
                    <button
                      onClick={() => setSelectedGroup('group')}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                        selectedGroup === 'group'
                          ? 'border-energy-500 bg-energy-50 text-energy-600'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>发起拼团</span>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">特惠</span>
                      </div>
                      <div className="text-sm text-energy-600 font-bold">
                        ¥{(pkg.groupPrice / 10000).toFixed(1)}万
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {selectedGroup === 'group' && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4 border border-orange-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-orange-700">拼团进行中</span>
                    <span className="text-sm text-orange-600">还差 2 人成团</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-energy-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">团长</div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs border-2 border-white">?</div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs border-2 border-white">?</div>
                    </div>
                    <CountdownTimer endTime={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()} />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700">数量:</span>
                <div className="flex items-center border rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-100 rounded-r-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">商品总价:</span>
                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">
                      ¥{((pkg.basePrice * quantity) / 10000).toFixed(1)}万
                    </div>
                    <div className="text-energy-600 font-bold text-3xl">
                      ¥{((getCurrentPrice() * quantity) / 10000).toFixed(1)}万
                    </div>
                  </div>
                </div>
                {selectedGroup === 'group' && (
                  <div className="text-right text-red-500 text-sm mt-1">
                    节省 ¥{(((pkg.basePrice - getCurrentPrice()) * quantity) / 10000).toFixed(1)}万
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-energy-500 text-energy-600 py-4 rounded-xl font-bold text-lg hover:bg-energy-50 transition"
                >
                  加入购物车
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-energy-500 to-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
                >
                  立即购买
                </button>
              </div>
              {selectedGroup === 'group' && (
                <button
                  onClick={handleStartGroup}
                  className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  发起拼团，邀请好友
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-energy-500">✓</span>
                  <span>7*24小时客服</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-energy-500">✓</span>
                  <span>三年质保</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-energy-500">✓</span>
                  <span>免费安装</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-8 py-4 font-medium transition ${
                  activeTab === 'config'
                    ? 'text-energy-600 border-b-2 border-energy-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                套餐配置
              </button>
              <button
                onClick={() => setActiveTab('spec')}
                className={`px-8 py-4 font-medium transition ${
                  activeTab === 'spec'
                    ? 'text-energy-600 border-b-2 border-energy-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                规格参数
              </button>
              <button
                onClick={() => setActiveTab('service')}
                className={`px-8 py-4 font-medium transition ${
                  activeTab === 'service'
                    ? 'text-energy-600 border-b-2 border-energy-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                服务保障
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'config' && pkg.components && (
              <div>
                <h3 className="text-xl font-bold mb-6">套餐组件明细</h3>
                <div className="space-y-4">
                  {pkg.components.map((comp, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-energy-100 rounded-full flex items-center justify-center text-energy-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold">{comp.name}</div>
                          <div className="text-sm text-gray-500">
                            {comp.type} {comp.brand && `- ${comp.brand}`} {comp.model && `- ${comp.model}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-energy-600">¥{comp.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-energy-50 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-gray-700">组件合计</span>
                  <span className="font-bold text-energy-600 text-xl">
                    ¥{pkg.components.reduce((sum, c) => sum + c.price, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'spec' && (
              <div>
                <h3 className="text-xl font-bold mb-6">技术规格</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">电池容量</div>
                    <div className="font-medium">{pkg.capacity}</div>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">输出功率</div>
                    <div className="font-medium">{pkg.power}</div>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">适用场景</div>
                    <div className="font-medium">{pkg.application}</div>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">电池类型</div>
                    <div className="font-medium">磷酸铁锂电池</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'service' && (
              <div>
                <h3 className="text-xl font-bold mb-6">服务保障</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-xl">
                    <div className="text-4xl mb-3">🛡️</div>
                    <div className="font-bold mb-2">三年质保</div>
                    <div className="text-gray-500 text-sm">核心部件三年质保</div>
                  </div>
                  <div className="text-center p-6 border rounded-xl">
                    <div className="text-4xl mb-3">🔧</div>
                    <div className="font-bold mb-2">免费安装</div>
                    <div className="text-gray-500 text-sm">专业团队免费上门安装</div>
                  </div>
                  <div className="text-center p-6 border rounded-xl">
                    <div className="text-4xl mb-3">📞</div>
                    <div className="font-bold mb-2">24/7 支持</div>
                    <div className="text-gray-500 text-sm">全天候技术支持</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
