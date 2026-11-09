import React, { useState } from 'react';
import { CalendarCheck, Plus } from 'lucide-react';
import { NeuButton } from '../components/ui/NeuButton';
import { LeaveDashboard } from '../components/leave/LeaveDashboard';
import { LeaveList } from '../components/leave/LeaveList';
import { LeaveFormModal } from '../components/leave/LeaveFormModal';

export function Leave() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b border-black/5 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <CalendarCheck className="text-emerald-500" /> Pengajuan Cuti Karyawan
          </h1>
          <p className="text-neu-muted text-sm m-0">Pusat kendali permohonan cuti tahunan, cuti sakit, dan izin operasional pabrik</p>
        </div>
        <NeuButton variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-1" /> Buat Cuti Baru
        </NeuButton>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <NeuButton 
          variant="default"
          className={activeTab === 'dashboard' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard Cuti
        </NeuButton>
        <NeuButton 
          variant="default"
          className={activeTab === 'list' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('list')}
        >
          Daftar Pengajuan Cuti
        </NeuButton>
      </div>

      {activeTab === 'dashboard' && <LeaveDashboard onNavigateTab={setActiveTab} />}
      {activeTab === 'list' && <LeaveList />}

      {showForm && <LeaveFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}