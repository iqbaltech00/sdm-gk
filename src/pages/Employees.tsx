import React, { useState } from 'react';
import { Users, Plus, Power } from 'lucide-react';
import { NeuButton } from '../components/ui/NeuButton';
import { EmployeeDashboard } from '../components/employees/EmployeeDashboard';
import { EmployeeList } from '../components/employees/EmployeeList';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { ReRegistrationTab } from '../components/employees/ReRegistrationTab';
import { ApplicantTab } from '../components/employees/ApplicantTab';
import { useAuthStore } from '../store/authStore';

export function Employees() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'rereg' | 'pelamar'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const { role } = useAuthStore();

  const handleTutupGiling = () => {
    if (confirm('Apakah Anda yakin ingin melakukan Tutup Giling Massal? Seluruh karyawan PKWT akan dinonaktifkan.')) {
      alert('Simulasi: Tutup Giling dieksekusi!');
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b border-black/5 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="text-blue-500" /> Database Karyawan
          </h1>
          <p className="text-neu-muted text-sm m-0">Pusat kendali master data, PKWT, dokumen arsip, dan pelamar</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['asman_sdm', 'admin_sdm', 'admin_bagian'].includes(role) && (
            <NeuButton variant="danger" onClick={handleTutupGiling}>
              <Power size={18} className="mr-1" /> Tutup Giling Massal
            </NeuButton>
          )}
          {['admin_bagian', 'asman_sdm', 'admin_sdm'].includes(role) && (
            <NeuButton variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={18} className="mr-1" /> Tambah Karyawan
            </NeuButton>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <NeuButton 
          variant="default"
          className={activeTab === 'dashboard' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard Karyawan
        </NeuButton>
        <NeuButton 
          variant="default"
          className={activeTab === 'master' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('master')}
        >
          Master Karyawan
        </NeuButton>
        <NeuButton 
          variant="default"
          className={activeTab === 'rereg' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('rereg')}
        >
          Re-Registrasi PKWT
        </NeuButton>
        <NeuButton 
          variant="default"
          className={activeTab === 'pelamar' ? 'text-blue-600 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]' : ''}
          onClick={() => setActiveTab('pelamar')}
        >
          Database Pelamar
        </NeuButton>
      </div>

      {activeTab === 'dashboard' && <EmployeeDashboard onNavigateTab={setActiveTab as any} />}
      {activeTab === 'master' && <EmployeeList />}
      {activeTab === 'rereg' && <ReRegistrationTab />}
      {activeTab === 'pelamar' && <ApplicantTab />}

      {showForm && <EmployeeFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}