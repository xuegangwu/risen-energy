import express from 'express';
import User from '../../models/User.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, keyword } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (keyword) {
      query.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: '获取用户列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '获取用户详情失败' });
  }
});

router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: '无效的角色' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '角色更新成功', user });
  } catch (err) {
    res.status(500).json({ message: '更新角色失败' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '状态更新成功', user });
  } catch (err) {
    res.status(500).json({ message: '更新状态失败' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '用户删除成功' });
  } catch (err) {
    res.status(500).json({ message: '删除用户失败' });
  }
});

export default router;
