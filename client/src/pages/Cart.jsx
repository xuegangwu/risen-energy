import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderAPI } from '../api';

const coupons = [
  { id: 1, name: 'newUserCoupon', discount: 5000, minSpend: 100000, type: 'new' },
  { id: 2, name: 'groupCoupon', discount: 10000, minSpend: 300000, type: 'group' },
  { id: 3, name: 'vipCoupon', discount: 20000, minSpend: 500000, type: 'vip' },
];

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    deliveryAddress: '',
    paymentMethod: 'bank_transfer',
    remark: ''
  });

  const originalTotal = items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  const groupTotal = items.reduce((sum, item) => {
    const price = item.groupPrice || item.basePrice;
    return sum + price * item.quantity;
  }, 0);
  
  const couponDiscount = selectedCoupon ? selectedCoupon.discount : 0;
  const finalTotal = Math.max(0, groupTotal - couponDiscount);
  const savedAmount = originalTotal - finalTotal;

  const availableCoupons = coupons.filter(c => groupTotal >= c.minSpend);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!formData.contactName || !formData.contactPhone || !formData.deliveryAddress) {
      alert('请填写完整的联系信息和收货地址');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        packageId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.groupPrice || item.basePrice
      }));

      const res = await orderAPI.create({
        items: orderItems,
        totalAmount: finalTotal,
        ...formData
      });

      clearCart();
      setSelectedCoupon(null);
      navigate(`/payment/${res.data.order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || '创建订单失败');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-energy-600 to-primary-600 text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
          <p className="text-gray-600 mb-8">{t('cart.browsePackages')}</p>
          <Link
            to="/packages"
            className="inline-block bg-energy-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-energy-600 transition"
          >
            {t('common.packages')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-energy-600 to-primary-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
          <p className="mt-2">{items.length} {t('cart.items')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-energy-50 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-5xl">🔋</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-500 text-sm">{item.capacity} / {item.power}</p>
                        {item.groupPrice && (
                          <span className="inline-block mt-2 bg-energy-500 text-white text-xs px-2 py-1 rounded">
                            {t('group.ongoing')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-red-500 p-2"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border rounded-xl">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 rounded-l-xl"
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-100 rounded-r-xl"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        {item.groupPrice && item.basePrice > item.groupPrice && (
                          <div className="text-gray-400 text-sm line-through">
                            ¥{((item.basePrice * item.quantity) / 10000).toFixed(1)}万
                          </div>
                        )}
                        <div className="text-energy-600 font-bold text-xl">
                          ¥{(((item.groupPrice || item.basePrice) * item.quantity) / 10000).toFixed(1)}万
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">{t('cart.total')}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.originalPrice')}</span>
                  <span>¥{(originalTotal / 10000).toFixed(1)}万</span>
                </div>
                <div className="flex justify-between text-energy-600">
                  <span>{t('cart.groupDiscount')}</span>
                  <span>-¥{((originalTotal - groupTotal) / 10000).toFixed(1)}万</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>{t('cart.coupon')}</span>
                    <span>-¥{(couponDiscount / 10000).toFixed(1)}万</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold">{t('cart.total')}</span>
                  <span className="text-energy-600 font-bold text-2xl">
                    ¥{(finalTotal / 10000).toFixed(1)}万
                  </span>
                </div>
              </div>

              {savedAmount > 0 && (
                <div className="bg-gradient-to-r from-energy-50 to-primary-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-energy-600">
                    <span>🎉</span>
                    <span className="font-medium">{t('cart.saved')} ¥{(savedAmount / 10000).toFixed(1)}万</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowCouponModal(true)}
                className="w-full border-2 border-dashed border-orange-300 text-orange-600 py-3 rounded-xl font-medium mb-6 hover:bg-orange-50 transition"
              >
                {selectedCoupon 
                  ? `${t(selectedCoupon.name)} (-¥${(couponDiscount/10000).toFixed(1)}万)`
                  : `${t('cart.selectCoupon')} ${availableCoupons.length > 0 ? `(${availableCoupons.length}${t('cart.available')})` : ''}`
                }
              </button>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('cart.contactName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
                    placeholder={t('cart.contactName')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('cart.contactPhone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
                    placeholder={t('cart.contactPhone')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('cart.deliveryAddress')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
                    placeholder={t('cart.deliveryAddress')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('cart.paymentMethod')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'bank_transfer', label: t('cart.bankTransfer'), icon: '🏦' },
                      { value: 'wechat', label: t('cart.wechatPay'), icon: '💚' },
                      { value: 'alipay', label: t('cart.alipay'), icon: '💙' },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={`py-3 rounded-xl border-2 text-sm font-medium transition ${
                          formData.paymentMethod === method.value
                            ? 'border-energy-500 bg-energy-50 text-energy-600'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="mr-1">{method.icon}</span>
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('cart.remark')}
                  </label>
                  <textarea
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-energy-500 focus:border-transparent"
                    rows="2"
                    placeholder={t('cart.remark')}
                  />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-energy-500 to-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? t('common.loading') : `${t('cart.checkout')} ¥${(finalTotal / 10000).toFixed(1)}万`}
              </button>
              
              <button
                onClick={clearCart}
                className="w-full mt-3 text-gray-500 py-2 hover:text-gray-700"
              >
                {t('cart.clearCart')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-bold text-xl">{t('cart.coupon')}</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-3">
              {coupons.map((coupon) => {
                const canUse = groupTotal >= coupon.minSpend;
                return (
                  <div
                    key={coupon.id}
                    onClick={() => canUse && setSelectedCoupon(coupon)}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedCoupon?.id === coupon.id
                        ? 'border-energy-500 bg-energy-50'
                        : canUse
                          ? 'border-gray-200 hover:border-energy-300 cursor-pointer'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-energy-600">
                          ¥{(coupon.discount / 10000).toFixed(1)}万
                        </div>
                        <div className="text-sm text-gray-600">{t(coupon.name)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {t('cart.minSpend')} ¥{(coupon.minSpend / 10000).toFixed(0)}万
                        </div>
                        {canUse ? (
                          <span className="text-energy-600 text-sm font-medium">{t('cart.canUse')}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">{t('cart.notMeet')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-6 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setShowCouponModal(false)}
                className="w-full bg-energy-500 text-white py-3 rounded-xl font-bold hover:bg-energy-600"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
