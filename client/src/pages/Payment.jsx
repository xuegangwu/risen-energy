import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { orderAPI } from '../api';

export default function Payment() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [polling, setPolling] = useState(false);
  const [countdown, setCountdown] = useState(1800);

  useEffect(() => {
    loadOrder();
  }, [id]);

  useEffect(() => {
    if (paymentData && !polling) {
      setPolling(true);
      const timer = setInterval(() => {
        checkPaymentStatus();
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [paymentData]);

  useEffect(() => {
    if (paymentData && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentData, countdown]);

  const loadOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data);
      if (res.data.paymentMethod) {
        setSelectedMethod(res.data.paymentMethod);
      }
    } catch (err) {
      alert(t('common.error'));
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    initPayment(method);
  };

  const initPayment = async (method) => {
    try {
      setLoading(true);
      const res = await orderAPI.createPayment(id, { paymentMethod: method });
      setPaymentData(res.data.payment);
      setCountdown(1800);
    } catch (err) {
      alert(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const res = await orderAPI.checkPayment(id);
      if (res.data.paid) {
        alert(t('common.success'));
        navigate('/profile');
      }
    } catch (err) {
      console.error('检查支付状态失败', err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleOpenApp = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-energy-600 to-primary-600 text-white py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{t('cart.paymentMethod')}</h1>
          <p className="mt-2">{t('profile.orderNo')}: {order?.orderNo}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">{t('cart.total')}</h2>
          <div className="text-3xl font-bold text-energy-600">
            ¥{((order?.totalAmount || 0) / 10000).toFixed(1)}万
          </div>
          {countdown > 0 && paymentData && (
            <div className="mt-2 text-orange-600">
              {t('group.endsIn')}: {formatTime(countdown)}
            </div>
          )}
        </div>

        {!paymentData ? (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">{t('cart.paymentMethod')}</h2>
            <div className="space-y-3">
              {[
                { 
                  value: 'alipay', 
                  label: t('cart.alipay'), 
                  icon: '💙',
                  desc: '推荐支付宝用户使用'
                },
                { 
                  value: 'wechat', 
                  label: t('cart.wechatPay'), 
                  icon: '💚',
                  desc: '推荐微信用户使用'
                },
                { 
                  value: 'bank_transfer', 
                  label: t('cart.bankTransfer'), 
                  icon: '🏦',
                  desc: '银行转账'
                },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => handleMethodSelect(method.value)}
                  disabled={loading}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition ${
                    selectedMethod === method.value
                      ? 'border-energy-500 bg-energy-50'
                      : 'border-gray-200 hover:border-energy-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-3xl">{method.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-bold">{method.label}</div>
                    <div className="text-sm text-gray-500">{method.desc}</div>
                  </div>
                  {selectedMethod === method.value && (
                    <span className="text-energy-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {selectedMethod === 'alipay' && (
              <div className="text-center">
                <div className="text-2xl font-bold mb-4">{t('cart.alipay')}</div>
                <div className="bg-gray-100 rounded-xl p-4 mb-4 inline-block">
                  <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-2">💙</div>
                      <div className="text-gray-500 text-sm">扫码支付</div>
                      <div className="mt-4 text-xs text-gray-400">
                        支付金额: ¥{((order?.totalAmount || 0) / 10000).toFixed(1)}万
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleOpenApp(paymentData.deepLink)}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600"
                  >
                    打开支付宝 App
                  </button>
                  <button
                    onClick={() => handleOpenApp(paymentData.h5Url)}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50"
                  >
                    H5 网页支付
                  </button>
                </div>
              </div>
            )}

            {selectedMethod === 'wechat' && (
              <div className="text-center">
                <div className="text-2xl font-bold mb-4">{t('cart.wechatPay')}</div>
                <div className="bg-gray-100 rounded-xl p-4 mb-4 inline-block">
                  <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-2">💚</div>
                      <div className="text-gray-500 text-sm">扫码支付</div>
                      <div className="mt-4 text-xs text-gray-400">
                        支付金额: ¥{((order?.totalAmount || 0) / 10000).toFixed(1)}万
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleOpenApp(paymentData.deepLink)}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600"
                  >
                    打开微信 App
                  </button>
                  <button
                    onClick={() => handleOpenApp(paymentData.h5Url)}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50"
                  >
                    H5 网页支付
                  </button>
                </div>
              </div>
            )}

            {selectedMethod === 'bank_transfer' && (
              <div className="text-center">
                <div className="text-2xl font-bold mb-4">{t('cart.bankTransfer')}</div>
                <div className="bg-gray-50 rounded-xl p-6 mb-4 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">开户行</span>
                      <span className="font-medium">{paymentData.bankInfo?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">户名</span>
                      <span className="font-medium">{paymentData.bankInfo?.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">账号</span>
                      <span className="font-medium">{paymentData.bankInfo?.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">支行</span>
                      <span className="font-medium">{paymentData.bankInfo?.branchName}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="text-orange-600 font-bold text-center">
                        {paymentData.bankInfo?.remark}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await orderAPI.pay(id);
                      alert(t('common.success'));
                      navigate('/profile');
                    } catch (err) {
                      alert(err.response?.data?.message || t('common.error'));
                    }
                  }}
                  className="w-full bg-energy-500 text-white py-3 rounded-xl font-bold hover:bg-energy-600"
                >
                  我已转账
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm mb-2">支付流水号: {paymentData.paymentNo}</p>
              <button
                onClick={() => {
                  setPaymentData(null);
                  setSelectedMethod('');
                }}
                className="text-energy-600 hover:underline"
              >
                更换支付方式
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/profile')}
          className="w-full mt-4 text-gray-500 py-2 hover:text-gray-700"
        >
          ← {t('common.cancel')}
        </button>
      </div>
    </div>
  );
}
