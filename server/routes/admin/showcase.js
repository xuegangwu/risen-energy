import express from 'express';
import ShowcaseProject from '../../models/ShowcaseProject.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type && type !== 'all') {
      filter.type = type;
    }
    const projects = await ShowcaseProject.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = new ShowcaseProject(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const project = await ShowcaseProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await ShowcaseProject.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/import', async (req, res) => {
  try {
    const { projects } = req.body;
    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({ message: '请提供项目数组' });
    }
    
    const inserted = await ShowcaseProject.insertMany(projects);
    res.status(201).json({ 
      message: `成功导入 ${inserted.length} 个案例`,
      count: inserted.length 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const defaultProjects = [
      {
        name: '华东某汽车零部件工厂',
        location: '江苏苏州',
        capacity: '500kW/1MWh',
        type: 'storage',
        image: '🏭',
        coordinates: { lat: 31.2989, lng: 120.5853 },
        description: '工厂屋顶光伏+储能一体化项目，采用东方日升iCon 500kWh储能系统，配合1MW光伏组件，实现年节省电费约120万元。',
        features: ['峰谷套利', '光伏配套', '智能EMS']
      },
      {
        name: '华东某大型物流园区',
        location: '上海嘉定',
        capacity: '200kW/430kWh',
        type: 'storage',
        image: '🏠',
        coordinates: { lat: 31.4000, lng: 121.2500 },
        description: '物流园区办公区+仓库储能项目，采用东方日升iCon 215kWh×2台，解决园区峰值用电需求，提供应急备电功能。',
        features: ['应急备电', '需量管理', '光储一体']
      },
      {
        name: '华南某制造业龙头企业',
        location: '广东东莞',
        capacity: '1MW/2MWh',
        type: 'storage',
        image: '🏢',
        coordinates: { lat: 23.0430, lng: 113.7518 },
        description: '大型制造企业储能项目，采用东方日升iCon 500kWh×4台，配合园区3MW光伏，年减少碳排放约2000吨。',
        features: ['碳减排', '绿色认证', '光伏配套']
      },
      {
        name: '华东某商业综合体',
        location: '浙江杭州',
        capacity: '300kW/600kWh',
        type: 'storage',
        image: '🛒',
        coordinates: { lat: 30.2741, lng: 120.1551 },
        description: '商业综合体储能项目，实现空调负荷平滑，降低变压器容量需求，年节省电费约80万元。',
        features: ['需量优化', '电能质量', '智慧运维']
      },
      {
        name: '华北某数据中心光伏项目',
        location: '北京亦庄',
        capacity: '500kWp',
        type: 'solar',
        image: '💻',
        coordinates: { lat: 39.7950, lng: 116.5090 },
        description: '数据中心屋顶光伏项目，采用隆基绿能550W单晶组件，年发电量约60万度，实现数据中心绿色能源占比30%。',
        features: ['绿色电力', 'ESG合规', '自发自用']
      },
      {
        name: '华东某产业园区农光互补',
        location: '山东济南',
        capacity: '2MWp',
        type: 'solar',
        image: '🌾',
        coordinates: { lat: 36.6512, lng: 117.1205 },
        description: '农业产业园区的农光互补项目，上面光伏发电，下面种植食用菌，实现土地高效利用，年发电收益约180万元。',
        features: ['农光互补', '土地复用', '收益多元']
      },
      {
        name: '华中某制药企业储能',
        location: '湖北武汉',
        capacity: '400kW/800kWh',
        type: 'storage',
        image: '🏥',
        coordinates: { lat: 30.5928, lng: 114.3055 },
        description: '制药企业储能项目，解决生产负荷波动问题，提供不间断电源保障，年节省电费约100万元。',
        features: ['电力保障', '负荷平滑', 'GMP合规']
      },
      {
        name: '西南某矿业公司储能',
        location: '云南昆明',
        capacity: '600kW/1.2MWh',
        type: 'storage',
        image: '⛏️',
        coordinates: { lat: 25.0406, lng: 102.7129 },
        description: '矿业公司储能项目，用于矿山设备供电保障和峰谷套利，配合光伏降低用电成本。',
        features: ['离网供电', '峰谷套利', '柴油替代']
      },
      {
        name: '西北某大型地面光伏电站',
        location: '甘肃酒泉',
        capacity: '10MWp',
        type: 'solar',
        image: '🏜️',
        coordinates: { lat: 39.7440, lng: 98.4946 },
        description: '大型地面光伏电站，采用东方日升高效光伏组件，配套储能系统实现调峰补偿。',
        features: ['大型地面', '跟踪支架', '智能运维']
      },
      {
        name: '华南某电子工厂光储一体',
        location: '深圳龙岗',
        capacity: '500kW/1MWh',
        type: 'storage',
        image: '📱',
        coordinates: { lat: 22.7195, lng: 114.2491 },
        description: '电子制造工厂光储一体化项目，屋顶光伏+储能系统，保障生产线稳定运行。',
        features: ['光储一体', '电力保障', '绿色制造']
      },
      {
        name: '华东某高校智慧能源',
        location: '上海闵行',
        capacity: '300kW/600kWh',
        type: 'storage',
        image: '🎓',
        coordinates: { lat: 31.0252, lng: 121.4337 },
        description: '高校校园智慧能源项目，光伏+储能+充电桩，构建零碳校园示范。',
        features: ['零碳校园', '充电桩配套', '教育示范']
      },
      {
        name: '华北某冷链物流园区',
        location: '天津滨海',
        capacity: '250kW/500kWh',
        type: 'storage',
        image: '🚛',
        coordinates: { lat: 39.1255, lng: 117.1909 },
        description: '冷链物流园区储能项目，解决冷库负荷波动问题，配合光伏降低运营成本。',
        features: ['冷链储能', '光伏配套', '节能降耗']
      }
    ];

    await ShowcaseProject.deleteMany({});
    const inserted = await ShowcaseProject.insertMany(defaultProjects);
    
    res.json({ 
      message: `成功导入 ${inserted.length} 个案例`,
      count: inserted.length 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
