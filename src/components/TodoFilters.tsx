import React from 'react';
import { FilterState, Priority, Status, DueFilter } from '../types';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, RotateCcw, X } from 'lucide-react';

interface TodoFiltersProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  totalFilteredCount: number;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onToggleViewMode,
  totalFilteredCount,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.dueFilter !== 'All';

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="ค้นหา Todo จากชื่องาน หรือรายละเอียด..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-9 py-2 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0 justify-end">
          
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs flex items-center space-x-1.5 transition-colors border border-slate-300 dark:border-slate-600/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}

          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="แสดงแบบการ์ด (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="แสดงแบบตารางรายการ (List)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>สถานะ (Status)</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as Status | 'All' })}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">ทุกสถานะ</option>
            <option value="Todo">รอดำเนินการ (Todo)</option>
            <option value="In Progress">กำลังทำ (In Progress)</option>
            <option value="Done">เสร็จแล้ว (Done)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>ความสำคัญ (Priority)</span>
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value as Priority | 'All' })}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">ทุกระดับความสำคัญ</option>
            <option value="High">สูง (High)</option>
            <option value="Medium">ปานกลาง (Medium)</option>
            <option value="Low">ต่ำ (Low)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>กำหนดวัน (Due Date)</span>
          </label>
          <select
            value={filters.dueFilter}
            onChange={(e) => onFilterChange({ dueFilter: e.target.value as DueFilter })}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">ทุกช่วงเวลา</option>
            <option value="Overdue">เลยกำหนดแล้ว (Overdue)</option>
            <option value="Today">ครบกำหนดวันนี้ (Today)</option>
            <option value="Upcoming">เร็วๆ นี้ (Upcoming)</option>
            <option value="NoDueDate">ไม่ระบุ Due Date</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center space-x-1">
            <ArrowUpDown className="w-3 h-3" />
            <span>เรียงลำดับตาม (Sort By)</span>
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="created_at_desc">วันที่สร้าง (ใหม่ล่าสุด)</option>
            <option value="created_at_asc">วันที่สร้าง (เก่าที่สุด)</option>
            <option value="due_date_asc">วันครบกำหนด (เร็วสุดก่อน)</option>
            <option value="due_date_desc">วันครบกำหนด (ช้าสุดก่อน)</option>
            <option value="priority_desc">ระดับความสำคัญ (สูงไปต่ำ)</option>
            <option value="priority_asc">ระดับความสำคัญ (ต่ำไปสูง)</option>
            <option value="title_asc">ชื่องาน (ก-ฮ / A-Z)</option>
          </select>
        </div>

      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/50">
        <span>
          แสดงผล <strong className="text-slate-900 dark:text-slate-200">{totalFilteredCount}</strong> รายการ
        </span>
        {isFiltered && (
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">กำลังเปิดใช้งานตัวกรองค้นหา</span>
        )}
      </div>

    </div>
  );
};
