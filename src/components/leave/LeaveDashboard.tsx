import React from 'react';
import { CalendarHeart, CalendarCheck, Clock, CalendarDays, List } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';

interface LeaveDashboardProps {
  onNavigateTab: (tab: 'list') => void;
}

export function LeaveDashboard({ onNavigateTab }: LeaveDashboardProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <NeuCard className="p-5">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Total Pengajuan Cuti</h6>
          <h3 className="text-3xl font-bold text-emerald-500 mb-0">24</h3>
          <small className="text-neu-muted font-medium">Keseluruhan riwayat</small>
        </NeuCard>
        
        <NeuCard className="p-5">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Cuti Pending</h6>
          <h3 className="text-3xl font-bold text-amber-500 mb-0">5</h3>
          <small className="text-neu-muted font-medium">Menunggu verifikasi atasan</small>
        </NeuCard>

        <NeuCard className="p-5">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Cuti Disetujui</h6>
          <h3 className="text-3xl font-bold text-blue-500 mb-0">19</h3>
          <small className="text-neu-muted font-medium">Aktif berjalan</small>
        </NeuCard>
      </div>

      <NeuCard className="p-6 md:p-8">
        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarHeart className="text-emerald-500" size={24} /> 
          Manajemen Ketidakhadiran & Cuti Operasional
        </h5>
        <p className="text-neu-muted text-sm leading-relaxed mb-6 max-w-4xl">
          Modul Pengajuan Cuti memastikan alur permohonan cuti tahunan, cuti sakit, dan izin khusus karyawan tercatat rapi, terstruktur, dan dapat dipantau langsung oleh bagian SDM maupun supervisor terkait.
        </p>
        <NeuButton variant="success" onClick={() => onNavigateTab('list')} className="py-2.5 px-5">
          <List size={18} className="mr-2" /> Buka Daftar Tabel Cuti
        </NeuButton>
      </NeuCard>
    </div>
  );
}