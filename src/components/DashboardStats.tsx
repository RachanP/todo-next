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
      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Total Tasks */}
        <button
          onClick={() => {
            onSelectStatusFilter('All');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'All' && selectedDueFilter === 'All'
              ? 'bg-slate-800 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
              : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">งานทั้งหมด</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>ภาพรวมงาน</span>
            <span className="text-slate-500">100%</span>
          </div>
        </button>

        {/* Todo Tasks */}
        <button
          onClick={() => {
            onSelectStatusFilter('Todo');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'Todo'
              ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
              : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">รอดำเนินการ</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.todo}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.total > 0 ? Math.round((stats.todo / stats.total) * 100) : 0}% ของงานทั้งหมด
          </div>
        </button>

        {/* In Progress Tasks */}
        <button
          onClick={() => {
            onSelectStatusFilter('In Progress');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'In Progress'
              ? 'bg-slate-800 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/50'
              : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">กำลังทำ</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-400">{stats.inProgress}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% ของงานทั้งหมด
          </div>
        </button>

        {/* Done Tasks */}
        <button
          onClick={() => {
            onSelectStatusFilter('Done');
            onSelectDueFilter('All');
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            selectedStatusFilter === 'Done'
              ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
              : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">เสร็จแล้ว</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.done}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            อัตราสำเร็จ {stats.completionRate}%
          </div>
        </button>

        {/* Overdue Tasks */}
        <button
          onClick={() => {
            onSelectDueFilter('Overdue');
          }}
          className={`p-4 rounded-xl text-left border transition-all col-span-2 sm:col-span-1 ${
            selectedDueFilter === 'Overdue'
              ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/50'
              : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-300">เลยกำหนด (Overdue)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400">{stats.overdue}</div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            {stats.overdue > 0 ? 'ต้องการการแก้ไขด่วน!' : 'ไม่มีงานค้างเลยกำหนด'}
          </div>
        </button>

      </div>

      {/* Completion Progress Bar */}
      {stats.total > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 w-full sm:w-auto">
            <span className="font-semibold text-slate-200">ความคืบหน้ารวม:</span>
            <span className="text-emerald-400 font-bold">{stats.done} จาก {stats.total} งาน</span>
          </div>

          <div className="w-full sm:w-1/2 bg-slate-700/80 rounded-full h-2.5 overflow-hidden flex">
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

          <div className="text-slate-400 hidden lg:block text-[11px]">
            ความสำเร็จภาพรวม: <span className="text-slate-200 font-bold">{stats.completionRate}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
