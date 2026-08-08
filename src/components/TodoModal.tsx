import React, { useState, useEffect } from 'react';
import { Todo, Priority, Status } from '../types';
import { X, Save, AlertCircle, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: Omit<Todo, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
  initialData?: Todo | null;
  currentUserId: string;
}

const CATEGORIES = ['งานบริษัท', 'โปรเจกต์', 'ส่วนตัว', 'การเงิน', 'การเรียน', 'สุขภาพ', 'ทั่วไป'];

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentUserId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ทั่วไป');
  const [status, setStatus] = useState<Status>('Todo');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'ทั่วไป');
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setDueDate(initialData.due_date || '');
    } else {
      // Defaults for new Todo as specified in business rules
      setTitle('');
      setDescription('');
      setCategory('ทั่วไป');
      setStatus('Todo'); // Default status: Todo
      setPriority('Medium'); // Default priority: Medium
      setDueDate('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Business Rule Check: Title must not be empty
    if (!title.trim()) {
      setError('ชื่องานต้องไม่ว่างเปล่า (กรุณากรอกชื่องาน)');
      return;
    }

    onSave({
      id: initialData?.id,
      title: title.trim(),
      description: description.trim(),
      category: category,
      status: status,
      priority: priority,
      due_date: dueDate,
      user_id: currentUserId,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">
              {initialData ? 'แก้ไขรายการ Todo' : 'สร้างรายการ Todo ใหม่'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่องาน (Title) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="เช่น ประชุมวางแผนประจำสัปดาห์..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>หมวดหมู่ (Category)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>รายละเอียดงาน (Description)</span>
            </label>
            <textarea
              rows={3}
              placeholder="ระบุรายละเอียดเพิ่มเติม ลิ้งก์ หรือสิ่งที่ต้องเตรียม..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                สถานะ (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Todo">รอดำเนินการ (Todo)</option>
                <option value="In Progress">กำลังทำ (In Progress)</option>
                <option value="Done">เสร็จแล้ว (Done)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ระดับความสำคัญ (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="High">สูง (High)</option>
                <option value="Medium">ปานกลาง (Medium)</option>
                <option value="Low">ต่ำ (Low)</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>วันครบกำหนด (Due Date)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'บันทึกการแก้ไข' : 'สร้าง Todo ใหม่'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
