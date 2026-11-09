import React from 'react';
import { CalendarDays } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuBadge } from '../ui/NeuBadge';

export function LeaveList() {
  // Simulasi data dari state
  const leaves = [
    { id: 'CUTI-1', nik: 'SGN001', nama: 'Budi Santoso', jenis: 'Cuti Tahunan', mulai: '2026-11-01', selesai: '2026-11-03', alasan: 'Keperluan keluarga', status: 'Pending' },
    { id: 'CUTI-2', nik: 'SGN003', nama: 'Rudi Hermawan', jenis: 'Cuti Sakit', mulai: '2026-11-05', selesai: '2026-11-06', alasan: 'Demam (Surat Dokter Terlampir)', status: 'Approved' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <NeuCard className="p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 px-2">
          <CalendarDays size={18} className="text-emerald-500" />
          <h6 className="font-bold text-gray-900 m-0">Daftar Pengajuan Cuti & Izin</h6>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">NIK & Nama</th>
                <th className="px-4 py-2">Jenis Cuti</th>
                <th className="px-4 py-2">Tanggal Mulai</th>
                <th className="px-4 py-2">Tanggal Selesai</th>
                <th className="px-4 py-2">Alasan</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((c) => (
                <tr key={c.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-4 py-3 rounded-l-xl font-bold">{c.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{c.nik}<br/><span className="font-normal text-neu-muted">{c.nama}</span></td>
                  <td className="px-4 py-3 font-bold text-blue-600">{c.jenis}</td>
                  <td className="px-4 py-3">{c.mulai}</td>
                  <td className="px-4 py-3">{c.selesai}</td>
                  <td className="px-4 py-3 text-neu-muted">{c.alasan}</td>
                  <td className="px-4 py-3 rounded-r-xl">
                    <NeuBadge variant={c.status === 'Approved' ? 'success' : 'warning'}>{c.status}</NeuBadge>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-neu-muted">Belum ada data pengajuan cuti.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}