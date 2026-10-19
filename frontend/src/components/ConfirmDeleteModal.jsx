import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, resourceTitle, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-auto p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header & Warning Icon */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            ยืนยันการลบสื่อการเรียนรู้
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            คุณแน่ใจหรือไม่ว่าต้องการลบสื่อการเรียนรู้นี้ออกจากระบบ?
          </p>

          <div className="p-3.5 bg-rose-50/60 border-l-4 border-rose-500 rounded-r-xl my-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 break-words line-clamp-3">
              "{resourceTitle}"
            </p>
          </div>

          <p className="text-xs text-rose-600 font-medium">
            ⚠️ เมื่อลบแล้ว ข้อมูลจะไม่สามารถกู้คืนกลับมาได้
          </p>
        </div>

        {/* Action Buttons (Mobile: full-width column, Tablet+: row) */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-medium text-sm transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl font-medium text-sm shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'กำลังลบ...' : 'ยืนยันลบข้อมูล'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
