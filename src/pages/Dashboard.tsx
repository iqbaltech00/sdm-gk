import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Users, DollarSign, Hourglass, CalendarCheck, FileCheck, AlertTriangle, UserMinus, BarChart2, PieChart, Clock } from 'lucide-react';
import { NeuCard, NeuInset } from '../components/ui/NeuCard';
import { NeuBadge } from '../components/ui/NeuBadge';
import { NeuButton } from '../components/ui/NeuButton';
import { useAuthStore } from '../store/authStore';

export function Dashboard() {
  const navigate = useNavigate();
  const { role } = useAuthStore();
  
  const chartBiayaRef = useRef<HTMLCanvasElement>(null);
  const chartStatusRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let biayaChart: Chart | null = null;
    let statusChart: Chart | null = null;

    if (chartBiayaRef.current) {
      biayaChart = new Chart(chartBiayaRef.current, {
        type: 'bar',
        data: {
          labels: ['TEKNIK', 'PENGOLAHAN', 'TANAMAN', 'KEUANGAN & UMUM'],
          datasets: [{
            label: 'Biaya Lembur Progresif (Rp)',
            data: [4350000, 3150000, 1250000, 800000],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],
            borderRadius: 8
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    if (chartStatusRef.current) {
      statusChart = new Chart(chartStatusRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Aktif', 'PKWT LMG', 'Non-Aktif', 'OS'],
          datasets: [{
            data: [45, 20, 10, 5],
            backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    return () => {
      if (biayaChart) biayaChart.destroy();
      if (statusChart) statusChart.destroy();
    };
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b border-black/5 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard SDM & Umum</h1>
          <p className="text-neu-muted text-sm m-0">Ringkasan Eksekutif & Analisis Operasional Pabrik Gula</p>
        </div>
        <NeuBadge variant="primary" className="text-sm px-4 py-2">Role: {role.replace('_', ' ').toUpperCase()}</NeuBadge>
      </div>

      {/* Section 1: Interactive Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NeuCard interactive className="p-4" onClick={() => navigate('/employees')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Total Karyawan</h6>
              <h2 className="text-2xl font-bold text-gray-900 mb-0">324</h2>
              <small className="text-neu-muted">310 Aktif</small>
            </div>
            <NeuInset className="p-4 text-blue-500"><Users size={28} /></NeuInset>
          </div>
        </NeuCard>

        <NeuCard interactive className="p-4" onClick={() => navigate('/overtime')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Estimasi Biaya Lembur</h6>
              <h3 className="text-xl font-bold text-red-500 mb-0">Rp 9.550.000</h3>
              <small className="text-neu-muted">380 Jam Disetujui</small>
            </div>
            <NeuInset className="p-4 text-red-500"><DollarSign size={28} /></NeuInset>
          </div>
        </NeuCard>

        <NeuCard interactive className="p-4" onClick={() => navigate('/overtime')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">SPL Pending</h6>
              <h2 className="text-2xl font-bold text-amber-500 mb-0">12</h2>
              <small className="text-neu-muted">Butuh Persetujuan</small>
            </div>
            <NeuInset className="p-4 text-amber-500"><Hourglass size={28} /></NeuInset>
          </div>
        </NeuCard>

        <NeuCard interactive className="p-4" onClick={() => navigate('/leave')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Pengajuan Cuti</h6>
              <h2 className="text-2xl font-bold text-emerald-500 mb-0">5</h2>
              <small className="text-neu-muted">2 Pending</small>
            </div>
            <NeuInset className="p-4 text-emerald-500"><CalendarCheck size={28} /></NeuInset>
          </div>
        </NeuCard>
      </div>

      {/* Section 2: Operational Additional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NeuCard interactive className="p-4" onClick={() => navigate('/employees')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Pending Re-Registrasi</h6>
              <h3 className="text-xl font-bold text-cyan-500 mb-0">3</h3>
              <small className="text-neu-muted">Berkas PKWT Perlu Verifikasi HR</small>
            </div>
            <NeuInset className="p-4 text-cyan-500"><FileCheck size={28} /></NeuInset>
          </div>
        </NeuCard>

        <NeuCard interactive className="p-4" onClick={() => navigate('/overtime')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">High Risk Overtime (K3)</h6>
              <h3 className="text-xl font-bold text-red-500 mb-0">4</h3>
              <small className="text-neu-muted">Lembur {'>'} 4 Jam / Hari Libur</small>
            </div>
            <NeuInset className="p-4 text-red-500"><AlertTriangle size={28} /></NeuInset>
          </div>
        </NeuCard>

        <NeuCard interactive className="p-4" onClick={() => navigate('/employees')}>
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-neu-muted uppercase font-bold text-xs mb-1">Karyawan Terkena SP</h6>
              <h3 className="text-xl font-bold text-gray-800 mb-0">2</h3>
              <small className="text-neu-muted">Memerlukan Pembinaan SDM</small>
            </div>
            <NeuInset className="p-4 text-gray-600"><UserMinus size={28} /></NeuInset>
          </div>
        </NeuCard>
      </div>

      {/* Section 3: Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7">
          <NeuCard className="p-5 h-full">
            <div className="flex justify-between items-center mb-4">
              <h6 className="font-bold text-gray-900 flex items-center gap-2"><BarChart2 className="text-blue-500" size={18}/> Estimasi Biaya Lembur (Rp)</h6>
              <NeuBadge variant="dark">Bulan Berjalan</NeuBadge>
            </div>
            <div className="h-[250px] relative w-full">
              <canvas ref={chartBiayaRef}></canvas>
            </div>
          </NeuCard>
        </div>
        <div className="lg:col-span-5">
          <NeuCard className="p-5 h-full">
            <div className="flex justify-between items-center mb-4">
              <h6 className="font-bold text-gray-900 flex items-center gap-2"><PieChart className="text-emerald-500" size={18}/> Komposisi Karyawan</h6>
              <NeuBadge variant="dark">Aktif</NeuBadge>
            </div>
            <div className="h-[250px] relative w-full flex justify-center">
              <canvas ref={chartStatusRef}></canvas>
            </div>
          </NeuCard>
        </div>
      </div>

      {/* Section 4: Recent Overtime Log Table */}
      <NeuCard className="p-5 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-bold text-gray-900 flex items-center gap-2"><Clock className="text-amber-500" size={18}/> Tracking Pengajuan SPL Terakhir</h6>
          <NeuButton variant="primary" className="py-1 px-3 text-sm" onClick={() => navigate('/overtime')}>Lihat Semua ➔</NeuButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-4 py-2 font-bold">ID SPL</th>
                <th className="px-4 py-2 font-bold">Nama Karyawan</th>
                <th className="px-4 py-2 font-bold">Bagian & Stasiun</th>
                <th className="px-4 py-2 font-bold">Durasi Jam</th>
                <th className="px-4 py-2 font-bold">Estimasi Biaya</th>
                <th className="px-4 py-2 font-bold">Status Approval</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                <td className="px-4 py-3 rounded-l-xl font-bold">SPL-1</td>
                <td className="px-4 py-3">Budi Santoso</td>
                <td className="px-4 py-3">TEKNIK / GILINGAN</td>
                <td className="px-4 py-3">3 Jam</td>
                <td className="px-4 py-3 font-bold text-emerald-600">Rp 113.153</td>
                <td className="px-4 py-3 rounded-r-xl"><NeuBadge variant="success">Step 6/6 (Selesai)</NeuBadge></td>
              </tr>
              <tr className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                <td className="px-4 py-3 rounded-l-xl font-bold">SPL-2</td>
                <td className="px-4 py-3">Siti Aminah</td>
                <td className="px-4 py-3">PENGOLAHAN / PEMURNIAN</td>
                <td className="px-4 py-3">6 Jam</td>
                <td className="px-4 py-3 font-bold text-emerald-600">Rp 301.740</td>
                <td className="px-4 py-3 rounded-r-xl"><NeuBadge variant="warning">Step 2/6</NeuBadge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}