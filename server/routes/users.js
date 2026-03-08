import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, phone, email, company } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword,
      phone,
      email,
      company
    });
    
    await user.save();
    
    res.status(201).json({ message: '注册成功', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: '注册失败', error: err.message });
  }
});

router.post('/admin/register', async (req, res) => {
  try {
    const { username, password, phone, email, company, adminKey } = req.body;
    
    if (adminKey !== 'admin2024') {
      return res.status(403).json({ message: '管理员密钥错误' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword,
      phone,
      email,
      company,
      role: 'admin'
    });
    
    await user.save();
    
    res.status(201).json({ message: '管理员账号创建成功', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: '创建失败', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    const token = generateToken(user);
    
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        company: user.company,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: '登录失败', error: err.message });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { phone, email, company, businessLicense } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phone, email, company, businessLicense },
      { new: true }
    ).select('-password');
    
    res.json({ message: '更新成功', user });
  } catch (err) {
    res.status(500).json({ message: '更新失败' });
  }
});

export default router;
