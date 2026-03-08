import mongoose from 'mongoose';
import Package from './models/Package.js';

const seedPackages = [
  {
    name: '标准100kWh储能系统',
    type: 'storage',
    category: '100kWh',
    description: '适用于小型工厂、办公室等场所的储能方案，采用磷酸铁锂电池，安全性高，循环寿命长。',
    capacity: '100kWh',
    power: '50kW',
    application: '小型工厂、办公楼宇',
    basePrice: 280000,
    groupPrice: 250000,
    minGroupSize: 2,
    stock: 50,
    isHot: true,
    components: [
      { name: '电池组', type: '磷酸铁锂电池', brand: '宁德时代', model: 'CATL-100', price: 150000 },
      { name: '变流器', type: '双向PCS', brand: '华为', model: 'PCS-50', price: 50000 },
      { name: 'EMS', type: '能源管理系统', brand: '自研', price: 30000 },
      { name: '配电柜', type: '低压配电', price: 20000 },
      { name: '安装辅材', type: '线缆、支架等', price: 30000 }
    ]
  },
  {
    name: '标准200kWh储能系统',
    type: 'storage',
    category: '200kWh',
    description: '适用于中型工厂、商超等场所，支持峰谷套利、应急备电等多种应用场景。',
    capacity: '200kWh',
    power: '100kW',
    application: '中型工厂、商场超市',
    basePrice: 480000,
    groupPrice: 450000,
    minGroupSize: 2,
    stock: 30,
    isHot: true,
    components: [
      { name: '电池组', type: '磷酸铁锂电池', brand: '宁德时代', model: 'CATL-200', price: 260000 },
      { name: '变流器', type: '双向PCS', brand: '华为', model: 'PCS-100', price: 80000 },
      { name: 'EMS', type: '能源管理系统', brand: '自研', price: 40000 },
      { name: '配电柜', type: '低压配电', price: 40000 },
      { name: '安装辅材', type: '线缆、支架等', price: 60000 }
    ]
  },
  {
    name: '标准500kWh储能系统',
    type: 'storage',
    category: '500kWh',
    description: '适用于大型园区、工厂等场所，支持光伏配套，提供完整的储能解决方案。',
    capacity: '500kWh',
    power: '250kW',
    application: '大型园区、工业厂房',
    basePrice: 980000,
    groupPrice: 920000,
    minGroupSize: 3,
    stock: 20,
    isHot: true,
    components: [
      { name: '电池组', type: '磷酸铁锂电池', brand: '比亚迪', model: 'BYD-500', price: 550000 },
      { name: '变流器', type: '双向PCS', brand: '阳光电源', model: 'SC250', price: 150000 },
      { name: 'EMS', type: '能源管理系统', brand: '自研', price: 80000 },
      { name: '变压器', type: '干式变压器', price: 80000 },
      { name: '开关柜', type: '中压开关柜', price: 60000 }
    ]
  },
  {
    name: '标准1MWh储能系统',
    type: 'storage',
    category: '1MWh',
    description: '适用于大型工业用户、微电网等场景，支持多种工作模式，提供定制化服务。',
    capacity: '1MWh',
    power: '500kW',
    application: '大型工厂、微电网',
    basePrice: 1800000,
    groupPrice: 1680000,
    minGroupSize: 3,
    stock: 10,
    isHot: false,
    components: [
      { name: '电池组', type: '磷酸铁锂电池', brand: '宁德时代', model: 'CATL-1000', price: 1000000 },
      { name: '变流器', type: '双向PCS', brand: '阳光电源', model: 'SC500', price: 280000 },
      { name: 'EMS', type: '能源管理系统', brand: '自研', price: 120000 },
      { name: '变压器', type: '中压变压器', price: 180000 },
      { name: '开关柜', type: '中压开关柜', price: 120000 }
    ]
  },
  {
    name: '光储一体化系统-100kW',
    type: 'storage',
    category: '100kWh',
    description: '集成光伏发电与储能系统，适用于有光伏安装条件的用户，实现自发自用。',
    capacity: '100kWh',
    power: '100kW',
    application: '有光伏需求的用户',
    basePrice: 450000,
    groupPrice: 420000,
    minGroupSize: 2,
    stock: 20,
    isHot: false,
    components: [
      { name: '电池组', type: '磷酸铁锂电池', brand: '宁德时代', price: 150000 },
      { name: '变流器', type: '光储一体机', brand: '华为', price: 80000 },
      { name: '光伏逆变器', type: '组串式', price: 60000 },
      { name: 'EMS', type: '能源管理系统', price: 40000 },
      { name: '光伏支架', type: '彩钢瓦支架', price: 40000 },
      { name: '配电设备', type: '配套', price: 80000 }
    ]
  },
  {
    name: '光储一体化系统-200kW',
    type: 'storage',
    category: '200kWh',
    description: '大规模光储一体化解决方案，适用于工商业屋顶光伏项目。',
    capacity: '200kWh',
    power: '200kW',
    application: '工商业光伏项目',
    basePrice: 780000,
    groupPrice: 720000,
    minGroupSize: 2,
    stock: 15,
    isHot: false,
    components: [
      { name: '电池组', type: '磷酸铁锂电池', brand: '比亚迪', price: 260000 },
      { name: '变流器', type: '光储一体机', brand: '阳光电源', price: 140000 },
      { name: '光伏逆变器', type: '组串式', price: 100000 },
      { name: 'EMS', type: '能源管理系统', price: 60000 },
      { name: '光伏支架', type: '固定支架', price: 80000 },
      { name: '配电设备', type: '配套', price: 140000 }
    ]
  },
  {
    name: '分布式光伏电站EPC-500kW',
    type: 'solar',
    category: '500kW',
    description: '工商业屋顶分布式光伏电站EPC总承包服务，包含设计、采购、施工、调试一站式服务。',
    capacity: '500kWp',
    power: '500kW',
    application: '工商业屋顶光伏',
    basePrice: 2200000,
    groupPrice: 1980000,
    minGroupSize: 3,
    stock: 10,
    isHot: true,
    components: [
      { name: '光伏组件', type: '单晶硅组件', brand: '隆基绿能', model: 'HI-MO 5', price: 880000 },
      { name: '光伏逆变器', type: '组串式逆变器', brand: '华为', model: 'SUN2000-100KTL', price: 320000 },
      { name: '光伏支架', type: '固定支架', brand: '中信博', price: 280000 },
      { name: '电缆线缆', type: '光伏专用电缆', price: 180000 },
      { name: '配电设备', type: '并网柜', price: 220000 },
      { name: 'EPC服务', type: '设计施工调试', price: 320000 }
    ]
  },
  {
    name: '分布式光伏电站EPC-1MW',
    type: 'solar',
    category: '1MW',
    description: '大型工商业屋顶光伏电站EPC总承包，适用于园区、厂房等大面积屋顶场景。',
    capacity: '1MWp',
    power: '1MW',
    application: '大型厂房屋顶光伏',
    basePrice: 4200000,
    groupPrice: 3800000,
    minGroupSize: 2,
    stock: 5,
    isHot: true,
    components: [
      { name: '光伏组件', type: '单晶硅组件', brand: '隆基绿能', model: 'HI-MO 5', price: 1680000 },
      { name: '光伏逆变器', type: '组串式逆变器', brand: '阳光电源', model: 'SG320HX', price: 580000 },
      { name: '光伏支架', type: '固定支架', brand: '中信博', price: 520000 },
      { name: '电缆线缆', type: '光伏专用电缆', price: 340000 },
      { name: '变压器', type: '升压变压器', price: 480000 },
      { name: 'EPC服务', type: '设计施工调试', price: 600000 }
    ]
  },
  {
    name: '车棚光伏一体化EPC-200kW',
    type: 'solar',
    category: '200kW',
    description: '光伏车棚一体化解决方案，结合储能系统，实现太阳能发电与车辆遮阳双重功能。',
    capacity: '200kWp',
    power: '200kW',
    application: '光伏车棚、充电站',
    basePrice: 1200000,
    groupPrice: 1080000,
    minGroupSize: 2,
    stock: 8,
    isHot: false,
    components: [
      { name: '光伏组件', type: '单晶硅组件', brand: '天合光能', price: 480000 },
      { name: '光伏逆变器', type: '组串式逆变器', brand: '华为', price: 180000 },
      { name: '光伏车棚', type: '钢结构车棚', price: 240000 },
      { name: '电缆线缆', type: '光伏专用电缆', price: 80000 },
      { name: '充电桩', type: '交流充电桩', price: 120000 },
      { name: 'EPC服务', type: '设计施工调试', price: 100000 }
    ]
  },
  {
    name: '农业光伏一体化EPC-5MW',
    type: 'solar',
    category: '5MW',
    description: '农光互补光伏电站EPC总承包，光伏发电与农业生产相结合，提高土地利用率。',
    capacity: '5MWp',
    power: '5MW',
    application: '农业大棚、荒山荒坡',
    basePrice: 18500000,
    groupPrice: 16800000,
    minGroupSize: 2,
    stock: 3,
    isHot: false,
    components: [
      { name: '光伏组件', type: '单晶硅组件', brand: '隆基绿能', price: 7400000 },
      { name: '光伏逆变器', type: '集中式逆变器', brand: '阳光电源', price: 2200000 },
      { name: '光伏支架', type: '农光互补支架', price: 2600000 },
      { name: '电缆线缆', type: '光伏专用电缆', price: 1800000 },
      { name: '变压器', type: '升压变压器', price: 2200000 },
      { name: 'EPC服务', type: '设计施工调试', price: 2300000 }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/energy-storage');
    console.log('MongoDB 连接成功');
    
    await Package.deleteMany({});
    console.log('已清空套餐数据');
    
    await Package.insertMany(seedPackages);
    console.log('✅ 套餐数据导入成功');
    console.log(`共导入 ${seedPackages.length} 个套餐`);
    console.log(`- 储能套餐: ${seedPackages.filter(p => p.type === 'storage').length} 个`);
    console.log(`- 光伏套餐: ${seedPackages.filter(p => p.type === 'solar').length} 个`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ 数据导入失败:', err);
    process.exit(1);
  }
}

seed();
