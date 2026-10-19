# ข้อสอบปลายภาค: กลุ่มที่ 5 สื่อการเรียนรู้ (Learning Resources)
**รหัสนักศึกษา:** 674259004  
**วิชา:** การพัฒนาเว็บแอปพลิเคชันแบบฟูลสแต็ก (Fullstack Web Application Development)

---

## 📌 ภาพรวมโปรเจกต์ (Project Overview)
ระบบจัดการสื่อการเรียนรู้ (Learning Resources Management System) พัฒนาด้วยสถาปัตยกรรม Fullstack แยกส่วนระหว่าง **Backend (Node.js/Express + Sequelize)** และ **Frontend (React + Vite)** ตามมาตรฐาน RESTful API ครอบคลุมการทำงาน CRUD, ระบบค้นหาข้อมูล (Search) และตัวกรองหมวดหมู่ (Filter) ตามข้อกำหนดโจทย์กลุ่มที่ 5 อย่างครบถ้วน 100%

---

## 📂 โครงสร้างโฟลเดอร์ของโปรเจกต์ (Project Structure)
```text
D:\674259004_7153403_Final_5/
├── backend/
│   ├── config/
│   │   └── db.js                        # คอนฟิกฐานข้อมูล Sequelize (รองรับ Render และ Local)
│   ├── controller/
│   │   └── learningResourceController.js # การทำงาน CRUD, Validation และ Search/Filter
│   ├── model/
│   │   └── LearningResource.js           # โครงสร้าง Model Sequelize ตาม Schema
│   ├── router/
│   │   └── learningResourceRouter.js     # การผูก Endpoints กับ Controller
│   ├── .env                             # ไฟล์ Environment variables
│   ├── .env.example                     # ตัวอย่างการตั้งค่า Environment variables
│   ├── index.js                         # จุดเริ่มต้นของ Express Server และเชื่อมต่อ DB
│   ├── nodemon.json                     # ตั้งค่า Nodemon watch
│   ├── package.json                     # รายการ Dependencies และ Scripts
│   └── seed.js                          # สคริปต์ Mock Data ตัวอย่าง 10 รายการ
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDeleteModal.jsx   # Modal ยืนยันการลบ แสดงชื่อรายการ
│   │   │   ├── ResourceDetailModal.jsx  # Modal แสดงรายละเอียดครบทุกฟิลด์
│   │   │   ├── ResourceForm.jsx         # ฟอร์มเพิ่ม/แก้ไข พร้อม Validation
│   │   │   └── ResourceTable.jsx        # ตารางแสดงผลข้อมูลและสถานะ Badge
│   │   ├── pages/
│   │   │   └── HomePage.jsx             # หน้าหลักรวม Search, Filter, Stats, Modals
│   │   ├── services/
│   │   │   └── api.js                   # API Client Service (Axios)
│   │   ├── App.css                      # สไตล์ของระบบ UI
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                             # VITE_API_URL
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                      # การตั้งค่า Rewrite สำหรับ SPA บน Vercel
│   └── vite.config.js
└── README.md
```

---

## 🗄️ โครงสร้างฐานข้อมูล (Sequelize Model Schema)

| ฟิลด์ | ชนิดข้อมูล (Data Type) | ข้อกำหนด (Constraints & Rules) |
|---|---|---|
| `id` | `INTEGER` | Primary Key, Auto Increment |
| `title` | `STRING(150)` | AllowNull: false (ห้ามเป็นช่องว่างเปล่า, 1-150 ตัวอักษร) |
| `creator` | `STRING(100)` | AllowNull: false (ชื่อผู้สร้าง, 1-100 ตัวอักษร) |
| `category` | `STRING(50)` | AllowNull: false (เฉพาะ: 'บทความ', 'วิดีโอ', 'แบบฝึกหัด') |
| `publishedDate` | `DATEONLY` | AllowNull: false (รูปแบบ YYYY-MM-DD) |
| `description` | `TEXT` | AllowNull: false (1 ถึง 2,000 ตัวอักษร) |
| `status` | `BOOLEAN` | AllowNull: false, Default: true (true = เผยแพร่, false = ฉบับร่าง) |
| `createdAt` | `DATE` | Sequelize สร้างให้อัตโนมัติ |
| `updatedAt` | `DATE` | Sequelize สร้างให้อัตโนมัติ |

---

## 🚀 วิธีติดตั้งและสั่งรันระบบบนเครื่อง Local

### ขั้นตอนที่ 1: ติดตั้งและรัน Backend
```bash
# 1. เข้าสู่โฟลเดอร์ backend
cd backend

# 2. ติดตั้ง Dependencies
npm install

# 3. นำเข้าข้อมูลตัวอย่าง (Mock Data 10 รายการ)
npm run seed

# 4. สั่งรันเซิร์ฟเวอร์สำหรับ Development (Nodemon)
npm run dev
```
*Backend จะพร้อมทำงานที่ `http://localhost:10000`*

---

### ขั้นตอนที่ 2: ติดตั้งและรัน Frontend
```bash
# 1. เปิด Terminal ใหม่แล้วเข้าสู่โฟลเดอร์ frontend
cd frontend

# 2. ติดตั้ง Dependencies
npm install

# 3. สั่งรันหน้าเว็บ Frontend
npm run dev
```
*เปิดเว็บเบราว์เซอร์ไปที่ `http://localhost:5173` เพื่อเข้าใช้งานระบบ*

---

## 🌐 รายการ RESTful API Endpoints

### 1. ค้นหาและดึงรายการสื่อการเรียนรู้ทั้งหมด (GET)
- **Endpoint:** `GET /api/learning-resources`
- **Query Parameters:**
  - `search` (ค้นหาชื่อสื่อบางส่วน เช่น `?search=React`)
  - `category` (กรองหมวดหมู่ เช่น `?category=บทความ`)
  - `status` (กรองสถานะ เช่น `?status=true`)
