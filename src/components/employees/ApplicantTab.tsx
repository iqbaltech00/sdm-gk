import React from 'react';
import { UserPlus, Plus } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuBadge } from '../ui/NeuBadge';

export function ApplicantTab() {
  const pelamarData = [
    { id: 'PLM-1', nama: 'Ahmad Fauzi', posisi: 'Asisten Teknik', kontak: 'ahmad@mail.com / 08111222333', tgl: '2026-10-25', status: 'Review HR' }
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-md-center mb-4 gap-3">
        <h5 className="font-bold text-gray-900 flex items-center gap-2 m-0 text-lg">
          <UserPlus className="text-blue-500" size={22} /> Daftar Pelamar Masuk & Seleksi
        </h5>
        <NeuButton variant="primary">
          <Plus size={16} className="mr-1" /> Input Pelamar
        </NeuButton>
      </div>

      <NeuCard className="p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nama Pelamar</th>
                <th className="px-4 py-2">Posisi Dilamar</th>
                <th className="px-4 py-2">Email / No. HP</th>
                <th className="px-4 py-2">Tanggal Masuk</th>
                <th className="px-4 py-2">Status Seleksi</th>
              </tr>
            </thead>
            <tbody>
              {pelamarData.map((p) => (
                <tr key={p.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-4 py-3 rounded-l-xl font-bold">{p.id}</td>
                  <td className="px-4 py-3 font-semibold">{p.nama}</td>
                  <td className="px-4 py-3 text-blue-600 font-bold">{p.posisi}</td>
                  <td className="px-4 py-3 text-neu-muted text-xs">{p.kontak}</td>
                  <td className="px-4 py-3">{p.tgl}</td>
                  <td className="px-4 py-3 rounded-r-xl"><NeuBadge variant="info">{p.status}</NeuBadge></td>
                </tr>
              ))}
              {pelamarData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-neu-muted">Belum ada data pelamar</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}