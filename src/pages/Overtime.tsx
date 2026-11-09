import React, { useState } from 'react';
import { Clock, Plus } from 'lucide-react';
import { NeuButton } from '../components/ui/NeuButton';
import { OvertimeDashboard } from '../components/overtime/OvertimeDashboard';
import { OvertimeList } from '../components/overtime/OvertimeList';
import { OvertimeAnalyticsTab } from '../components/overtime/OvertimeAnalyticsTab';
import { OvertimePolicyTab } from '../components/overtime/OvertimePolicyTab';
import { OvertimeFormModal } from '../components/overtime/OvertimeFormModal';
import { useAuthStore } from '../store/authStore';

export function Overtime() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'analytics' | 'policy'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const { role } = useAuthStore();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b border-black/5 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Clock className="text-red-500" /> Controlling Lembur & SPL
          </h1>
          <p className="text-neu-muted text-sm m-0">Pengajuan SPL, AI Fraud Risk Scanner, & Cetak SPL 5 TTD Digital</p>
        </div>
        <NeuButton variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-1" /> Buat SPL Baru
        </NeuButton>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <NeuButton 
          variant="default" 
          className={activeTab === 'dashboard' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard Lembur
        </NeuButton>
        <NeuButton 
          variant="default" 
          className={activeTab === 'list' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('list')}
        >
          Daftar & Tracking SPL
        </NeuButton>
        <NeuButton 
          variant="default" 
          className={activeTab === 'analytics' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analisis & Biaya
        </NeuButton>
        
        {/* Tab Kebijakan hanya relevan jika role memiliki akses Konfigurasi */}
        {['asman_sdm', 'admin_sdm', 'manager_keuangan', 'gm'].includes(role) && (
          <NeuButton 
            variant="default" 
            className={activeTab === 'policy' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
            onClick={() => setActiveTab('policy')}
          >
            Kebijakan & Kalender
          </NeuButton>
        )}
      </div>

      {activeTab === 'dashboard' && <OvertimeDashboard onNavigateTab={setActiveTab as any} />}
      {activeTab === 'list' && <OvertimeList />}
      {activeTab === 'analytics' && <OvertimeAnalyticsTab />}
      {activeTab === 'policy' && <OvertimePolicyTab />}

      {showForm && <OvertimeFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}