- **ตัวอย่างการเรียก:** `GET http://localhost:10000/api/learning-resources?search=React&category=บทความ`
- **ตัวอย่างผลตอบรับ (Response 200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 4,
      "title": "คู่มือการใช้งาน React Hooks: useState และ useEffect ให้เชี่ยวชาญ",
      "creator": "พงศกร โค้ดดิ้งสตูดิโอ",
      "category": "บทความ",
      "publishedDate": "2026-02-20",
      "description": "เจาะลึกการทำงานของ State และ Lifecycle ใน Modern React ผ่านการใช้งาน Hooks พื้นฐาน...",
      "status": true,
      "createdAt": "2026-02-20T10:00:00.000Z",
      "updatedAt": "2026-02-20T10:00:00.000Z"
    }
  ]
}
```

---

### 2. ดูรายละเอียดสื่อการเรียนรู้ 1 รายการ (GET by ID)
- **Endpoint:** `GET /api/learning-resources/:id`
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "พื้นฐานการเขียนเว็บด้วย HTML5 และ CSS3 สำหรับผู้เริ่มต้น",
    "creator": "อาจารย์สมชาย ใจดี",
    "category": "บทความ",
    "publishedDate": "2026-01-15",
    "description": "บทความแนะนำพื้นฐานโครงสร้างภาษา HTML5 แท็กสำคัญ...",
    "status": true,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  }
}
```
- **Response 404 Not Found (กรณีไม่พบ ID):**
```json
{
  "success": false,
  "message": "ไม่พบสื่อการเรียนรู้รหัส ID: 999"
}
```

---

### 3. เพิ่มสื่อการเรียนรู้ใหม่ (POST)
- **Endpoint:** `POST /api/learning-resources`
- **Request Body:**
```json
{
  "title": "เจาะลึก Docker Container สำหรับ Web Developer",
  "creator": "สมศักดิ์ ชำนาญการ",
  "category": "วิดีโอ",
  "publishedDate": "2026-04-15",
  "description": "เรียนรู้วิธีการเขียน Dockerfile, Docker Compose และการจัดการ Container เบื้องต้น",
  "status": true
}
```
- **Response 201 Created:**
```json
{
  "success": true,
  "message": "เพิ่มสื่อการเรียนรู้สำเร็จ",
  "data": {
    "id": 11,
    "title": "เจาะลึก Docker Container สำหรับ Web Developer",
    "creator": "สมศักดิ์ ชำนาญการ",
    "category": "วิดีโอ",
    "publishedDate": "2026-04-15",
    "description": "เรียนรู้วิธีการเขียน Dockerfile, Docker Compose และการจัดการ Container เบื้องต้น",
    "status": true,
    "createdAt": "2026-04-15T12:00:00.000Z",
    "updatedAt": "2026-04-15T12:00:00.000Z"
  }
}
```
- **Response 400 Bad Request (กรณีข้อมูลไม่ผ่านเงื่อนไข):**
```json
{
  "success": false,
  "message": "ข้อมูลที่ส่งมาไม่ถูกต้องตามเงื่อนไข (Bad Request)",
  "errors": [
    "หมวดหมู่ (category) ต้องเป็น 'บทความ', 'วิดีโอ' หรือ 'แบบฝึกหัด' เท่านั้น"
  ]
}
```

---

### 4. แก้ไขข้อมูลสื่อการเรียนรู้ (PUT)
- **Endpoint:** `PUT /api/learning-resources/:id`
- **Request Body:**
```json
{
  "title": "คู่มือการใช้งาน React Hooks ฉบับปรับปรุง 2026",
  "status": false
}
```
- **Response 200 OK:**
```json
{
  "success": true,
  "message": "แก้ไขข้อมูลสื่อการเรียนรู้สำเร็จ",
  "data": {
    "id": 4,
    "title": "คู่มือการใช้งาน React Hooks ฉบับปรับปรุง 2026",
    "status": false,
    "updatedAt": "2026-04-16T09:30:00.000Z"
  }
}
```

---

### 5. ลบสื่อการเรียนรู้ (DELETE)
- **Endpoint:** `DELETE /api/learning-resources/:id`
- **Response 200 OK:**
```json
{
  "success": true,
  "message": "ลบสื่อการเรียนรู้ \"เจาะลึก Docker Container สำหรับ Web Developer\" สำเร็จ",
  "deletedId": 11
}
```

---

## ☁️ แนวทางการนำขึ้นระบบจริง (Deployment Guide)

### 1. นำ Backend ขึ้น Render (Web Service)
1. นำโค้ดขึ้น GitHub Repository
2. สร้าง **PostgreSQL Database** บน Render
3. สร้าง **Web Service** บน Render:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. ตั้งค่า **Environment Variables**:
   - `DATABASE_URL` = ค่า External Database URL จาก PostgreSQL Database บน Render
   - `PORT` = `10000`
   - `NODE_ENV` = `production`

### 2. นำ Frontend ขึ้น Vercel
1. Import โครงการจาก GitHub เข้าสู่ Vercel
2. ตั้งค่า **Root Directory:** `frontend`
3. ตั้งค่า **Build Command:** `npm run build`
4. ตั้งค่า **Output Directory:** `dist`
5. เพิ่ม **Environment Variable:**
   - `VITE_API_URL` = `https://<your-render-backend-url>/api/learning-resources`
6. ไฟล์ `frontend/vercel.json` ได้เตรียมกฎ Rewrite สำหรับ SPA React Router ไว้เรียบร้อยแล้ว
