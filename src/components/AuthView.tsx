import React, { useState } from 'react';
import { User } from '../types';
import { getUsers, registerUser, setCurrentUserInStorage } from '../utils/storage';
import { CheckCircle2, LogIn, UserPlus, Shield, Sparkles, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const demoUsers = getUsers();

  const handleDemoLogin = (user: User) => {
    setCurrentUserInStorage(user);
    onLoginSuccess(user);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input = usernameOrEmail.trim().toLowerCase();
    if (!input) {
      setError('กรุณากรอกชื่อผู้ใช้หรืออีเมล');
      return;
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === input || u.email.toLowerCase() === input
    );

    if (found) {
      setCurrentUserInStorage(found);
      onLoginSuccess(found);
    } else {
      setError('ไม่พบชื่อผู้ใช้หรืออีเมลนี้ในระบบ');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regUsername.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้');
      return;
    }
    if (!regName.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    if (!regEmail.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    const res = registerUser(regUsername, regName, regEmail);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 dark:from-indigo-900 dark:via-slate-900 dark:to-slate-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/60">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                Todo Master
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-3 leading-tight">
              จัดการงานและชีวิตของคุณ อย่างเป็นระบบ
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              บันทึก ติดตามสถานะ กำหนดความสำคัญ และไม่พลาดทุกวันครบกำหนดด้วยระบบจัดการ Todo สำหรับบุคคลและองค์กร
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>จำแนกงานตามสถานะ และระดับความสำคัญ</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>แจ้งเตือนงานที่เลยกำหนด (Overdue) โดยอัตโนมัติ</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ค้นหาและกรองงานด้วยตัวกรองประสิทธิภาพสูง</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>บัญชีทดลองเข้าชม (Quick Demo)</span>
            </div>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  type="button"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/60 hover:border-indigo-500/50 transition-all group text-left"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-600"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400">@{user.username}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-slate-800/50">
          
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
              className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === 'login'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ (Login)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setError(null);
              }}
              className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === 'register'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>ลงทะเบียน (Register)</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start space-x-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  ชื่อผู้ใช้ หรือ อีเมล (Username / Email)
                </label>
                <input
                  type="text"
                  placeholder="เช่น somchai หรือ somchai@example.com"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </button>
              </div>

              <div className="text-center pt-3 text-xs text-slate-500 dark:text-slate-400">
                หรือคลิกปุ่มเลือก <span className="text-indigo-600 dark:text-indigo-400 font-medium">บัญชีทดลองเข้าชม</span> ในแถบซ้ายมือเพื่อเข้าใช้งานได้ทันที
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  ชื่อผู้ใช้ (Username) *
                </label>
                <input
                  type="text"
                  placeholder="เช่น somchai_v"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  ชื่อ-นามสกุล (Full Name) *
                </label>
                <input
                  type="text"
                  placeholder="เช่น สมชาย วิเศษโสภา"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  อีเมล (Email) *
                </label>
                <input
                  type="email"
                  placeholder="เช่น somchai@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>สร้างบัญชีผู้ใช้ใหม่</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
