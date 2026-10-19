const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const learningResourceRouter = require('./router/learningResourceRouter');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Final Exam - Group 5: Learning Resources API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      getAll: 'GET /api/learning-resources',
      getOne: 'GET /api/learning-resources/:id',
      create: 'POST /api/learning-resources',
      update: 'PUT /api/learning-resources/:id',
      delete: 'DELETE /api/learning-resources/:id'
    }
  });
});

// Mount Routes
app.use('/api/learning-resources', learningResourceRouter);

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง API: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({
    success: false,
    message: 'เกิดข้อผิดพลาดร้ายแรงภายในเซิร์ฟเวอร์',
    error: err.message
  });
});

// เริ่มต้นฐานข้อมูลและเซิร์ฟเวอร์
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ (Database Connected)');

    // Sync Model กับ Database
    await sequelize.sync({ alter: false });
    console.log('✅ ซิงค์ตาราง learning_resources เรียบร้อย');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 เซิร์ฟเวอร์พร้อมทำงานที่ http://localhost:${PORT}`);
      console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/learning-resources`);
    });
  } catch (error) {
    console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', error.message);
    process.exit(1);
  }
};

startServer();
