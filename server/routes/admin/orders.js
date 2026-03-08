import express from 'express';
import Order from '../../models/Order.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentMethod, startDate, endDate } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('user', 'username phone email company')
      .populate('package', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    
    const stats = await Order.aggregate([
      { $group: { 
        _id: '$status', 
        count: { $sum: 1 },
        total: { $sum: '$totalAmount' }
      }}
    ]);
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (err) {
    res.status(500).json({ message: '获取订单列表失败' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'processing', 'shipped', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const statusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const todayRevenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'processing', 'shipped', 'completed'] }, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0,
      statusStats: statusStats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {})
    });
  } catch (err) {
    res.status(500).json({ message: '获取统计数据失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username phone email company')
      .populate('package', 'name');
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: '获取订单详情失败' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username phone');
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json({ message: '订单状态更新成功', order });
  } catch (err) {
    res.status(500).json({ message: '更新订单状态失败' });
  }
});

router.post('/:id/notes', async (req, res) => {
  try {
    const { note } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { content: note, createdAt: new Date() } } },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json({ message: '备注添加成功', order });
  } catch (err) {
    res.status(500).json({ message: '添加备注失败' });
  }
});

export default router;
