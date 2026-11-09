import React from 'react';
import { Users, UserCheck, UserMinus, AlertCircle, Table2, ClipboardCheck } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';

interface EmployeeDashboardProps {
  onNavigateTab: (tab: 'master' | 'rereg' | 'pelamar') => void;
}

export function EmployeeDashboard({ onNavigateTab }: EmployeeDashboardProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Total Karyawan</h6>
          <h2 className="text-2xl font-bold text-blue-500 mb-0">324</h2>
          <small className="text-neu-muted">Keseluruhan database unit</small>
        </NeuCard>
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Karyawan Aktif</h6>
          <h2 className="text-2xl font-bold text-emerald-500 mb-0">310</h2>
          <small className="text-neu-muted">Siap bertugas operasional</small>
        </NeuCard>
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">PKWT Gilingan</h6>
          <h2 className="text-2xl font-bold text-amber-500 mb-0">145</h2>
          <small className="text-neu-muted">Musim Giling LMG/DMG</small>
        </NeuCard>
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Kasus SP Berjalan</h6>
          <h2 className="text-2xl font-bold text-red-500 mb-0">2</h2>
          <small className="text-neu-muted">Dalam pembinaan SDM</small>
        </NeuCard>
      </div>

      <NeuCard className="p-6">
        <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="text-blue-500" size={20} /> Ringkasan Eksekutif Sumber Daya Manusia
        </h5>
        <p className="text-neu-muted text-sm mb-4">
          Menu Database Karyawan mengelola seluruh siklus hidup pekerja pabrik gula mulai dari rekrutmen pelamar baru, verifikasi berkas re-registrasi SKCK & bebas narkoba untuk re-entry PKWT, mutasi antar stasiun atau antar PG, hingga penerbitan Surat Peringatan (SP) dan cetak riwayat histori kepegawaian berbentuk PDF.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <NeuButton variant="primary" onClick={() => onNavigateTab('master')}>
            <Table2 size={18} className="mr-2" /> Buka Master Karyawan
          </NeuButton>
          <NeuButton variant="success" onClick={() => onNavigateTab('rereg')}>
            <ClipboardCheck size={18} className="mr-2" /> Cek Re-Registrasi PKWT
          </NeuButton>
        </div>
      </NeuCard>
    </div>
  );
}