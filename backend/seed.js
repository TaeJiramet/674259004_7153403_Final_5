const sequelize = require('./config/db');
const LearningResource = require('./model/LearningResource');

const mockData = [
  {
    title: 'พื้นฐานการเขียนเว็บด้วย HTML5 และ CSS3 สำหรับผู้เริ่มต้น',
    creator: 'อาจารย์สมชาย ใจดี',
    category: 'บทความ',
    publishedDate: '2026-01-15',
    description: 'บทความแนะนำพื้นฐานโครงสร้างภาษา HTML5 แท็กสำคัญ และการจัดเลย์เอาต์หน้าเว็บด้วย CSS Flexbox และ CSS Grid พร้อมตัวอย่างโค้ดและรูปภาพประกอบอย่างละเอียด เหมาะสำหรับผู้ที่ต้องการเริ่มต้นเป็น Front-end Developer',
    status: true
  },
  {
    title: 'สอนสร้าง RESTful API ด้วย Node.js และ Express แบบ Step-by-Step',
    creator: 'กิตติพงษ์ พัฒนาการ',
    category: 'วิดีโอ',
    publishedDate: '2026-02-01',
    description: 'วิดีโอความยาว 2 ชั่วโมงเต็ม พาทำตั้งแต่เริ่มต้นติดตั้ง Node.js, Express, เชื่อมต่อฐานข้อมูล Sequelize, การจัดการ Routing, Middleware, และการทำ CRUD Operations ครบทุกกระบวนการ',
    status: true
  },
  {
    title: 'แบบฝึกหัดทบทวนคำสั่ง JavaScript ES6+ พร้อมเฉลยละเอียด',
    creator: 'ดร.วรรณภา สุขสวัสดิ์',
    category: 'แบบฝึกหัด',
    publishedDate: '2026-02-10',
    description: 'ชุดแบบฝึกหัด 25 ข้อ สำหรับทดสอบความเข้าใจเกี่ยวกับ Arrow Functions, Destructuring, Promises, Async/Await และ Array Methods (map, filter, reduce) พร้อมคำอธิบายเฉลยทุกข้อ',
    status: true
  },
  {
    title: 'คู่มือการใช้งาน React Hooks: useState และ useEffect ให้เชี่ยวชาญ',
    creator: 'พงศกร โค้ดดิ้งสตูดิโอ',
    category: 'บทความ',
    publishedDate: '2026-02-20',
    description: 'เจาะลึกการทำงานของ State และ Lifecycle ใน Modern React ผ่านการใช้งาน Hooks พื้นฐานที่ต้องรู้ หลีกเลี่ยงข้อผิดพลาด Infinite Loop และการจัดการ Side Effect อย่างมีประสิทธิภาพ',
    status: true
  },
  {
    title: 'วิดีโอบรรยาย: สถาปัตยกรรม Microservices กับ Container Docker',
    creator: 'ธีรเดช ไอทีทอล์ก',
    category: 'วิดีโอ',
    publishedDate: '2026-03-01',
    description: 'คลิปบรรยายพิเศษอธิบายแนวคิดการออกแบบระบบขนาดใหญ่ด้วย Microservices การสื่อสารระหว่างเซอร์วิส และการใช้ Docker เพื่อจำลองสภาพแวดล้อมและ Deploy ระบบอย่างมีเสถียรภาพ',
    status: false
  },
  {
    title: 'แบบฝึกหัดเขียนคำสั่ง SQL Query: SELECT, JOIN และ GROUP BY',
    creator: 'อาจารย์สมชาย ใจดี',
    category: 'แบบฝึกหัด',
    publishedDate: '2026-03-05',
    description: 'แบบฝึกหัดสำหรับฝึกฝนการเขียนคำสั่งจัดการฐานข้อมูลเชิงสัมพันธ์ ทั้งการค้นหาข้อมูลแบบมีเงื่อนไข การเชื่อมโยงตารางด้วย INNER JOIN, LEFT JOIN และการจัดกลุ่มข้อมูลเพื่อสรุปผลทางสถิติ',
    status: true
  },
  {
    title: 'ความปลอดภัยของเว็บแอปพลิเคชัน: ป้องกัน OWASP Top 10 ฉบับรวบรัด',
    creator: 'ดร.วรรณภา สุขสวัสดิ์',
    category: 'บทความ',
    publishedDate: '2026-03-12',
    description: 'สรุป 10 จุดอ่อนและความเสี่ยงด้านความปลอดภัยยอดนิยม เช่น SQL Injection, Cross-Site Scripting (XSS), และ Broken Authentication พร้อมแนวทางป้องกันในระดับโค้ด',
    status: false
  },
  {
    title: 'สอนสด: การสร้างระบบ Authentication ด้วย JWT ใน Express.js',
    creator: 'กิตติพงษ์ พัฒนาการ',
    category: 'วิดีโอ',
    publishedDate: '2026-03-25',
    description: 'คลิปย้อนหลังการสอนสดระบบยืนยันตัวตนด้วย JSON Web Token (JWT) ตั้งแต่การเข้ารหัสผ่านด้วย bcrypt การส่ง Token กลับไปยัง Client และการทำ Middleware ตรวจสอบสิทธิ์ก่อนเข้าถึง API',
    status: true
  },
  {
    title: 'แบบฝึกหัดทดสอบทักษะ Git & GitHub: Branching, Merging & Pull Request',
    creator: 'พงศกร โค้ดดิ้งสตูดิโอ',
    category: 'แบบฝึกหัด',
    publishedDate: '2026-04-02',
    description: 'สถานการณ์จำลองสำหรับการทำงานร่วมกันเป็นทีมผ่าน Git ตั้งแต่การแตกกิ่ง Feature การสร้าง Pull Request การแก้ปัญหา Merge Conflict และการตั้งค่า GitHub Actions เบื้องต้น',
    status: true
  },
  {
    title: 'คู่มือการเตรียม Deployment Fullstack App บน Vercel และ Render',
    creator: 'ธีรเดช ไอทีทอล์ก',
    category: 'บทความ',
    publishedDate: '2026-04-10',
    description: 'ขั้นตอนการนำระบบ React ขึ้นสู่ Vercel และเชื่อมต่อกับ Express + PostgreSQL Backend บน Render ฟรีและรวดเร็ว พร้อมการตั้งค่า Environment Variables และ CORS ที่ถูกต้อง',
    status: false
  }
];

const seedData = async () => {
  try {
    console.log('🔄 กำลังเชื่อมต่อฐานข้อมูล...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // รีเซ็ตตารางและสร้างใหม่

    console.log('🌱 กำลังนำเข้าข้อมูลตัวอย่าง (Seeding Data)...');
    await LearningResource.bulkCreate(mockData);

    console.log(`✅ นำเข้าข้อมูลตัวอย่างสำเร็จเรียบร้อย (${mockData.length} รายการ)!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการนำเข้าข้อมูลตัวอย่าง:', error);
    process.exit(1);
  }
};

seedData();
