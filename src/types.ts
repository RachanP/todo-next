export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Todo' | 'In Progress' | 'Done';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  due_date: string; // ISO date string YYYY-MM-DD
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  user_id: string;
  category?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
}

export type DueFilter = 'All' | 'Overdue' | 'Today' | 'Upcoming' | 'NoDueDate';

export interface FilterState {
  search: string;
  status: Status | 'All';
  priority: Priority | 'All';
  dueFilter: DueFilter;
  sortBy: 
    | 'created_at_desc'
    | 'created_at_asc'
    | 'due_date_asc'
    | 'due_date_desc'
    | 'priority_desc'
    | 'priority_asc'
    | 'title_asc';
}

export interface TodoStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  completionRate: number;
}
