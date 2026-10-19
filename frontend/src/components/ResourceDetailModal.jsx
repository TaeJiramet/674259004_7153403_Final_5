import React from 'react';
import { X, Calendar, User, Folder, Clock, CheckCircle2, FileEdit } from 'lucide-react';

const ResourceDetailModal = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'บทความ':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'วิดีโอ':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'แบบฝึกหัด':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="space-y-1 pr-3">
            <span className="inline-block text-xs font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
              ID: #{resource.id}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {resource.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm">
          
          {/* ข้อมูลสรุป Meta Grid (Mobile: 1 หรือ 2 column, Tablet+: 2 column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <User size={15} className="text-slate-400 shrink-0" />
              <span className="text-slate-400 text-xs sm:text-sm">ผู้สร้าง:</span>
              <span className="font-semibold text-slate-800 truncate">{resource.creator}</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-600">
              <Folder size={15} className="text-slate-400 shrink-0" />
              <span className="text-slate-400 text-xs sm:text-sm">หมวดหมู่:</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getCategoryBadge(resource.category)}`}>
                {resource.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <span className="text-slate-400 text-xs sm:text-sm">วันที่เผยแพร่:</span>
              <span className="font-semibold text-slate-800">{resource.publishedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-slate-400 text-xs sm:text-sm">สถานะ:</span>
              {resource.status ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} /> เผยแพร่แล้ว
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-dashed border-slate-300">
                  <FileEdit size={12} /> ฉบับร่าง
                </span>
              )}
            </div>
          </div>

          {/* รายละเอียดเนื้อหา */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              คำอธิบายเนื้อหา:
            </h3>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
              {resource.description}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>สร้างเมื่อ: {formatDate(resource.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>อัปเดตล่าสุด: {formatDate(resource.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-medium transition text-sm"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;
