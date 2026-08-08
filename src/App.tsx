import React, { useState, useEffect, useMemo } from 'react';
import { User, Todo, FilterState, TodoStats, Priority, Status, DueFilter } from './types';
import {
  initializeStorage,
  getCurrentUser,
  getUsers,
  getTodosByUserId,
  saveTodo,
  deleteTodoInStorage,
  updateTodoStatusInStorage,
  setCurrentUserInStorage,
  isOverdue,
  isDueToday,
} from './utils/storage';
import { AuthView } from './components/AuthView';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { TodoFilters } from './components/TodoFilters';
import { TodoCard } from './components/TodoCard';
import { TodoModal } from './components/TodoModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast, ToastMessage } from './components/Toast';
import { Plus, CheckCircle2, ListTodo, Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    priority: 'All',
    dueFilter: 'All',
    sortBy: 'created_at_desc',
  });

  // Modals & UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deleteConfirmTodo, setDeleteConfirmTodo] = useState<Todo | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize storage & auth on mount
  useEffect(() => {
    initializeStorage();
    const users = getUsers();
    setAllUsers(users);

    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      loadUserTodos(savedUser.id);
    } else if (users.length > 0) {
      // Default auto-select first user for smooth initial preview
      setCurrentUser(users[0]);
      setCurrentUserInStorage(users[0]);
      loadUserTodos(users[0].id);
    }
  }, []);

  const loadUserTodos = (userId: string) => {
    const list = getTodosByUserId(userId);
    setTodos(list);
  };

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      text,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setAllUsers(getUsers());
    loadUserTodos(user.id);
    addToast(`ยินดีต้อนรับคุณ ${user.name}`, 'info');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserInStorage(null);
    setTodos([]);
    addToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setCurrentUserInStorage(user);
    loadUserTodos(user.id);
    addToast(`สลับการใช้งานเป็น ${user.name}`, 'info');
  };

  // Filter and Sort Todos logic
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'All') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Due Date filter
    if (filters.dueFilter !== 'All') {
      if (filters.dueFilter === 'Overdue') {
        result = result.filter((t) => isOverdue(t.due_date, t.status));
      } else if (filters.dueFilter === 'Today') {
        result = result.filter((t) => isDueToday(t.due_date));
      } else if (filters.dueFilter === 'Upcoming') {
        result = result.filter((t) => {
          if (!t.due_date || t.status === 'Done') return false;
          return !isOverdue(t.due_date, t.status) && !isDueToday(t.due_date);
        });
      } else if (filters.dueFilter === 'NoDueDate') {
        result = result.filter((t) => !t.due_date);
      }
    }

    // Sort logic
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'due_date_asc': {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        case 'due_date_desc': {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        }
        case 'priority_desc': {
          const priorityWeight: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        case 'priority_asc': {
          const priorityWeight: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        }
        case 'title_asc':
          return a.title.localeCompare(b.title, 'th');
        default:
          return 0;
      }
    });

    return result;
  }, [todos, filters]);

  // Statistics
  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const todo = todos.filter((t) => t.status === 'Todo').length;
    const inProgress = todos.filter((t) => t.status === 'In Progress').length;
    const done = todos.filter((t) => t.status === 'Done').length;
    const overdue = todos.filter((t) => isOverdue(t.due_date, t.status)).length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, todo, inProgress, done, overdue, completionRate };
  }, [todos]);

  // CRUD Handlers
  const handleSaveTodo = (
    todoData: Omit<Todo, 'id' | 'created_at' | 'updated_at'> & { id?: string }
  ) => {
    if (!currentUser) return;

    const saved = saveTodo({ ...todoData, user_id: currentUser.id });
    loadUserTodos(currentUser.id);

    if (todoData.id) {
      addToast('แก้ไข Todo สำเร็จ', 'success');
    } else {
      addToast('เพิ่ม Todo ใหม่เรียบร้อยแล้ว', 'success');
    }
  };

  const handleStatusChange = (todoId: string, newStatus: Status) => {
    if (!currentUser) return;
    const success = updateTodoStatusInStorage(todoId, currentUser.id, newStatus);
    if (success) {
      loadUserTodos(currentUser.id);
      addToast(`อัปเดตสถานะเป็น "${newStatus === 'Done' ? 'เสร็จแล้ว' : newStatus === 'In Progress' ? 'กำลังทำ' : 'รอดำเนินการ'}"`, 'info');
    }
  };

  const handleDeleteConfirm = () => {
    if (!currentUser || !deleteConfirmTodo) return;
    const success = deleteTodoInStorage(deleteConfirmTodo.id, currentUser.id);
    if (success) {
      loadUserTodos(currentUser.id);
      addToast('ลบรายการ Todo สำเร็จ', 'error');
    } else {
      addToast('ไม่สามารถลบ Todo ได้ (คุณไม่ใช่เจ้าของงาน)', 'error');
    }
    setDeleteConfirmTodo(null);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      dueFilter: 'All',
      sortBy: 'created_at_desc',
    });
  };

  // Render Login view if unauthenticated
  if (!currentUser) {
    return (
      <>
        <AuthView onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        onOpenCreateModal={() => {
          setEditingTodo(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Top welcome banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>สวัสดีคุณ {currentUser.name}</span>
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {stats.overdue > 0 ? (
                <span className="text-rose-400 font-semibold">
                  ⚠️ คุณมีงานที่เลยกำหนดวันครบกำหนด {stats.overdue} รายการ ควรตรวจสอบและเร่งดำเนินการ!
                </span>
              ) : (
                'ยินดีต้อนรับสู่แดชบอร์ดจัดการงาน ตรวจสอบสถิติและอัปเดตสถานะงานประจำวันได้ที่นี่'
              )}
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>สร้าง Todo ใหม่</span>
          </button>
        </div>

        {/* Overview Dashboard Statistics Cards */}
        <DashboardStats
          stats={stats}
          selectedStatusFilter={filters.status}
          onSelectStatusFilter={(status) => setFilters((prev) => ({ ...prev, status: status as Status | 'All' }))}
          selectedDueFilter={filters.dueFilter}
          onSelectDueFilter={(dueFilter) => setFilters((prev) => ({ ...prev, dueFilter: dueFilter as DueFilter }))}
        />

        {/* Filter Controls Bar */}
        <TodoFilters
          filters={filters}
          onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
          onResetFilters={handleResetFilters}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          totalFilteredCount={filteredTodos.length}
        />

        {/* Todo List / Grid Render */}
        {filteredTodos.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                currentUserId={currentUser.id}
                onEdit={(t) => {
                  setEditingTodo(t);
                  setIsModalOpen(true);
                }}
                onDeleteRequest={(t) => setDeleteConfirmTodo(t)}
                onStatusChange={handleStatusChange}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
              <ListTodo className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">
                {todos.length === 0 ? 'ยังไม่มีรายการ Todo ใดๆ' : 'ไม่พบ Todo ที่ตรงกับเงื่อนไขการค้นหา'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {todos.length === 0
                  ? 'เริ่มต้นบันทึกงานแรกของคุณโดยกดปุ่ม "สร้าง Todo ใหม่" ได้ทันที'
                  : 'ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองเพื่อดูรายการทั้งหมด'}
              </p>
            </div>
            {todos.length === 0 ? (
              <button
                onClick={() => {
                  setEditingTodo(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่ม Todo งานแรก</span>
              </button>
            ) : (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>ระบบจัดการงาน Todo List — พัฒนาด้วย React & Tailwind CSS</p>
      </footer>

      {/* Create / Edit Todo Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        initialData={editingTodo}
        currentUserId={currentUser.id}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmTodo}
        title="ยืนยันการลบรายการ Todo"
        message={`คุณแน่ใจหรือไม่ที่จะลบงาน "${deleteConfirmTodo?.title}"? เมื่อลบแล้วจะไม่สามารถกู้คืนกลับมาได้`}
        confirmText="ลบรายการนี้"
        cancelText="ยกเลิก"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmTodo(null)}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
