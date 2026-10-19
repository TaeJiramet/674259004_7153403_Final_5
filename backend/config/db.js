const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // สำหรับเชื่อมต่อบน Cloud เช่น Render (PostgreSQL Connection String พร้อม SSL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // จำเป็นสำหรับการเชื่อมต่อ PostgreSQL บน Render
      }
    }
  });
} else if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
  // สำหรับเชื่อมต่อ Local PostgreSQL / MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: process.env.DB_DIALECT || 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
  );
} else {
  // Fallback เป็น SQLite ภายในเครื่องหากไม่มีการระบุ Database Config
  console.log('⚠️ ไม่พบการตั้งค่า Database - สลับไปใช้ SQLite ชั่วคราว (database.sqlite)');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
