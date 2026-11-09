import React from 'react';
import { ShieldCheck, FileCheck, Info, Printer, Download } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuBadge } from '../ui/NeuBadge';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';
import { formatRupiah } from '../../utils/format';
import { exportToCSV } from '../../utils/exportExcel';

export function OvertimeAnalyticsTab() {
  const completedSPL = [
    { id: 'SPL-1', nik: 'SGN001', nama: 'Budi Santoso', stasiun: 'GILINGAN', bagian: 'TEKNIK', tipe: 'Hari Kerja', tgl: '2026-10-26', jam: 3, setara: 4.5, breakdown: '1j × 1.5x + 2.0j × 2.0x', biaya: 113153 }
  ];

  const handleExportReport = () => {
    // Format data untuk ekspor spreadsheet
    const exportData = completedSPL.map(item => ({
      'ID SPL': item.id,
      'NIK': item.nik,
      'Nama Karyawan': item.nama,
      'Stasiun': item.stasiun,
      'Bagian': item.bagian,
      'Tipe Hari': item.tipe,
      'Tanggal': item.tgl,
      'Durasi Jam': item.jam,
      'Jam Setara (Depnaker)': item.setara,
      'Rincian Progresif': item.breakdown,
      'Total Upah Realisasi (Rp)': item.biaya
    }));

    exportToCSV(exportData, `Laporan_Realisasi_Lembur_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <NeuCard className="p-6">
          <h6 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} /> Kepatuhan & Audit K3 Lembur
          </h6>
          <p className="text-neu-muted text-sm mb-4">Statistik pengajuan lembur yang memerlukan perhatian khusus berdasarkan Fatigue Rule ({'>'}4 jam) dan lembur hari libur.</p>
          
          <NeuInset className="p-4 mb-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-neu-muted">Total Jam Lembur Disetujui</span>
            <strong className="text-blue-500 text-lg">380 Jam</strong>
          </NeuInset>
          <NeuInset className="p-4 mb-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-neu-muted">Total Estimasi Biaya Progresif</span>
            <strong className="text-red-500 text-lg">{formatRupiah(9550000)}</strong>
          </NeuInset>
          <NeuInset className="p-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-neu-muted">High Risk Overtime (K3 Warning)</span>
            <strong className="text-amber-500 text-lg">4 SPL</strong>
          </NeuInset>
        </NeuCard>

        <NeuCard className="p-6 h-full bg-gradient-to-br from-neu-bg to-white/40">
          <div className="h-full flex flex-col justify-center items-center text-center text-neu-muted p-8">
            <BarChartIcon />
            <p className="font-medium mt-4">Statistik Komposisi Biaya</p>
            <small>Chart komponen distribusi biaya stasiun</small>
          </div>
        </NeuCard>
      </div>

      <NeuCard className="p-5">
        <div className="flex flex-col md:flex-row justify-between items-md-center mb-4 gap-3">
          <div>
            <h5 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <FileCheck className="text-emerald-500" size={20} /> Log Lembur Selesai (Realisasi)
            </h5>
            <small className="text-neu-muted">Menampilkan daftar SPL berstatus disetujui penuh (Step 6) untuk audit & penggajian.</small>
          </div>
          <div className="flex gap-2">
            <NeuButton variant="success" onClick={handleExportReport} className="text-xs py-2 px-3">
              <Download size={14} className="mr-1.5" /> Export Laporan CSV/Excel
            </NeuButton>
            <NeuBadge variant="success" className="text-sm px-4 py-2 self-start md:self-center">1 SPL Selesai</NeuBadge>
          </div>
        </div>

        <NeuInset className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Filter Bulan</label>
              <NeuInput type="month" defaultValue="2026-10" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Filter Stasiun</label>
              <NeuSelect><option value="">-- Semua --</option><option value="GILINGAN">GILINGAN</option></NeuSelect>
            </div>
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Cari Karyawan / NIK</label>
              <NeuInput type="text" placeholder="🔍 Cari..." />
            </div>
            <div>
              <NeuButton className="w-full">Reset</NeuButton>
            </div>
          </div>
        </NeuInset>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-3 py-2">ID SPL</th>
                <th className="px-3 py-2">Karyawan</th>
                <th className="px-3 py-2">Bagian/Stasiun</th>
                <th className="px-3 py-2">Waktu</th>
                <th className="px-3 py-2">Durasi Riil</th>
                <th className="px-3 py-2">Rincian Progresif</th>
                <th className="px-3 py-2">Upah Realisasi</th>
                <th className="px-3 py-2 text-center">Cetak</th>
              </tr>
            </thead>
            <tbody>
              {completedSPL.map((l) => (
                <tr key={l.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-3 py-3 rounded-l-xl font-bold">{l.id}</td>
                  <td className="px-3 py-3"><strong>{l.nik}</strong><br/>{l.nama}</td>
                  <td className="px-3 py-3"><NeuBadge variant="dark">{l.stasiun}</NeuBadge><br/><small>{l.bagian}</small></td>
                  <td className="px-3 py-3">{l.tgl}<br/><span className="text-blue-600 font-bold text-xs">{l.tipe}</span></td>
                  <td className="px-3 py-3 font-bold">{l.jam} Jam</td>
                  <td className="px-3 py-3 text-neu-muted text-xs">{l.breakdown}</td>
                  <td className="px-3 py-3 font-bold text-emerald-600">{formatRupiah(l.biaya)}</td>
                  <td className="px-3 py-3 rounded-r-xl text-center">
                    <NeuButton variant="primary" className="px-2 py-1 text-xs"><Printer size={14}/></NeuButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-sm text-neu-muted flex items-center gap-2"><Info size={16} className="text-blue-500" /> Data ini merupakan acuan akumulasi penggajian upah lembur resmi unit.</span>
          <div className="flex gap-4">
            <span className="text-sm text-neu-muted">Jam Setara: <strong className="text-blue-600">4.5 Jam</strong></span>
            <span className="text-sm text-neu-muted">Realisasi Upah: <strong className="text-emerald-600 text-base">{formatRupiah(113153)}</strong></span>
          </div>
        </div>
      </NeuCard>
    </div>
  );
}

function BarChartIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
}