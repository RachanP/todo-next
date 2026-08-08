import React, { useState } from 'react';
import { User } from '../types';
import { CheckCircle2, Plus, LogOut, Users, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  allUsers,
  onOpenCreateModal,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>ระบบจัดการงาน Todo</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ติดตามสถิติสถานะและวันครบกำหนดงาน
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Create New Todo Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">เพิ่ม Todo ใหม่</span>
            <span className="xs:hidden">เพิ่มงาน</span>
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 transition-all"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-600"
              />
              <div className="text-left hidden sm:block pr-1">
                <div className="text-xs font-semibold text-slate-200 leading-none mb-0.5">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-none">
                  @{currentUser.username}
                </div>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-slate-200"
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <div className="px-4 py-2 border-b border-slate-700/80">
                  <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                </div>

                {/* Switch User options */}
                <div className="px-3 py-2">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>สลับผู้ใช้งาน</span>
                  </div>

                  <div className="space-y-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          user.id === currentUser.id
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                            : 'hover:bg-slate-700/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <span className="truncate">{user.name}</span>
                        </div>
                        {user.id === currentUser.id && (
                          <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-700/80 pt-1 mt-1 px-2">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
