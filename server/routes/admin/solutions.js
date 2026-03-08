import express from 'express';
import Solution from '../../models/Solution.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, active } = req.query;
    const filter = {};
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (active === 'true') {
      filter.isActive = true;
    }
    const solutions = await Solution.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ solutions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: '解决方案不存在' });
    }
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const solution = new Solution(req.body);
    await solution.save();
    res.status(201).json(solution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const solution = await Solution.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!solution) {
      return res.status(404).json({ message: '解决方案不存在' });
    }
    res.json(solution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: '解决方案不存在' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/seed', requireAdmin, async (req, res) => {
  try {
    const defaultSolutions = [
      {
        title: '工商业储能解决方案',
        subtitle: '峰谷套利·需量管理·应急备电',
        type: 'storage',
        category: 'industrial',
        icon: '🔋',
        description: '针对工商业用户设计的储能系统解决方案，通过峰谷电价差套利、需量电费管理、应急备电等功能，帮助企业降低用电成本、提升供电可靠性。',
        features: ['峰谷套利', '需量管理', '应急备电', '光伏配套', '智能调度'],
        specs: {
          capacity: '100kWh-2MWh',
          power: '50kW-1MW',
          efficiency: '≥90%',
          warranty: '5年/10000次循环'
        },
        applications: ['工业园区', '商业综合体', '数据中心', '制造业工厂'],
        benefits: ['电费节省30%+', '供电可靠性提升', '碳排放减少'],
        sortOrder: 1,
        isActive: true
      },
      {
        title: '分布式光伏EPC',
        subtitle: '投资建模·设计施工·运维托管',
        type: 'solar',
        category: 'distributed',
        icon: '☀️',
        description: '提供分布式光伏电站全生命周期EPC服务，从项目评估、投资建模、系统设计到工程施工、运维托管，为用户提供一站式解决方案。',
        features: ['项目评估', '投资建模', '系统设计', '工程施工', '运维托管'],
        specs: {
          capacity: '100kWp-10MWp',
          efficiency: '≥21%',
          warranty: '10年产品质保'
        },
        applications: ['工厂屋顶', '商业屋顶', '农光互补', '车棚光伏'],
        benefits: ['自发自用', '余电上网', '碳资产开发'],
        sortOrder: 2,
        isActive: true
      },
      {
        title: '光储一体化解决方案',
        subtitle: '源网荷储·智能协同',
        type: 'hybrid',
        category: 'integrated',
        icon: '⚡',
        description: '整合光伏与储能系统，实现源网荷储智能协同，提升新能源消纳能力，优化系统运行效率，降低用户综合用电成本。',
        features: ['源网荷储', '智能协同', '新能源消纳', '电网支撑', '经济优化'],
        specs: {
          capacity: '200kWh-5MWh',
          power: '100kW-2MW',
          efficiency: '≥92%',
          warranty: '5年/10000次循环'
        },
        applications: ['零碳园区', '绿色工厂', '微电网', '智能社区'],
        benefits: ['新能源100%消纳', '用电成本降低50%+', '绿电证书'],
        sortOrder: 3,
        isActive: true
      },
      {
        title: '数据中心储能方案',
        subtitle: '不间断电源·负荷调节',
        type: 'storage',
        category: 'datacenter',
        icon: '💻',
        description: '为数据中心提供高可靠性储能解决方案，作为不间断电源(UPS)的有效补充，同时实现负荷调节和峰谷套利。',
        features: ['不间断供电', '负荷调节', '应急备电', '智能监控'],
        specs: {
          capacity: '500kWh-5MWh',
          power: '250kW-2.5MW',
          efficiency: '≥95%',
          warranty: '3年/5000次循环'
        },
        applications: ['企业数据中心', '云计算中心', '边缘计算节点'],
        benefits: ['供电可靠性99.99%', '电费节省25%+'],
        sortOrder: 4,
        isActive: true
      },
      {
        title: '制造业储能方案',
        subtitle: '负荷管理·需量优化',
        type: 'storage',
        category: 'manufacturing',
        icon: '🏭',
        description: '针对制造业用户的高能耗特点，提供针对性的储能解决方案，帮助企业实现需量电费优化和生产负荷管理。',
        features: ['需量优化', '负荷管理', '峰谷套利', '电能质量'],
        specs: {
          capacity: '200kWh-10MWh',
          power: '100kW-5MW',
          efficiency: '≥90%',
          warranty: '5年/10000次循环'
        },
        applications: ['汽车制造', '电子制造', '食品加工', '化工行业'],
        benefits: ['需量电费节省40%+', '生产稳定性提升'],
        sortOrder: 5,
        isActive: true
      }
    ];

    for (const solution of defaultSolutions) {
      await Solution.findOneAndUpdate(
        { title: solution.title },
        solution,
        { upsert: true, new: true }
      );
    }

    res.json({ message: '导入成功', count: defaultSolutions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
