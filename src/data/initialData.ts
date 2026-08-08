import { User, Todo } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-001',
    username: 'somchai',
    name: 'สมชาย วิเศษโสภา',
    email: 'somchai@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-002',
    username: 'sunisa',
    name: 'สุนิสา สุขใจ',
    email: 'sunisa@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];

// Helper to generate dynamic ISO date string offsets in YYYY-MM-DD format
const getOffsetDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TODOS: Todo[] = [
  {
    id: 'todo-101',
    title: 'ส่งรายงานสรุปยอดขายประจำไตรมาส 3',
    description: 'รวบรวมข้อมูลยอดขายจากทีมการตลาดและฝ่ายบัญชีเพื่อทำสไลด์นำเสนอผู้บริหาร',
    status: 'In Progress',
    priority: 'High',
    due_date: getOffsetDate(-2), // Overdue!
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    user_id: 'user-001',
    category: 'งานบริษัท',
  },
  {
    id: 'todo-102',
    title: 'ประชุมตรวจรับงานออกแบบ UX/UI เว็บไซต์ใหม่',
    description: 'นัดหมายกับเอเจนซี่เพื่อรีวิว Feedback หน้า Dashboard และ Mobile View',
    status: 'Todo',
    priority: 'High',
    due_date: getOffsetDate(0), // Today!
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    user_id: 'user-001',
    category: 'โปรเจกต์',
  },
  {
    id: 'todo-103',
    title: 'นัดตรวจสุขภาพประจำปี ที่โรงพยาบาล',
    description: 'งดน้ำและอาหารหลัง 20:00 น. ก่อนวันตรวจ นำผลตรวจปีที่แล้วไปด้วย',
    status: 'Todo',
    priority: 'Medium',
    due_date: getOffsetDate(3), // Upcoming
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    user_id: 'user-001',
    category: 'ส่วนตัว',
  },
  {
    id: 'todo-104',
    title: 'ชำระค่าบริการอินเทอร์เน็ตและไฟฟ้า',
    description: 'จ่ายผ่านแอปพลิเคชันธนาคารพร้อมเก็บสลิปยืนยัน',
    status: 'Done',
    priority: 'Low',
    due_date: getOffsetDate(-1),
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-001',
    category: 'การเงิน',
  },
  {
    id: 'todo-105',
    title: 'ซื้อหนังสือเตรียมสอบบทเรียนภาษาอังกฤษ',
    description: 'สั่งซื้อหนังสือออนไลน์จากร้านซีเอ็ด หรือเดินทางไปซื้อที่ห้างสรรพสินค้า',
    status: 'Todo',
    priority: 'Low',
    due_date: getOffsetDate(7),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-001',
    category: 'การเรียน',
  },
  {
    id: 'todo-201',
    title: 'จัดทำม็อคอัพป้ายโฆษณาแคมเปญวันแม่',
    description: 'ออกแบบโทนสีฟ้าอ่อน พร้อมข้อความโปรโมชั่นพิเศษส่วนลด 20%',
    status: 'In Progress',
    priority: 'High',
    due_date: getOffsetDate(1),
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-002',
    category: 'ดีไซน์',
  },
  {
    id: 'todo-202',
    title: 'อัปเดตระบบคลังสินค้าออนไลน์',
    description: 'เช็คจำนวนสินค้าคงเหลือในสต็อกและแก้ไขราคาในระบบ',
    status: 'Todo',
    priority: 'Medium',
    due_date: getOffsetDate(4),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-002',
    category: 'งานระบบ',
  },
];
