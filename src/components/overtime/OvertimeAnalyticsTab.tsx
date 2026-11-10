// src/components/overtime/OvertimeAnalyticsTab.tsx
import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileCheck, Info, Printer, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuBadge } from '../ui/NeuBadge';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';
import { formatRupiah } from '../../utils/format';
import { exportToCSV } from '../../utils/exportExcel';
import { fetchOvertimeRequests } from '../../services/api';
import * as XLSX from 'xlsx';

export function OvertimeAnalyticsTab() {
  const [completedSPL, setCompletedSPL] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSap, setGeneratingSap] = useState(false);

  useEffect(() => {
    loadCompletedOvertime();
  }, []);

  const loadCompletedOvertime = async () => {
    setLoading(true);
    const data = await fetchOvertimeRequests();
    const approved = data.length > 0 ? data : [
      { id_spl: 'SPL-001', nik: '18004554', nama: 'KERTO PRIBADI', stasiun: 'TANAMAN WIL 1', bagian: 'TANAMAN', tipe_hari: 'Hari Kerja', tanggal: '2026-10-11', durasi_jam: 3, estimasi_biaya: 113153, status: 'Disetujui Penuh' }
    ];
    setCompletedSPL(approved);
    setLoading(false);
  };

  const handleExportReport = () => {
    const exportData = completedSPL.map(item => ({
      'ID SPL': item.id_spl,
      'NIK': item.nik,
      'Nama Karyawan': item.nama,
      'Stasiun': item.stasiun,
      'Bagian': item.bagian,
      'Tipe Hari': item.tipe_hari,
      'Tanggal': item.tanggal,
      'Durasi (Jam)': item.durasi_jam,
      'Estimasi Upah (Rp)': item.estimasi_biaya,
      'Status': item.status
    }));

    exportToCSV(exportData, `Laporan_Log_Lembur_Selesai_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleGenerateSAPTemplate = () => {
    setGeneratingSap(true);
    try {
      const sapRows = completedSPL.map((item, index) => {
        const tglFormatted = item.tanggal ? item.tanggal.replace(/-/g, '') : '01102026';
        
        return {
          'NIK / Employee ID': item.nik || '',
          'Infotype': 15,
          'Subtype': 3000,
          'Tanggal': tglFormatted,
          'Wage Type': 3000,
          'Amount': '',
          'Currency': 'IDR',
          'Ind. valuation': '',
          'Number/unit': item.durasi_jam || 2,
          'Unit of time/meas.': 'Hours',
          'Default Date': '',
          'Default date': '',
          'Assignment Number': item.id_spl || `SPL-${index+1}`,
          'Reason for Change': 'Realisasi Lembur SGN HR App'
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(sapRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Batch');

      XLSX.writeFile(workbook, `SAP_Infotype15_Lembur_${new Date().toISOString().slice(0, 10)}.xlsx`);
      setGeneratingSap(false);
    } catch (err: any) {
      setGeneratingSap(false);
      alert('Gagal menghasilkan file SAP: ' + err.message);
    }
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
            <small className="text-neu-muted">Menampilkan daftar SPL berstatus disetujui penuh untuk audit, pelaporan, dan upload batch ke SAP.</small>
          </div>
          <div className="flex flex-wrap gap-2">
            <NeuButton variant="success" onClick={handleGenerateSAPTemplate} className="text-xs py-2 px-3 bg-emerald-600 text-white" disabled={generatingSap}>
              {generatingSap ? <><Loader2 className="animate-spin mr-1.5" size={14}/> Generating...</> : <><FileSpreadsheet size={14} className="mr-1.5" /> Generate Lembur (SAP)</>}
            </NeuButton>
            <NeuButton variant="success" onClick={handleExportReport} className="text-xs py-2 px-3">
              <Download size={14} className="mr-1.5" /> Export Laporan CSV
            </NeuButton>
            <NeuBadge variant="success" className="text-sm px-3 py-1.5 self-center">{completedSPL.length} SPL Selesai</NeuBadge>
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
              <NeuSelect><option value="">-- Semua Stasiun --</option><option value="GILINGAN">Gilingan</option><option value="TANAMAN">Tanaman</option></NeuSelect>
            </div>
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Cari Karyawan / NIK</label>
              <NeuInput type="text" placeholder="🔍 Cari NIK / Nama..." />
            </div>
            <div>
              <NeuButton className="w-full">Reset Filter</NeuButton>
            </div>
          </div>
        </NeuInset>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-neu-muted flex justify-center items-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Memuat log lembur dari Supabase...
            </div>
          ) : (
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-neu-muted uppercase font-bold text-xs">
                  <th className="px-3 py-2">ID SPL</th>
                  <th className="px-3 py-2">Karyawan</th>
                  <th className="px-3 py-2">Bagian / Stasiun</th>
                  <th className="px-3 py-2">Tipe Hari & Tanggal</th>
                  <th className="px-3 py-2">Durasi Riil</th>
                  <th className="px-3 py-2">Estimasi Upah</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-center">Cetak</th>
                </tr>
              </thead>
              <tbody>
                {completedSPL.map((l) => (
                  <tr key={l.id_spl || l.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                    <td className="px-3 py-3 rounded-l-xl font-bold">{l.id_spl}</td>
                    <td className="px-3 py-3"><strong>{l.nik}</strong><br/>{l.nama}</td>
                    <td className="px-3 py-3"><NeuBadge variant="dark">{l.stasiun}</NeuBadge><br/><small>{l.bagian}</small></td>
                    <td className="px-3 py-3">{l.tanggal}<br/><span className="text-blue-600 font-bold text-xs">{l.tipe_hari || 'Hari Kerja'}</span></td>
                    <td className="px-3 py-3 font-bold">{l.durasi_jam} Jam</td>
                    <td className="px-3 py-3 font-bold text-emerald-600">{formatRupiah(l.estimasi_biaya || 0)}</td>
                    <td className="px-3 py-3"><NeuBadge variant="success">{l.status || 'Disetujui Penuh'}</NeuBadge></td>
                    <td className="px-3 py-3 rounded-r-xl text-center">
                      <NeuButton variant="primary" className="px-2 py-1 text-xs" onClick={() => alert(`Cetak SPL ${l.id_spl}`)}><Printer size={14}/></NeuButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-sm text-neu-muted flex items-center gap-2"><Info size={16} className="text-blue-500" /> Tombol 'Generate Lembur (SAP)' otomatis menyusun data ke format template Infotype 15 siap upload.</span>
          <div className="flex gap-4">
            <span className="text-sm text-neu-muted">Total Entri: <strong className="text-blue-600">{completedSPL.length} SPL</strong></span>
          </div>
        </div>
      </NeuCard>
    </div>
  );
}

function BarChartIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
}