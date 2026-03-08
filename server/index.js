import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import packageRoutes from './routes/packages.js';
import orderRoutes from './routes/orders.js';
import groupRoutes from './routes/groups.js';
import adminPackageRoutes from './routes/admin/packages.js';
import adminOrderRoutes from './routes/admin/orders.js';
import adminUserRoutes from './routes/admin/users.js';
import adminShowcaseRoutes from './routes/admin/showcase.js';
import adminSolutionRoutes from './routes/admin/solutions.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/groups', groupRoutes);

app.use('/api/admin/packages', adminPackageRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/showcase', adminShowcaseRoutes);
app.use('/api/admin/solutions', adminSolutionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'risen API Running' });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/energy-storage';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB 连接成功');
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB 连接失败:', err);
    process.exit(1);
  });
