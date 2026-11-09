import React, { useState } from 'react';
import { ClipboardCheck, Link as LinkIcon, CheckCircle, FileText, PlusCircle } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuBadge } from '../ui/NeuBadge';

export function ReRegistrationTab() {
  const [showBanner, setShowBanner] = useState(false);

  // Data Simulasi
  const reregData = [
    { id: 'REG-001', nik: 'SGN002', nama: 'Siti Aminah', stasiun: 'PEMURNIAN', tgl: '2026-10-27', skck: true, narkoba: true, status: 'Pending Verifikasi HR' }
  ];

  const handleGenerateForm = () => {
    setShowBanner(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-md-center mb-4 gap-3">
        <h5 className="font-bold text-gray-900 flex items-center gap-2 m-0 text-lg">
          <ClipboardCheck className="text-emerald-500" size={22} /> Verifikasi Berkas Re-Registrasi Musim Giling
        </h5>
        <div className="flex gap-2">
          <NeuButton variant="success" onClick={handleGenerateForm}>
            <LinkIcon size={16} className="mr-1" /> Auto-Generate GForm
          </NeuButton>
          <NeuButton variant="primary">
            <PlusCircle size={16} className="mr-1" /> Input Manual
          </NeuButton>
        </div>
      </div>

      {showBanner && (
        <NeuInset className="p-4 mb-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <strong className="text-emerald-600 flex items-center gap-1"><CheckCircle size={18}/> Google Form Siap Digunakan!</strong>
            <p className="text-neu-muted text-sm m-0">Tautan formulir untuk karyawan PKWT mengisi data & upload dokumen:</p>
          </div>
          <div className="flex gap-2">
            <NeuButton variant="success" className="text-xs px-3 py-1.5"><LinkIcon size={14} className="mr-1"/> Buka Form</NeuButton>
            <NeuButton className="text-xs px-3 py-1.5">Salin Link</NeuButton>
          </div>
        </NeuInset>
      )}

      <NeuCard className="p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-3 py-2">ID Registrasi</th>
                <th className="px-3 py-2">NIK / Nama</th>
                <th className="px-3 py-2">Stasiun Target</th>
                <th className="px-3 py-2">Tanggal Submit</th>
                <th className="px-3 py-2">Dokumen Terunggah</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-center">Aksi HR</th>
              </tr>
            </thead>
            <tbody>
              {reregData.map((item) => (
                <tr key={item.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-3 py-3 rounded-l-xl font-bold">{item.id}</td>
                  <td className="px-3 py-3"><strong>{item.nik}</strong><br/>{item.nama}</td>
                  <td className="px-3 py-3"><NeuBadge variant="dark">{item.stasiun}</NeuBadge></td>
                  <td className="px-3 py-3">{item.tgl}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 flex-col items-start">
                      {item.skck ? <NeuBadge variant="info" className="text-[10px] py-0.5 cursor-pointer"><FileText size={10} className="inline mr-1"/> SKCK</NeuBadge> : <span className="text-neu-muted text-xs">No SKCK</span>}
                      {item.narkoba ? <NeuBadge variant="danger" className="text-[10px] py-0.5 cursor-pointer"><FileText size={10} className="inline mr-1"/> Bebas Narkoba</NeuBadge> : <span className="text-neu-muted text-xs">No Doc</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <NeuBadge variant={item.status.includes('Pending') ? 'warning' : 'success'}>{item.status}</NeuBadge>
                  </td>
                  <td className="px-3 py-3 rounded-r-xl text-center">
                    {item.status.includes('Pending') && (
                      <NeuButton variant="success" className="px-2 py-1 text-xs font-bold w-full"><CheckCircle size={14} className="mr-1"/> Approve & Aktifkan</NeuButton>
                    )}
                  </td>
                </tr>
              ))}
              {reregData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-neu-muted">Belum ada data pengajuan re-registrasi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}