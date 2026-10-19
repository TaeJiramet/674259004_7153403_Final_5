const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LearningResource = sequelize.define('LearningResource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notNull: { msg: 'ชื่อสื่อการเรียนรู้ (title) ห้ามเป็นค่าว่าง' },
      notEmpty: { msg: 'ชื่อสื่อการเรียนรู้ (title) ต้องไม่เป็นข้อความว่างเปล่า' },
      len: {
        args: [1, 150],
        msg: 'ชื่อสื่อการเรียนรู้ต้องมีความยาวระหว่าง 1 ถึง 150 ตัวอักษร'
      }
    }
  },
  creator: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'ผู้สร้าง (creator) ห้ามเป็นค่าว่าง' },
      notEmpty: { msg: 'ผู้สร้าง (creator) ต้องไม่เป็นข้อความว่างเปล่า' },
      len: {
        args: [1, 100],
        msg: 'ผู้สร้างต้องมีความยาวระหว่าง 1 ถึง 100 ตัวอักษร'
      }
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: 'หมวดหมู่ (category) ห้ามเป็นค่าว่าง' },
      isIn: {
        args: [['บทความ', 'วิดีโอ', 'แบบฝึกหัด']],
        msg: "หมวดหมู่ต้องเป็น 'บทความ', 'วิดีโอ' หรือ 'แบบฝึกหัด' เท่านั้น"
      }
    }
  },
  publishedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { msg: 'วันที่เผยแพร่ (publishedDate) ห้ามเป็นค่าว่าง' },
      isDate: { msg: 'วันที่เผยแพร่ต้องอยู่ในรูปแบบ YYYY-MM-DD' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'คำอธิบาย (description) ห้ามเป็นค่าว่าง' },
      len: {
        args: [1, 2000],
        msg: 'คำอธิบายต้องมีความยาวระหว่าง 1 ถึง 2,000 ตัวอักษร'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true // true = เผยแพร่, false = ฉบับร่าง
  }
}, {
  tableName: 'learning_resources',
  timestamps: true // สร้าง createdAt และ updatedAt อัตโนมัติ
});

module.exports = LearningResource;
