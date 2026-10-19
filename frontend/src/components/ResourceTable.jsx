import React from 'react';
import { Eye, Edit3, Trash2, CheckCircle2, FileEdit, Calendar, User, BookOpen } from 'lucide-react';

const ResourceTable = ({ resources, onView, onEdit, onDelete }) => {
  // ฟังก์ชันเลือกสไตล์สีของ Badge หมวดหมู่
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

  // กรณีไม่มีข้อมูล
  if (!resources || resources.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <BookOpen size={32} />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-700">ไม่พบข้อมูลสื่อการเรียนรู้</h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          ลองปรับเปลี่ยนคำค้นหา ปรับตัวกรองหมวดหมู่ หรือกดปุ่ม "เพิ่มสื่อการเรียนรู้ใหม่" ด้านบน
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. MOBILE VIEW (หน้าจอ < 768px): แสดงเป็นการ์ด Responsive Cards   */}
      {/* ============================================================== */}
      <div className="block md:hidden divide-y divide-slate-100">
        {resources.map((item, index) => (
          <div key={item.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition">
            {/* หัวการ์ด: ลำดับ, หมวดหมู่ และสถานะ */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  #{index + 1}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getCategoryBadge(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <div>
                {item.status ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={12} /> เผยแพร่
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-dashed border-slate-300">
                    <FileEdit size={12} /> ฉบับร่าง
                  </span>
                )}
              </div>
            </div>

            {/* ชื่อสื่อการเรียนรู้และคำอธิบายย่อ */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* ข้อมูลประกอบ: ผู้สร้าง และวันที่ */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5 truncate">
                <User size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{item.creator}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span>{item.publishedDate}</span>
              </div>
            </div>

            {/* ปุ่มกดจัดการสำหรับหน้าจอมือถือ (ขนาดปุ่มสัมผัสง่าย) */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onView(item)}
                className="flex-1 py-2 px-3 text-xs font-medium text-blue-700 bg-blue-50 active:bg-blue-100 rounded-lg flex items-center justify-center gap-1 transition"
              >
                <Eye size={14} />
                <span>ดู</span>
              </button>
              <button
                onClick={() => onEdit(item)}
                className="flex-1 py-2 px-3 text-xs font-medium text-amber-700 bg-amber-50 active:bg-amber-100 rounded-lg flex items-center justify-center gap-1 transition"
              >
                <Edit3 size={14} />
                <span>แก้ไข</span>
              </button>
              <button
                onClick={() => onDelete(item)}
                className="flex-1 py-2 px-3 text-xs font-medium text-rose-700 bg-rose-50 active:bg-rose-100 rounded-lg flex items-center justify-center gap-1 transition"
              >
                <Trash2 size={14} />
                <span>ลบ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. TABLET / DESKTOP VIEW (หน้าจอ >= 768px): แสดงผลเป็นตารางพร้อม Scrollable */}
      {/* ========================================================================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-14">#</th>
              <th className="py-3.5 px-4">ชื่อสื่อการเรียนรู้</th>
              <th className="py-3.5 px-4 w-32">หมวดหมู่</th>
              <th className="py-3.5 px-4 w-36">ผู้สร้าง</th>
              <th className="py-3.5 px-4 w-32">วันที่เผยแพร่</th>
              <th className="py-3.5 px-4 text-center w-28">สถานะ</th>
              <th className="py-3.5 px-4 text-center w-32">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {resources.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition duration-150">
                <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                  {index + 1}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800 line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium border ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {item.creator}
                </td>
                <td className="py-3.5 px-4 text-slate-500 text-xs">
                  {item.publishedDate}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {item.status ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={12} /> เผยแพร่
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-dashed border-slate-300">
                      <FileEdit size={12} /> ฉบับร่าง
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100"
                      title="ดูรายละเอียด"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition border border-transparent hover:border-amber-100"
                      title="แก้ไข"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100"
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
