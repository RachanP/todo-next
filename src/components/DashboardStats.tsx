import React from 'react';
import { TodoStats } from '../types';
import { ListTodo, Clock, CheckCircle2, AlertTriangle, PieChart } from 'lucide-react';

interface DashboardStatsProps {
  stats: TodoStats;
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  selectedDueFilter: string;
  onSelectDueFilter: (dueFilter: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  selectedStatusFilter,
  onSelectStatusFilter,
  selectedDueFilter,
  onSelectDueFilter,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <button
          onClick={() => {
            onSelectStatusFilter('All');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'All' && selectedDueFilter === 'All'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">งานทั้งหมด</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>ภาพรวมงาน</span>
            <span className="text-slate-400 dark:text-slate-500">100%</span>
          </div>
        </button>

        <button
          onClick={() => {
            onSelectStatusFilter('Todo');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'Todo'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">รอดำเนินการ</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.todo}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {stats.total > 0 ? Math.round((stats.todo / stats.total) * 100) : 0}% ของงานทั้งหมด
          </div>
        </button>

        <button
          onClick={() => {
            onSelectStatusFilter('In Progress');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'In Progress'
              ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/50'
              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">กำลังทำ</span>
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.inProgress}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% ของงานทั้งหมด
          </div>
        </button>

        <button
          onClick={() => {
            onSelectStatusFilter('Done');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'Done'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">เสร็จแล้ว</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.done}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            อัตราสำเร็จ {stats.completionRate}%
          </div>
        </button>

        <button
          onClick={() => {
            onSelectDueFilter('Overdue');
          }}
          className={`p-4 rounded-xl text-left border transition-all col-span-2 sm:col-span-1 ${
            selectedDueFilter === 'Overdue'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/50'
              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-300">เลยกำหนด (Overdue)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.overdue}</div>
          <div className="text-[11px] text-rose-600/80 dark:text-rose-300/80 mt-1">
            {stats.overdue > 0 ? 'ต้องการการแก้ไขด่วน!' : 'ไม่มีงานค้างเลยกำหนด'}
          </div>
        </button>

      </div>

      {stats.total > 0 && (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 w-full sm:w-auto">
            <span className="font-semibold text-slate-900 dark:text-slate-200">ความคืบหน้ารวม:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.done} จาก {stats.total} งาน</span>
          </div>

          <div className="w-full sm:w-1/2 bg-slate-100 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
              title="เสร็จแล้ว"
            />
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
              title="กำลังทำ"
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.todo / stats.total) * 100 : 0}%` }}
              title="รอดำเนินการ"
            />
          </div>

          <div className="text-slate-500 dark:text-slate-400 hidden lg:block text-[11px]">
            ความสำเร็จภาพรวม: <span className="text-slate-900 dark:text-slate-200 font-bold">{stats.completionRate}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
