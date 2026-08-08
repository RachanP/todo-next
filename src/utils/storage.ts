import { Todo, User } from '../types';
import { INITIAL_TODOS, INITIAL_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'todo_app_users_v1',
  CURRENT_USER: 'todo_app_current_user_v1',
  TODOS: 'todo_app_todos_v1',
};

// Initialize default storage data if not present
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TODOS)) {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(INITIAL_TODOS));
  }
};

// Users management
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setCurrentUserInStorage = (user: User | null): void => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
};

export const registerUser = (username: string, name: string, email: string): { success: boolean; user?: User; error?: string } => {
  const users = getUsers();
  const cleanUsername = username.trim().toLowerCase();

  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' };
  }
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { success: false, error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username: cleanUsername,
    name: name.trim(),
    email: email.trim(),
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  setCurrentUserInStorage(newUser);
  return { success: true, user: newUser };
};

// Todos Management
export const getAllTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TODOS);
    return data ? JSON.parse(data) : INITIAL_TODOS;
  } catch {
    return INITIAL_TODOS;
  }
};

export const getTodosByUserId = (userId: string): Todo[] => {
  const all = getAllTodos();
  return all.filter((todo) => todo.user_id === userId);
};

export const saveTodo = (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Todo => {
  const allTodos = getAllTodos();
  const now = new Date().toISOString();

  if (todo.id) {
    // Edit existing
    const existingIndex = allTodos.findIndex((t) => t.id === todo.id);
    if (existingIndex >= 0) {
      const updatedTodo: Todo = {
        ...allTodos[existingIndex],
        ...todo,
        updated_at: now,
      };
      allTodos[existingIndex] = updatedTodo;
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(allTodos));
      return updatedTodo;
    }
  }

  // Create new
  const newTodo: Todo = {
    id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: todo.title,
    description: todo.description || '',
    status: todo.status || 'Todo',
    priority: todo.priority || 'Medium',
    due_date: todo.due_date || '',
    created_at: now,
    updated_at: now,
    user_id: todo.user_id,
    category: todo.category || 'ทั่วไป',
  };

  const updatedList = [newTodo, ...allTodos];
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(updatedList));
  return newTodo;
};

export const deleteTodoInStorage = (todoId: string, userId: string): boolean => {
  const allTodos = getAllTodos();
  const target = allTodos.find((t) => t.id === todoId);

  // Business rule: User can only delete their own Todo
  if (!target || target.user_id !== userId) {
    return false;
  }

  const filtered = allTodos.filter((t) => t.id !== todoId);
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(filtered));
  return true;
};

export const updateTodoStatusInStorage = (todoId: string, userId: string, newStatus: Todo['status']): boolean => {
  const allTodos = getAllTodos();
  const targetIndex = allTodos.findIndex((t) => t.id === todoId && t.user_id === userId);

  if (targetIndex === -1) return false;

  allTodos[targetIndex].status = newStatus;
  allTodos[targetIndex].updated_at = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(allTodos));
  return true;
};

// Date & Overdue Helper
export const isOverdue = (dueDateStr: string, status: Todo['status']): boolean => {
  if (!dueDateStr || status === 'Done') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDateStr.split('-').map(Number);
  if (!year || !month || !day) return false;

  const dueDate = new Date(year, month - 1, day);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

export const isDueToday = (dueDateStr: string): boolean => {
  if (!dueDateStr) return false;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return dueDateStr === todayStr;
};

export const formatThaiDate = (dateStr: string): string => {
  if (!dateStr) return 'ไม่ได้ระบุ';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;

    const date = new Date(year, month - 1, day);
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const thaiYear = year + 543;
    return `${day} ${monthsThai[date.getMonth()]} ${thaiYear}`;
  } catch {
    return dateStr;
  }
};

export const formatThaiDateTime = (isoString: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const thaiYear = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${date.getDate()} ${monthsThai[date.getMonth()]} ${thaiYear} (${hours}:${mins} น.)`;
  } catch {
    return isoString;
  }
};
