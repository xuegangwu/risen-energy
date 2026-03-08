import express from 'express';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

function generatePaymentNo(method) {
  const prefix = method === 'alipay' ? 'ALIPAY' : method === 'wechat' ? 'WECHAT' : 'BANK';
  return prefix + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
}

router.post('/', authenticate, async (req, res) => {
  try {
    const { items, totalAmount, contactName, contactPhone, deliveryAddress, remark, paymentMethod } = req.body;
    
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      contactName,
      contactPhone,
      deliveryAddress,
      remark,
      paymentMethod
    });
    
    await order.save();
    
    res.status(201).json({ message: '订单创建成功', order });
  } catch (err) {
    res.status(500).json({ message: '创建订单失败', error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user.id };
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('package', 'name image')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: '获取订单列表失败' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate('package', 'name image')
      .populate('group', 'groupName groupPrice');
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: '获取订单详情失败' });
  }
});

router.post('/:id/create-payment', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: '订单状态不正确' });
    }
    
    const { paymentMethod } = req.body;
    
    if (!['bank_transfer', 'wechat', 'alipay'].includes(paymentMethod)) {
      return res.status(400).json({ message: '无效的支付方式' });
    }
    
    order.paymentMethod = paymentMethod;
    await order.save();
    
    const paymentNo = generatePaymentNo(paymentMethod);
    
    let paymentData = {
      orderId: order._id,
      orderNo: order.orderNo,
      totalAmount: order.totalAmount,
      paymentMethod,
      paymentNo,
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 30 * 60 * 1000)
    };
    
    if (paymentMethod === 'alipay') {
      paymentData.qrCode = `https://qr.alipay.com/${paymentNo}`;
      paymentData.deepLink = `alipay://platformapi/startapp?appId=20000067&url=${encodeURIComponent(paymentData.qrCode)}`;
      paymentData.h5Url = `https://m.alipay.com/gateway.do?out_trade_no=${paymentNo}&total_amount=${order.totalAmount / 10000}&subject=${encodeURIComponent(order.orderNo)}`;
    } else if (paymentMethod === 'wechat') {
      paymentData.qrCode = `weixin://wxpay/bizpayurl?pr=${paymentNo}`;
      paymentData.deepLink = `weixin://dl/business/?ticket=${paymentNo}`;
      paymentData.h5Url = `https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=${paymentNo}&redirect_url=${encodeURIComponent('https://energystorage.com/payment/callback')}`;
    } else {
      paymentData.bankInfo = {
        bankName: '中国工商银行',
        accountName: '储能智选科技有限公司',
        accountNumber: '6222 **** **** 8888',
        branchName: '北京分行营业部',
        remark: `请备注订单号: ${order.orderNo}`
      };
    }
    
    res.json({
      success: true,
      message: '支付信息已生成',
      payment: paymentData
    });
  } catch (err) {
    res.status(500).json({ message: '创建支付失败', error: err.message });
  }
});

router.post('/:id/check-payment', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.status === 'paid') {
      return res.json({
        success: true,
        paid: true,
        message: '支付成功',
        paymentTime: order.paymentTime,
        paymentNo: order.paymentNo
      });
    }
    
    if (order.status === 'pending') {
      const paymentNo = order.paymentNo;
      const shouldSuccess = Math.random() > 0.3;
      
      if (shouldSuccess) {
        order.status = 'paid';
        order.paymentTime = new Date();
        order.paymentNo = paymentNo || generatePaymentNo(order.paymentMethod);
        await order.save();
        
        return res.json({
          success: true,
          paid: true,
          message: '支付成功',
          paymentTime: order.paymentTime,
          paymentNo: order.paymentNo
        });
      }
      
      return res.json({
        success: true,
        paid: false,
        message: '等待支付中...',
        remainingTime: 1800
      });
    }
    
    res.json({
      success: false,
      paid: false,
      message: '订单状态异常',
      status: order.status
    });
  } catch (err) {
    res.status(500).json({ message: '查询支付状态失败' });
  }
});

router.put('/:id/pay', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: '订单状态不正确' });
    }
    
    order.status = 'paid';
    order.paymentTime = new Date();
    order.paymentNo = generatePaymentNo(order.paymentMethod);
    await order.save();
    
    res.json({ message: '支付成功', order });
  } catch (err) {
    res.status(500).json({ message: '支付失败' });
  }
});

router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: '只有待付款订单可以取消' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({ message: '订单已取消', order });
  } catch (err) {
    res.status(500).json({ message: '取消订单失败' });
  }
});

export default router;
