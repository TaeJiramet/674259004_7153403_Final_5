import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const ResourceForm = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    category: 'บทความ',
    publishedDate: new Date().toISOString().split('T')[0],
    description: '',
    status: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        creator: initialData.creator || '',
        category: initialData.category || 'บทความ',
        publishedDate: initialData.publishedDate || new Date().toISOString().split('T')[0],
        description: initialData.description || '',
        status: initialData.status !== undefined ? Boolean(initialData.status) : true
      });
    } else {
      setFormData({
        title: '',
        creator: '',
        category: 'บทความ',
        publishedDate: new Date().toISOString().split('T')[0],
        description: '',
        status: true
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    const validCategories = ['บทความ', 'วิดีโอ', 'แบบฝึกหัด'];

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'กรุณาระบุชื่อสื่อการเรียนรู้ (ห้ามเป็นช่องว่างเปล่า)';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'ชื่อสื่อการเรียนรู้ต้องไม่เกิน 150 ตัวอักษร';
    }

    if (!formData.creator || formData.creator.trim() === '') {
      newErrors.creator = 'กรุณาระบุชื่อผู้สร้าง';
    } else if (formData.creator.trim().length > 100) {
      newErrors.creator = 'ชื่อผู้สร้างต้องไม่เกิน 100 ตัวอักษร';
    }

    if (!formData.category || !validCategories.includes(formData.category)) {
      newErrors.category = "หมวดหมู่ต้องเป็น 'บทความ', 'วิดีโอ' หรือ 'แบบฝึกหัด'";
    }

    if (!formData.publishedDate) {
      newErrors.publishedDate = 'กรุณาระบุวันที่เผยแพร่';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'กรุณากรอกคำอธิบายสื่อการเรียนรู้';
    } else if (formData.description.trim().length < 1 || formData.description.trim().length > 2000) {
      newErrors.description = 'คำอธิบายต้องมีความยาว 1 ถึง 2,000 ตัวอักษร';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            {initialData ? '✏️ แก้ไขสื่อการเรียนรู้' : '➕ เพิ่มสื่อการเรียนรู้ใหม่'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm">
          
          {/* ชื่อสื่อการเรียนรู้ */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-700">
              ชื่อสื่อการเรียนรู้ (Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ระบุชื่อสื่อการเรียนรู้ (ไม่เกิน 150 ตัวอักษร)"
              maxLength={150}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.title 
                  ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle size={13} /> {errors.title}
              </p>
            )}
          </div>

          {/* แถว 2: ผู้สร้าง และ หมวดหมู่ (Mobile: 1 column, Tablet+: 2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                ผู้สร้าง (Creator) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                placeholder="ชื่ออาจารย์ หรือผู้จัดทำ"
                maxLength={100}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                  errors.creator 
                    ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.creator && (
                <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle size={13} /> {errors.creator}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                หมวดหมู่ (Category) <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              >
                <option value="บทความ">บทความ</option>
                <option value="วิดีโอ">วิดีโอ</option>
                <option value="แบบฝึกหัด">แบบฝึกหัด</option>
              </select>
              {errors.category && (
                <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle size={13} /> {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* แถว 3: วันที่เผยแพร่ และ สถานะ (Mobile: 1 column, Tablet+: 2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                วันที่เผยแพร่ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              {errors.publishedDate && (
                <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle size={13} /> {errors.publishedDate}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                สถานะการแสดงผล
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  {formData.status ? '🟢 เผยแพร่ทันที (Published)' : '🟡 ฉบับร่าง (Draft)'}
                </span>
              </label>
            </div>
          </div>

          {/* คำอธิบายเนื้อหา (Description) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-medium text-slate-700">
                คำอธิบายเนื้อหา (Description) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {formData.description.length} / 2,000 ตัวอักษร
              </span>
            </div>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
              placeholder="ระบุรายละเอียดเนื้อหาของสื่อการเรียนรู้นี้ (1 - 2,000 ตัวอักษร)"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.description 
                  ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            ></textarea>
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle size={13} /> {errors.description}
              </p>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-medium transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'กำลังบันทึก...' : initialData ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
