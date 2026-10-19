import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, RotateCcw, BookOpen, Layers, 
  AlertCircle, CheckCircle2, Loader2, FileCheck 
} from 'lucide-react';

import api from '../services/api';
import ResourceTable from '../components/ResourceTable';
import ResourceForm from '../components/ResourceForm';
import ResourceDetailModal from '../components/ResourceDetailModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const HomePage = () => {
  // State หลักของข้อมูล
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // State ค้นหาและกรองหมวดหมู่
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ทั้งหมด');

  // State จัดการ Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailResource, setDetailResource] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingResource, setDeletingResource] = useState(null);

  // State การส่งข้อมูล / ลบ
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // แจ้งเตือน Toast ชั่วคราว (3.5 วินาที)
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // ดึงข้อมูลจาก Backend API
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getResources(search, categoryFilter);
      setResources(res.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Backend ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์รันอยู่ที่พอร์ต 10000 หรือไม่');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  // ค้นหาแบบ Debounce 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchResources]);

  // ล้างการค้นหาและฟิลเตอร์
  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('ทั้งหมด');
  };

  // เปิด Modal เพิ่มข้อมูล
  const handleOpenCreate = () => {
    setEditingResource(null);
    setIsFormOpen(true);
  };

  // เปิด Modal แก้ไขข้อมูล
  const handleOpenEdit = (item) => {
    setEditingResource(item);
    setIsFormOpen(true);
  };

  // เปิด Modal ดูรายละเอียด
  const handleOpenDetail = (item) => {
    setDetailResource(item);
    setIsDetailOpen(true);
  };

  // เปิด Modal ยืนยันการลบ
  const handleOpenDelete = (item) => {
    setDeletingResource(item);
    setIsDeleteOpen(true);
  };

  // บันทึกฟอร์ม (Create หรือ Update)
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingResource) {
        await api.updateResource(editingResource.id, formData);
        showToast(`แก้ไขสื่อ "${formData.title}" เรียบร้อยแล้ว`, 'success');
      } else {
        await api.createResource(formData);
        showToast(`เพิ่มสื่อ "${formData.title}" สำเร็จเรียบร้อย`, 'success');
      }
      setIsFormOpen(false);
      fetchResources();
    } catch (err) {
      console.error('Submit error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      alert(`บันทึกไม่สำเร็จ: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ยืนยันการลบข้อมูล
  const handleDeleteConfirm = async () => {
    if (!deletingResource) return;
    try {
      setIsDeleting(true);
      await api.deleteResource(deletingResource.id);
      showToast(`ลบสื่อ "${deletingResource.title}" เรียบร้อยแล้ว`, 'success');
      setIsDeleteOpen(false);
      setDeletingResource(null);
      fetchResources();
    } catch (err) {
      console.error('Delete error:', err);
      alert(`ลบไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // คำนวณสรุปสถิติ
  const totalCount = resources.length;
  const publishedCount = resources.filter(r => r.status).length;
  const draftCount = resources.filter(r => !r.status).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Toast Notification Alert (Responsive Mobile & Desktop) */}
      {notification && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 text-white text-sm font-medium transition duration-200 ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
          <span className="flex-1">{notification.message}</span>
        </div>
      )}

      {/* Main Header / Navigation Bar (Mobile: Column, Desktop: Row) */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* โลโก้และชื่อระบบ */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 shadow-inner">
                <BookOpen size={26} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                  ระบบจัดการสื่อการเรียนรู้ (Learning Resources)
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 font-normal">
                  ข้อสอบปลายภาค - กลุ่มที่ 5 สื่อการเรียนรู้ | รหัสนักศึกษา 674259004
                </p>
              </div>
            </div>

            {/* ปุ่มเพิ่มสื่อใหม่ (Mobile: กว้างเต็มหน้าจอ, Desktop: ปุ่มขนาดมาตรฐาน) */}
            <button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Plus size={18} />
              <span>เพิ่มสื่อการเรียนรู้ใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* การ์ดสรุปสถิติ (Stats Cards: Mobile: 1 คอลัมน์, Tablet: 2 คอลัมน์, Desktop: 3 คอลัมน์) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">สื่อทั้งหมดในระบบ</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{totalCount} รายการ</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">เผยแพร่แล้ว</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{publishedCount} รายการ</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileCheck size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">ฉบับร่าง (ยังไม่เผยแพร่)</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{draftCount} รายการ</h3>
            </div>
          </div>
        </section>

        {/* แผงค้นหาและตัวกรองหมวดหมู่ (Search & Filter Bar: Mobile: Column, Desktop: Row) */}
        <section className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* ช่องค้นหา (Search Input) */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาตามชื่อสื่อการเรียนรู้ (Title)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* ตัวกรองหมวดหมู่และปุ่มล้างตัวกรอง */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-44 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                >
                  <option value="ทั้งหมด">📁 ทุกหมวดหมู่</option>
                  <option value="บทความ">📄 บทความ</option>
                  <option value="วิดีโอ">🎬 วิดีโอ</option>
                  <option value="แบบฝึกหัด">📝 แบบฝึกหัด</option>
                </select>
              </div>

              {(search || categoryFilter !== 'ทั้งหมด') && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw size={15} />
                  <span>ล้างตัวกรอง</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* กล่องแจ้งเตือน Error */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-800 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchResources}
              className="px-3.5 py-1.5 bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold rounded-lg shrink-0 transition"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* ส่วนตารางและรายการสื่อ (Table / Card Container) */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Loader2 size={36} className="animate-spin mx-auto text-blue-600" />
              <p className="text-sm">กำลังโหลดข้อมูลสื่อการเรียนรู้...</p>
            </div>
          ) : (
            <ResourceTable
              resources={resources}
              onView={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          )}
        </section>
      </main>

      {/* Main Footer */}
      <footer className="mt-auto py-6 px-4 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-600">ข้อสอบปลายภาค 2568 - กลุ่มที่ 5 สื่อการเรียนรู้ (learning_resources)</p>
        <p>Fullstack Application: Express.js + Sequelize + PostgreSQL / React 18 + Vite + Tailwind CSS</p>
      </footer>

      {/* Modals สำหรับเพิ่ม/แก้ไข, ดูรายละเอียด และยืนยันการลบ */}
      <ResourceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingResource}
        isSubmitting={isSubmitting}
      />

      <ResourceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        resource={detailResource}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceTitle={deletingResource?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default HomePage;
