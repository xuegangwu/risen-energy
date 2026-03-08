import express from 'express';
import Package from '../../models/Package.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', async (req, res) => {
  try {
    const { type, page = 1, limit = 20, category, isHot, status } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (isHot !== undefined) query.isHot = isHot === 'true';
    if (status) query.status = status;
    
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
    res.status(500).json({ message: '获取套餐列表失败' });
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

router.post('/', async (req, res) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.status(201).json({ message: '套餐创建成功', package: pkg });
  } catch (err) {
    res.status(500).json({ message: '创建套餐失败', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) {
      return res.status(404).json({ message: '套餐不存在' });
    }
    res.json({ message: '套餐更新成功', package: pkg });
  } catch (err) {
    res.status(500).json({ message: '更新套餐失败', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: '套餐不存在' });
    }
    res.json({ message: '套餐删除成功' });
  } catch (err) {
    res.status(500).json({ message: '删除套餐失败' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!pkg) {
      return res.status(404).json({ message: '套餐不存在' });
    }
    res.json({ message: '状态更新成功', package: pkg });
  } catch (err) {
    res.status(500).json({ message: '更新状态失败' });
  }
});

router.put('/:id/hot', async (req, res) => {
  try {
    const { isHot } = req.body;
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { isHot },
      { new: true }
    );
    if (!pkg) {
      return res.status(404).json({ message: '套餐不存在' });
    }
    res.json({ message: '热门状态更新成功', package: pkg });
  } catch (err) {
    res.status(500).json({ message: '更新热门状态失败' });
  }
});

export default router;
