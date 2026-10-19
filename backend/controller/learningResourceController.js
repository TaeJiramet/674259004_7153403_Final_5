const { Op } = require('sequelize');
const LearningResource = require('../model/LearningResource');

// ฟังก์ชัน Helper ตรวจสอบข้อมูลนำเข้า (Input Validation Helper)
const validateResourceInput = (data, isUpdate = false) => {
  const errors = [];
  const validCategories = ['บทความ', 'วิดีโอ', 'แบบฝึกหัด'];

  // ตรวจสอบ title (ห้ามว่าง หรือเป็นช่องว่างเปล่า, ความยาว 1-150)
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('ชื่อสื่อการเรียนรู้ (title) ห้ามเป็นค่าว่างหรือช่องว่างเปล่า');
    } else if (data.title.trim().length > 150) {
      errors.push('ชื่อสื่อการเรียนรู้ต้องมีความยาวไม่เกิน 150 ตัวอักษร');
    }
  }

  // ตรวจสอบ creator (ห้ามว่าง, ความยาว 1-100)
  if (!isUpdate || data.creator !== undefined) {
    if (!data.creator || typeof data.creator !== 'string' || data.creator.trim() === '') {
      errors.push('ผู้สร้าง (creator) ห้ามเป็นค่าว่างหรือช่องว่างเปล่า');
    } else if (data.creator.trim().length > 100) {
      errors.push('ผู้สร้างต้องมีความยาวไม่เกิน 100 ตัวอักษร');
    }
  }

  // ตรวจสอบ category (ต้องเป็น 1 ใน 3 หมวดหมู่)
  if (!isUpdate || data.category !== undefined) {
    if (!data.category || !validCategories.includes(data.category)) {
      errors.push("หมวดหมู่ (category) ต้องเป็น 'บทความ', 'วิดีโอ' หรือ 'แบบฝึกหัด' เท่านั้น");
    }
  }

  // ตรวจสอบ publishedDate (รูปแบบ YYYY-MM-DD)
  if (!isUpdate || data.publishedDate !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!data.publishedDate || !dateRegex.test(data.publishedDate) || isNaN(Date.parse(data.publishedDate))) {
      errors.push('วันที่เผยแพร่ (publishedDate) ต้องเป็นรูปแบบ YYYY-MM-DD ที่ถูกต้อง');
    }
  }

  // ตรวจสอบ description (1-2000 ตัวอักษร)
  if (!isUpdate || data.description !== undefined) {
    if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
      errors.push('คำอธิบาย (description) ห้ามเป็นค่าว่าง');
    } else if (data.description.trim().length < 1 || data.description.trim().length > 2000) {
      errors.push('คำอธิบายต้องมีความยาวระหว่าง 1 ถึง 2,000 ตัวอักษร');
    }
  }

  // ตรวจสอบ status (ต้องเป็น boolean หรือ string boolean)
  if (data.status !== undefined && typeof data.status !== 'boolean') {
    if (data.status !== 'true' && data.status !== 'false') {
      errors.push('สถานะ (status) ต้องเป็น Boolean (true/false)');
    }
  }

  return errors;
};

// 1. GET /api/learning-resources (ดึงทั้งหมด พร้อม Search title บางส่วน + Filter category)
exports.getAllResources = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const whereConditions = {};

    // ค้นหา title บางส่วน (Case-Insensitive ด้วย Op.like หรือ Op.iLike)
    if (search && search.trim() !== '') {
      whereConditions.title = { [Op.like]: `%${search.trim()}%` };
    }

    // กรองหมวดหมู่
    if (category && category.trim() !== '' && category !== 'ทั้งหมด') {
      whereConditions.category = category.trim();
    }

    // กรองสถานะ (ถ้ามี)
    if (status !== undefined && status !== '') {
      whereConditions.status = status === 'true';
    }

    const resources = await LearningResource.findAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    console.error('Error in getAllResources:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ขณะดึงข้อมูล',
      error: error.message
    });
  }
};

// 2. GET /api/learning-resources/:id (อ่านรายละเอียด 1 รายการ)
exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await LearningResource.findByPk(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสื่อการเรียนรู้รหัส ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error in getResourceById:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: error.message
    });
  }
};

// 3. POST /api/learning-resources (เพิ่มข้อมูลใหม่ พร้อมตรวจสอบ 400 Bad Request)
exports.createResource = async (req, res) => {
  try {
    const { title, creator, category, publishedDate, description, status } = req.body;

    // ตรวจสอบ Validation
    const errors = validateResourceInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลที่ส่งมาไม่ถูกต้องตามเงื่อนไข (Bad Request)',
        errors: errors
      });
    }

    const newResource = await LearningResource.create({
      title: title.trim(),
      creator: creator.trim(),
      category: category.trim(),
      publishedDate,
      description: description.trim(),
      status: status !== undefined ? Boolean(status) : true
    });

    return res.status(201).json({
      success: true,
      message: 'เพิ่มสื่อการเรียนรู้สำเร็จ',
      data: newResource
    });
  } catch (error) {
    console.error('Error in createResource:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors.map(err => err.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      error: error.message
    });
  }
};

// 4. PUT /api/learning-resources/:id (แก้ไขข้อมูล)
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await LearningResource.findByPk(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสื่อการเรียนรู้รหัส ID: ${id} ที่ต้องการแก้ไข`
      });
    }

    // ตรวจสอบ Validation ข้อมูลที่ส่งมาอัปเดต
    const errors = validateResourceInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลที่ส่งมาไม่ถูกต้องตามเงื่อนไข (Bad Request)',
        errors: errors
      });
    }

    const { title, creator, category, publishedDate, description, status } = req.body;

    await resource.update({
      title: title !== undefined ? title.trim() : resource.title,
      creator: creator !== undefined ? creator.trim() : resource.creator,
      category: category !== undefined ? category.trim() : resource.category,
      publishedDate: publishedDate !== undefined ? publishedDate : resource.publishedDate,
      description: description !== undefined ? description.trim() : resource.description,
      status: status !== undefined ? Boolean(status) : resource.status
    });

    return res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลสื่อการเรียนรู้สำเร็จ',
      data: resource
    });
  } catch (error) {
    console.error('Error in updateResource:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors.map(err => err.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
      error: error.message
    });
  }
};

// 5. DELETE /api/learning-resources/:id (ลบข้อมูล)
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await LearningResource.findByPk(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสื่อการเรียนรู้รหัส ID: ${id} ที่ต้องการลบ`
      });
    }

    const deletedTitle = resource.title;
    await resource.destroy();

    return res.status(200).json({
      success: true,
      message: `ลบสื่อการเรียนรู้ "${deletedTitle}" สำเร็จ`,
      deletedId: Number(id)
    });
  } catch (error) {
    console.error('Error in deleteResource:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
      error: error.message
    });
  }
};
