import React from 'react';
import { DollarSign, Clock, LayoutDashboard, UserCheck } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { formatRupiah } from '../../utils/format';

interface OvertimeDashboardProps {
  onNavigateTab: (tab: 'list' | 'analytics') => void;
}

export function OvertimeDashboard({ onNavigateTab }: OvertimeDashboardProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Total Biaya Bulan Ini</h6>
          <h3 className="text-xl font-bold text-red-500 mb-0">{formatRupiah(9550000)}</h3>
          <small className="text-neu-muted">Bulan berjalan</small>
        </NeuCard>
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Total Biaya Tahunan</h6>
          <h3 className="text-xl font-bold text-gray-900 mb-0">{formatRupiah(42300000)}</h3>
          <small className="text-neu-muted">Akumulasi tahun berjalan</small>
        </NeuCard>
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Stasiun Tertinggi</h6>
          <h4 className="text-lg font-bold text-blue-500 mb-0 truncate">PEMURNIAN</h4>
          <small className="text-neu-muted">Bagian: PENGOLAHAN</small>
        </NeuCard>
        <NeuCard className="p-4">
          <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Lembur Tertinggi</h6>
          <h4 className="text-lg font-bold text-emerald-500 mb-0 truncate">Siti Aminah</h4>
          <small className="text-neu-muted">14 Jam / {formatRupiah(850000)}</small>
        </NeuCard>
      </div>

      <NeuCard className="p-6">
        <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="text-red-500" size={20} /> Sistem Audit AI Scanner & Progresif Depnaker
        </h5>
        <p className="text-neu-muted text-sm mb-4">
          Modul Controlling Lembur dilengkapi pemindai risiko otomatis (Fraud Detection), pengali berjenjang progresif (1.5x, 2.0x, 3.0x, 4.0x), validasi K3 Fatigue Rule, dan lembar cetak SPL resmi dengan 5 Tanda Tangan Digital.
        </p>
        <div className="flex flex-wrap gap-3">
          <NeuButton variant="danger" onClick={() => onNavigateTab('list')}>
            Kelola Daftar SPL
          </NeuButton>
          <NeuButton variant="primary" onClick={() => onNavigateTab('analytics')}>
            Lihat Analisis Lengkap
          </NeuButton>
        </div>
      </NeuCard>
    </div>
  );
}