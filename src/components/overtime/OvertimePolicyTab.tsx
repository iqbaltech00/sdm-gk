import React from 'react';
import { Sliders, Calculator, Clock, CalendarEvent, Save, Plus } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';
import { NeuBadge } from '../ui/NeuBadge';
import { formatRupiah } from '../../utils/format';

export function OvertimePolicyTab() {
  return (
    <div className="animate-in fade-in duration-300">
      <NeuInset className="p-4 mb-6 flex items-center gap-4">
        <Sliders size={32} className="text-blue-500" />
        <div>
          <h5 className="font-bold text-gray-900 m-0">Panel Pengaturan Kebijakan Lembur & Jam Kerja Shift</h5>
          <small className="text-neu-muted">Digunakan oleh Asman SDM untuk mengatur Gaji Pokok acuan, formula upah per jam, dan mapping libur nasional.</small>
        </div>
      </NeuInset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <NeuCard className="p-6 flex flex-col justify-between">
          <div>
            <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="text-blue-500" size={20} /> Standard Gaji Pokok & Upah per Jam
            </h5>
            <div className="mb-4">
              <label className="block text-xs font-bold text-neu-muted mb-1">Gaji Pokok Minimum Acuan (Rp/Bulan)</label>
              <NeuInput type="number" defaultValue="4350000" />
              <small className="text-neu-muted mt-1 block">Acuan perhitungan Kepmenaker (1/173 × Gaji Pokok)</small>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-neu-muted mb-1">Faktor Pembagi Jam Kerja (Divisor)</label>
              <NeuInput type="number" defaultValue="173" />
            </div>
            
            <NeuCard className="p-4 mb-4 text-center bg-gradient-to-b from-neu-bg to-white/30">
              <small className="text-neu-muted block">Hasil Kalkulasi Upah per Jam Saat Ini:</small>
              <strong className="text-2xl text-emerald-600 block mt-1">{formatRupiah(25145)} / Jam</strong>
            </NeuCard>
          </div>
          <NeuButton variant="primary" className="w-full py-3"><Save size={18} className="mr-2"/> Simpan Kebijakan Upah</NeuButton>
        </NeuCard>

        <NeuCard className="p-6 flex flex-col justify-between">
          <div>
            <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="text-amber-500" size={20} /> Sistem Hari & Jam Kerja Normal
            </h5>
            <div className="mb-4">
              <label className="block text-xs font-bold text-neu-muted mb-1">Pola Hari Kerja Shift PG</label>
              <NeuSelect>
                <option value="Mon-Sat">6 Hari Kerja (Senin - Sabtu) - Minggu Libur</option>
                <option value="Mon-Fri">5 Hari Kerja (Senin - Jumat) - Sabtu & Minggu Libur</option>
              </NeuSelect>
            </div>

            <NeuInset className="p-4 mb-4">
              <h6 className="font-bold text-gray-900 text-sm mb-3">Jadwal Shift Normal Default Unit:</h6>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-neu-muted w-1/3">Senin - Kamis</span>
                <div className="flex items-center gap-2 w-2/3">
                  <NeuInput type="time" defaultValue="07:00" className="py-1 px-2 text-sm" /> -
                  <NeuInput type="time" defaultValue="15:30" className="py-1 px-2 text-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-neu-muted w-1/3">Jumat</span>
                <div className="flex items-center gap-2 w-2/3">
                  <NeuInput type="time" defaultValue="06:30" className="py-1 px-2 text-sm" /> -
                  <NeuInput type="time" defaultValue="11:00" className="py-1 px-2 text-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neu-muted w-1/3">Sabtu</span>
                <div className="flex items-center gap-2 w-2/3">
                  <NeuInput type="time" defaultValue="07:00" className="py-1 px-2 text-sm" /> -
                  <NeuInput type="time" defaultValue="12:30" className="py-1 px-2 text-sm" />
                </div>
              </div>
            </NeuInset>
            
            <p className="text-xs text-neu-muted mb-4">Lembur di luar jam shift di atas otomatis memicu Kalkulator Progresif Depnaker.</p>
          </div>
          <NeuButton variant="primary" className="w-full py-3"><Save size={18} className="mr-2"/> Simpan Jadwal Shift</NeuButton>
        </NeuCard>
      </div>

      <NeuCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-md-center mb-6 gap-3">
          <div>
            <h5 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CalendarEvent className="text-red-500" size={20} /> Kalender Tanggal Merah & Libur Nasional
            </h5>
            <small className="text-neu-muted">Tanggal di bawah ini otomatis dihitung dengan pengali lembur hari libur (2.0x, 3.0x, 4.0x)</small>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
          <div className="md:col-span-3"><NeuInput type="date" /></div>
          <div className="md:col-span-6"><NeuInput type="text" placeholder="Keterangan (mis: Hari Kemerdekaan RI)" /></div>
          <div className="md:col-span-3"><NeuButton variant="success" className="w-full py-2.5"><Plus size={18} className="mr-2"/> Tambah</NeuButton></div>
        </div>

        <div className="overflow-x-auto max-h-60">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-neu-muted uppercase font-bold text-xs">
                <th className="px-4 py-2 sticky top-0 bg-neu-bg z-10">Tanggal Merah</th>
                <th className="px-4 py-2 sticky top-0 bg-neu-bg z-10">Keterangan Hari Libur</th>
                <th className="px-4 py-2 sticky top-0 bg-neu-bg z-10">Status Pengali System</th>
                <th className="px-4 py-2 sticky top-0 bg-neu-bg z-10 text-right">Aksi Hapus</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                <td className="px-4 py-3 rounded-l-xl font-bold">2026-10-27</td>
                <td className="px-4 py-3">Hari Jadi PT Sinergi Gula Nusantara</td>
                <td className="px-4 py-3"><NeuBadge variant="danger">Pengali Libur Aktif</NeuBadge></td>
                <td className="px-4 py-3 rounded-r-xl text-right"><NeuButton variant="danger" className="text-xs px-3 py-1.5">Hapus</NeuButton></td>
              </tr>
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}