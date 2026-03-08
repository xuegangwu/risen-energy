import express from 'express';
import Package from '../models/Package.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, category, isHot, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (type) query.type = type;
    if (category) query.category = category;
    if (isHot) query.isHot = true;
    
    const packages = await Package.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Package.countDocuments(query);
    
    res.json({
      packages,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: '获取套餐列表失败', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: '套餐不存在' });
    }
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: '获取套餐详情失败' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理员可以创建套餐' });
    }
    
    const pkg = new Package(req.body);
    await pkg.save();
    
    res.status(201).json({ message: '套餐创建成功', pkg });
  } catch (err) {
    res.status(500).json({ message: '创建套餐失败' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理员可以修改套餐' });
    }
    
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ message: '套餐更新成功', pkg });
  } catch (err) {
    res.status(500).json({ message: '更新套餐失败' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理员可以删除套餐' });
    }
    
    await Package.findByIdAndDelete(req.params.id);
    
    res.json({ message: '套餐删除成功' });
  } catch (err) {
    res.status(500).json({ message: '删除套餐失败' });
  }
});

export default router;
