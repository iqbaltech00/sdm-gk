import React, { useState } from 'react';
import { Search, Settings, ArrowUpDown, FileText } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuBadge } from '../ui/NeuBadge';
import { NeuInput } from '../ui/NeuForms';
import { NeuButton } from '../ui/NeuButton';

export function EmployeeList() {
  const [search, setSearch] = useState('');

  // Simulasi data dari state
  const employees = [
    { nik: 'SGN001', nama: 'Budi Santoso', jabatan: 'Supervisor', stasiun: 'GILINGAN', bagian: 'TEKNIK', statusKaryawan: 'Pelaksana', status: 'Aktif', sp: '-' },
    { nik: 'SGN002', nama: 'Siti Aminah', jabatan: 'Operator Pemurnian', stasiun: 'PEMURNIAN', bagian: 'PENGOLAHAN', statusKaryawan: 'PKWT LMG', status: 'Non-Aktif (Tutup Giling)', sp: 'SP 1' },
    { nik: 'SGN003', nama: 'Rudi Hermawan', jabatan: 'Asisten Tanaman', stasiun: 'TANAMAN 1', bagian: 'TANAMAN', statusKaryawan: 'Pimpinan', status: 'Aktif', sp: '-' },
  ];

  const filteredData = employees.filter(emp => 
    emp.nama.toLowerCase().includes(search.toLowerCase()) || 
    emp.nik.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-4 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-neu-muted" />
        </div>
        <NeuInput 
          type="text" 
          placeholder="Cari NIK atau Nama..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <NeuCard className="p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-3 py-2 cursor-pointer hover:text-blue-500">NIK <ArrowUpDown size={12} className="inline ml-1"/></th>
                <th className="px-3 py-2 cursor-pointer hover:text-blue-500">Nama <ArrowUpDown size={12} className="inline ml-1"/></th>
                <th className="px-3 py-2">Jabatan & Status</th>
                <th className="px-3 py-2">Bagian & Stasiun</th>
                <th className="px-3 py-2">Dokumen</th>
                <th className="px-3 py-2">Keaktifan & SP</th>
                <th className="px-3 py-2 text-center">Aksi HR</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((emp) => (
                <tr key={emp.nik} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-3 py-3 rounded-l-xl font-bold">{emp.nik}</td>
                  <td className="px-3 py-3 font-semibold">{emp.nama}</td>
                  <td className="px-3 py-3">
                    {emp.jabatan}<br/>
                    <NeuBadge variant="dark" className="mt-1">{emp.statusKaryawan}</NeuBadge>
                  </td>
                  <td className="px-3 py-3">
                    <strong>{emp.bagian}</strong><br/>
                    <span className="text-blue-600 font-bold text-xs">{emp.stasiun}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 flex-wrap">
                      <NeuBadge variant="info" className="px-2 py-0.5 text-[10px] cursor-pointer"><FileText size={10} className="inline mr-1"/>KTP</NeuBadge>
                      <NeuBadge variant="info" className="px-2 py-0.5 text-[10px] cursor-pointer"><FileText size={10} className="inline mr-1"/>KK</NeuBadge>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <NeuBadge variant={emp.status === 'Aktif' ? 'success' : 'danger'}>{emp.status}</NeuBadge><br/>
                    <small className="text-neu-muted font-bold block mt-1">SP: {emp.sp !== '-' ? <span className="text-red-500">{emp.sp}</span> : '-'}</small>
                  </td>
                  <td className="px-3 py-3 rounded-r-xl text-center">
                    <NeuButton variant="primary" className="px-2 py-1 text-xs w-full mb-1">
                      <Settings size={14} className="mr-1" /> Kelola
                    </NeuButton>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-neu-muted">Tidak ada data karyawan ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}