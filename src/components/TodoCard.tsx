import React, { useState } from 'react';
import { Todo, Priority, Status } from '../types';
import { isOverdue, isDueToday, formatThaiDate, formatThaiDateTime } from '../utils/storage';
import { Calendar, AlertCircle, Edit3, Trash2, CheckCircle, Clock, PlayCircle, Tag, MoreVertical } from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  currentUserId: string;
  onEdit: (todo: Todo) => void;
  onDeleteRequest: (todo: Todo) => void;
  onStatusChange: (todoId: string, newStatus: Status) => void;
  viewMode: 'grid' | 'list';
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  currentUserId,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  viewMode,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const isOwner = todo.user_id === currentUserId;
  const overdue = isOverdue(todo.due_date, todo.status);
  const dueToday = isDueToday(todo.due_date);

  // Status color & badge mapping
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'Done':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          label: 'เสร็จแล้ว',
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        };
      case 'In Progress':
        return {
          bg: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
          dot: 'bg-sky-400',
          label: 'กำลังทำ',
          icon: <PlayCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
        };
      case 'Todo':
      default:
        return {
          bg: 'bg-slate-700/50 border-slate-600/50 text-slate-300',
          dot: 'bg-slate-400',
          label: 'รอดำเนินการ',
          icon: <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />,
        };
    }
  };

  // Priority badge mapping
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          label: 'สูง (High)',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          label: 'ปานกลาง (Medium)',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-slate-700/40 border-slate-600/40 text-slate-400',
          label: 'ต่ำ (Low)',
        };
    }
  };

  const statusBadge = getStatusBadge(todo.status);
  const priorityBadge = getPriorityBadge(todo.priority);

  if (viewMode === 'list') {
    return (
      <div className={`p-4 bg-slate-800/80 hover:bg-slate-800 border rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        overdue ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-700/80'
      }`}>
        {/* Left main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
            {/* Status pill button */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${statusBadge.bg}`}
              >
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </button>

              {/* Status quick switch menu */}
              {showStatusMenu && (
                <div
                  className="absolute left-0 mt-1 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-30 text-xs"
                  onMouseLeave={() => setShowStatusMenu(false)}
                >
                  {(['Todo', 'In Progress', 'Done'] as Status[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onStatusChange(todo.id, st);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-700 text-slate-200 flex items-center justify-between ${
                        todo.status === st ? 'font-bold text-indigo-400' : ''
                      }`}
                    >
                      <span>{st === 'Todo' ? 'รอดำเนินการ' : st === 'In Progress' ? 'กำลังทำ' : 'เสร็จแล้ว'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority */}
            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${priorityBadge.bg}`}>
              {priorityBadge.label}
            </span>

            {/* Category Tag */}
            {todo.category && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400 text-[11px] flex items-center space-x-1">
                <Tag className="w-3 h-3 text-slate-500" />
                <span>{todo.category}</span>
              </span>
            )}

            {/* Overdue Badge */}
            {overdue && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[11px] flex items-center space-x-1 animate-pulse">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span>เลยกำหนด (Overdue)</span>
              </span>
            )}
          </div>

          <h3 className={`text-sm sm:text-base font-semibold text-slate-100 ${
            todo.status === 'Done' ? 'line-through text-slate-400' : ''
          }`}>
            {todo.title}
          </h3>

          {todo.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}
        </div>

        {/* Right date & actions */}
        <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
          
          <div className="text-right text-xs">
            {todo.due_date ? (
              <div className={`flex items-center space-x-1 ${
                overdue ? 'text-rose-400 font-bold' : dueToday ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}>
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formatThaiDate(todo.due_date)}</span>
              </div>
            ) : (
              <span className="text-slate-500 italic">ไม่มี Due Date</span>
            )}
          </div>

          {/* Buttons */}
          {isOwner && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(todo)}
                className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 transition-colors"
                title="แก้ไข Todo"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDeleteRequest(todo)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                title="ลบ Todo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    );
  }

  // Grid Card View
  return (
    <div className={`bg-slate-800/90 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl group relative ${
      overdue
        ? 'border-rose-500/60 bg-gradient-to-b from-rose-950/20 to-slate-800/90'
        : 'border-slate-700/80 hover:border-slate-600'
    }`}>
      <div>
        {/* Top bar: Category + Overdue or Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            {/* Status badge button */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${statusBadge.bg}`}
              >
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </button>

              {/* Status Switcher Menu */}
              {showStatusMenu && (
                <div
                  className="absolute left-0 mt-1 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-30 text-xs"
                  onMouseLeave={() => setShowStatusMenu(false)}
                >
                  {(['Todo', 'In Progress', 'Done'] as Status[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onStatusChange(todo.id, st);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-700 text-slate-200 flex items-center justify-between ${
                        todo.status === st ? 'font-bold text-indigo-400' : ''
                      }`}
                    >
                      <span>{st === 'Todo' ? 'รอดำเนินการ' : st === 'In Progress' ? 'กำลังทำ' : 'เสร็จแล้ว'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority */}
            <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium ${priorityBadge.bg}`}>
              {priorityBadge.label}
            </span>
          </div>

          {/* Action buttons */}
          {isOwner && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(todo)}
                className="p-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 transition-colors"
                title="แก้ไข"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onDeleteRequest(todo)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                title="ลบ"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Overdue Warning Flag */}
        {overdue && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>เลยวันครบกำหนดแล้ว! (Overdue)</span>
          </div>
        )}

        {/* Title */}
        <h3 className={`text-base font-bold text-slate-100 mb-2 leading-snug ${
          todo.status === 'Done' ? 'line-through text-slate-400' : ''
        }`}>
          {todo.title}
        </h3>

        {/* Description */}
        {todo.description && (
          <p className="text-xs text-slate-300/80 leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">
            {todo.description}
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
        
        {/* Category */}
        <div className="flex items-center space-x-1 text-slate-400">
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-medium">{todo.category || 'ทั่วไป'}</span>
        </div>

        {/* Due Date */}
        <div className={`flex items-center space-x-1.5 ${
          overdue ? 'text-rose-400 font-bold' : dueToday ? 'text-amber-400 font-semibold' : 'text-slate-300'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{todo.due_date ? formatThaiDate(todo.due_date) : 'ไม่มี Due Date'}</span>
        </div>

      </div>
    </div>
  );
};
