import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Users, Clock, CalendarDays, LogOut, Menu } from 'lucide-react';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInset } from '../components/ui/NeuCard';

export function DashboardLayout() {
  const navigate = useNavigate();
  // TODO: Sambungkan ke auth store global (misal Zustand/Context)
  const [role] = useState('Asman SDM'); 

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard Global', icon: LayoutDashboard },
    { path: '/employees', label: 'Database Karyawan', icon: Users },
    { path: '/overtime', label: 'Controlling Lembur', icon: Clock },
    { path: '/leave', label: 'Pengajuan Cuti', icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/40 shadow-[4px_0_12px_#b8c2d1] px-4 py-5 bg-neu-bg">
        <div className="text-center pb-4 mb-4 border-b border-black/5">
          <h4 className="font-bold text-gray-900 flex items-center justify-center gap-2">
            <ShieldAlert className="text-neu-primary" /> SGN HR App
          </h4>
          <small className="text-neu-muted">Unit Pabrik Gula</small>
        </div>

        <NeuInset className="p-3 mb-6">
          <div className="flex justify-between items-center mb-2">
            <small className="text-neu-muted">Akun Login:</small>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium">
              <LogOut size={14} /> Logout
            </button>
          </div>
          <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Role: {role}
          </span>
        </NeuInset>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive 
                    ? 'text-neu-primary shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' 
                    : 'text-neu-muted hover:text-neu-primary hover:shadow-[4px_4px_10px_#b8c2d1,-4px_-4px_10px_#ffffff]'
                }`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 shadow-[0_4px_10px_#b8c2d1] bg-neu-bg">
          <div className="flex items-center gap-2">
            <NeuButton className="p-2"><Menu size={20} /></NeuButton>
            <span className="font-bold flex items-center gap-1"><ShieldAlert size={16} className="text-neu-primary"/> SGN HR</span>
          </div>
          <NeuButton onClick={handleLogout} className="p-2 text-red-500"><LogOut size={18} /></NeuButton>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full p-2 flex justify-around items-center bg-neu-bg shadow-[0_-4px_10px_#b8c2d1] z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-neu-primary' : 'text-neu-muted'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}