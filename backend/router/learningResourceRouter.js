const express = require('express');
const router = express.Router();
const learningResourceController = require('../controller/learningResourceController');

// GET /api/learning-resources (ดึงรายการทั้งหมด พร้อมค้นหาและกรอง)
router.get('/', learningResourceController.getAllResources);

// GET /api/learning-resources/:id (ดูรายละเอียด 1 รายการ)
router.get('/:id', learningResourceController.getResourceById);

// POST /api/learning-resources (เพิ่มข้อมูลใหม่)
router.post('/', learningResourceController.createResource);

// PUT /api/learning-resources/:id (แก้ไขข้อมูล)
router.put('/:id', learningResourceController.updateResource);

// DELETE /api/learning-resources/:id (ลบข้อมูล)
router.delete('/:id', learningResourceController.deleteResource);

module.exports = router;
