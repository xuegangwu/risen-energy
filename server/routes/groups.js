import express from 'express';
import Group from '../models/Group.js';
import Package from '../models/Package.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    else query.status = { $in: ['pending', 'ongoing'] };
    
    const groups = await Group.find(query)
      .populate('package', 'name image basePrice')
      .populate('leader', 'username')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Group.countDocuments(query);
    
    res.json({
      groups,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: '获取团购列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('package', 'name image basePrice components')
      .populate('leader', 'username')
      .populate('participants.user', 'username');
    
    if (!group) {
      return res.status(404).json({ message: '团购不存在' });
    }
    
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: '获取团购详情失败' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { packageId, groupName, groupPrice, targetCount, endTime } = req.body;
    
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: '套餐不存在' });
    }
    
    const group = new Group({
      package: packageId,
      groupName: groupName || `${pkg.name}拼团`,
      groupPrice: groupPrice || pkg.groupPrice,
      targetCount: targetCount || 2,
      leader: req.user.id,
      participants: [{ user: req.user.id }],
      endTime
    });
    
    await group.save();
    
    res.status(201).json({ message: '拼团创建成功', group });
  } catch (err) {
    res.status(500).json({ message: '创建团购失败', error: err.message });
  }
});

router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: '团购不存在' });
    }
    
    if (group.status !== 'ongoing') {
      return res.status(400).json({ message: '团购不在进行中' });
    }
    
    if (new Date() > group.endTime) {
      group.status = 'expired';
      await group.save();
      return res.status(400).json({ message: '团购已过期' });
    }
    
    const alreadyJoined = group.participants.some(
      p => p.user && p.user.toString() === req.user.id
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: '您已参与此团购' });
    }
    
    group.participants.push({ user: req.user.id });
    group.currentCount += 1;
    
    if (group.currentCount >= group.targetCount) {
      group.status = 'completed';
    }
    
    await group.save();
    
    res.json({ message: '参与团购成功', group });
  } catch (err) {
    res.status(500).json({ message: '参与团购失败' });
  }
});

export default router;
