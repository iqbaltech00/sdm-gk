import React from 'react';
import { Printer, CheckCircle } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuBadge } from '../ui/NeuBadge';
import { NeuButton } from '../ui/NeuButton';
import { NeuSelect, NeuInput } from '../ui/NeuForms';
import { formatRupiah } from '../../utils/format';

export function OvertimeList() {
  // Data simulasi (seperti db.lembur pada HTML)
  const splData = [
    { id: 'SPL-1', nik: 'SGN001', nama: 'Budi Santoso', stasiun: 'GILINGAN', tipe: 'Hari Kerja', tgl: '2026-10-26', jam: '17:00-20:00 (3 Jam)', biaya: 113153, step: 6, status: 'Disetujui Penuh' },
    { id: 'SPL-2', nik: 'SGN002', nama: 'Siti Aminah', stasiun: 'PEMURNIAN', tipe: 'Hari Libur', tgl: '2026-10-27', jam: '08:00-14:00 (6 Jam)', biaya: 301740, step: 2, status: 'Menunggu Manager Bagian' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <NeuCard className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-neu-muted mb-1">Filter Stasiun</label>
            <NeuSelect>
              <option value="">-- Semua --</option>
              <option value="GILINGAN">GILINGAN</option>
              <option value="PEMURNIAN">PEMURNIAN</option>
            </NeuSelect>
          </div>
          <div>
            <label className="block text-xs font-bold text-neu-muted mb-1">Filter Bulan</label>
            <NeuInput type="month" defaultValue="2026-10" />
          </div>
          <div className="flex gap-2">
            <NeuButton className="w-1/2">Reset</NeuButton>
            <NeuButton variant="success" className="w-1/2">Export</NeuButton>
          </div>
          <div className="text-right md:text-left text-sm text-neu-muted mt-2 md:mt-0 font-medium">
            Total: {splData.length} data
          </div>
        </div>
      </NeuCard>

      <NeuCard className="p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-3 py-2">ID SPL</th>
                <th className="px-3 py-2">Karyawan</th>
                <th className="px-3 py-2">Stasiun & Tipe</th>
                <th className="px-3 py-2">Waktu</th>
                <th className="px-3 py-2">Estimasi Biaya</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {splData.map((item) => (
                <tr key={item.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-3 py-3 rounded-l-xl font-bold">{item.id}</td>
                  <td className="px-3 py-3"><strong>{item.nik}</strong><br/>{item.nama}</td>
                  <td className="px-3 py-3">
                    <NeuBadge variant="dark" className="mb-1">{item.stasiun}</NeuBadge><br/>
                    <span className="text-blue-600 font-bold text-xs">{item.tipe}</span>
                  </td>
                  <td className="px-3 py-3">{item.tgl}<br/><small>{item.jam}</small></td>
                  <td className="px-3 py-3 font-bold text-emerald-600">{formatRupiah(item.biaya)}</td>
                  <td className="px-3 py-3">
                    <NeuBadge variant={item.step === 6 ? 'success' : 'warning'}>Step {item.step}/6</NeuBadge>
                  </td>
                  <td className="px-3 py-3 rounded-r-xl text-center">
                    {item.step < 6 && (
                      <NeuButton variant="success" className="px-2 py-1 text-xs mb-1 w-full"><CheckCircle size={14} className="mr-1"/> Approve</NeuButton>
                    )}
                    <NeuButton variant="primary" className="px-2 py-1 text-xs w-full"><Printer size={14} className="mr-1"/> Cetak</NeuButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}