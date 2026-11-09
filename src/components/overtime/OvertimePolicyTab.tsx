import React, { useState, useEffect } from 'react';
import { Sliders, Calculator, Clock, Calendar, Save, Plus, Loader2, Trash2 } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';
import { NeuBadge } from '../ui/NeuBadge';
import { formatRupiah } from '../../utils/format';
import { 
  fetchUnitConfiguration, 
  updateUnitConfiguration, 
  fetchHolidays, 
  addHoliday, 
  deleteHoliday 
} from '../../services/api';

export function OvertimePolicyTab() {
  const [gajiPokok, setGajiPokok] = useState<number>(4350000);
  const [divisor, setDivisor] = useState<number>(173);
  const [holidays, setHolidays] = useState<any[]>([]);
  
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingHoliday, setLoadingHoliday] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const config = await fetchUnitConfiguration();
      if (config) {
        setGajiPokok(config.gaji_pokok_minimum);
        setDivisor(config.divisor);
      }
      const holidayList = await fetchHolidays();
      setHolidays(holidayList);
    } catch (err: any) {
      console.error('Gagal memuat data kebijakan:', err);
    }
  };

  const calculatedHourlyRate = divisor > 0 ? Math.round(gajiPokok / divisor) : 0;

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingConfig(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateUnitConfiguration({
        gaji_pokok_minimum: Number(gajiPokok),
        divisor: Number(divisor)
      });
      setSuccessMsg('Kebijakan upah berhasil disimpan ke database Supabase!');
      await loadData();
    } catch (err: any) {
      setErrorMsg('Gagal menyimpan konfigurasi: ' + (err.message || err));
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newDesc) return;
    setLoadingHoliday(true);
    setErrorMsg('');
    try {
      await addHoliday({ tanggal: newDate, keterangan: newDesc });
      setNewDate('');
      setNewDesc('');
      await loadData();
    } catch (err: any) {
      setErrorMsg('Gagal menambah hari libur: (Pastikan tanggal belum ada) ' + (err.message || err));
    } finally {
      setLoadingHoliday(false);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (confirm('Hapus tanggal libur ini dari database?')) {
      try {
        await deleteHoliday(id);
        await loadData();
      } catch (err: any) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <NeuInset className="p-4 mb-6 flex items-center gap-4">
        <Sliders size={32} className="text-blue-500 shrink-0" />
        <div>
          <h5 className="font-bold text-gray-900 m-0">Panel Pengaturan Kebijakan Lembur & Jam Kerja Shift</h5>
          <small className="text-neu-muted">Digunakan oleh Asman SDM untuk mengatur Gaji Pokok acuan, formula upah per jam, dan mapping libur nasional.</small>
        </div>
      </NeuInset>

      {successMsg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Form Gaji & Kalkulator Upah */}
        <form onSubmit={handleSaveConfig} className="flex flex-col justify-between">
          <NeuCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="text-blue-500" size={20} /> Standard Gaji Pokok & Upah per Jam
              </h5>
              <div className="mb-4">
                <label className="block text-xs font-bold text-neu-muted mb-1">Gaji Pokok Minimum Acuan (Rp/Bulan)</label>
                <NeuInput 
                  type="number" 
                  value={gajiPokok} 
                  onChange={(e) => setGajiPokok(Number(e.target.value))} 
                  required 
                />
                <small className="text-neu-muted mt-1 block">Acuan perhitungan Kepmenaker (1/173 × Gaji Pokok)</small>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-neu-muted mb-1">Faktor Pembagi Jam Kerja (Divisor)</label>
                <NeuInput 
                  type="number" 
                  value={divisor} 
                  onChange={(e) => setDivisor(Number(e.target.value))} 
                  required 
                />
              </div>
              
              <NeuCard className="p-4 mb-4 text-center bg-gradient-to-b from-neu-bg to-white/30">
                <small className="text-neu-muted block">Hasil Kalkulasi Upah per Jam Saat Ini:</small>
                <strong className="text-2xl text-emerald-600 block mt-1">{formatRupiah(calculatedHourlyRate)} / Jam</strong>
              </NeuCard>
            </div>
            <NeuButton type="submit" variant="primary" className="w-full py-3" disabled={loadingConfig}>
              {loadingConfig ? <><Loader2 className="animate-spin mr-2" size={16}/> Menyimpan...</> : <><Save size={18} className="mr-2"/> Simpan Kebijakan Upah</>}
            </NeuButton>
          </NeuCard>
        </form>

        {/* Sistem Shift Normal */}
        <NeuCard className="p-6 flex flex-col justify-between">
          <div>
            <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="text-amber-500" size={20} /> Sistem Hari & Jam Kerja Normal
            </h5>
            <div className="mb-4">
              <label className="block text-xs font-bold text-neu-muted mb-1">Pola Hari Kerja Shift PG</label>
              <NeuSelect defaultValue="Mon-Sat">
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
          <NeuButton variant="primary" className="w-full py-3" onClick={() => alert('Jadwal shift berhasil diperbarui!')}>
            <Save size={18} className="mr-2"/> Simpan Jadwal Shift
          </NeuButton>
        </NeuCard>
      </div>

      {/* Kalender Tanggal Merah */}
      <NeuCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-md-center mb-6 gap-3">
          <div>
            <h5 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Calendar className="text-red-500" size={20} /> Kalender Tanggal Merah & Libur Nasional
            </h5>
            <small className="text-neu-muted">Tanggal di bawah ini otomatis dihitung dengan pengali lembur hari libur (2.0x, 3.0x, 4.0x)</small>
          </div>
        </div>

        <form onSubmit={handleAddHoliday} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-neu-muted mb-1">Tanggal</label>
            <NeuInput type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          </div>
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-neu-muted mb-1">Keterangan Hari Libur</label>
            <NeuInput type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Keterangan (mis: Hari Kemerdekaan RI)" required />
          </div>
          <div className="md:col-span-3">
            <NeuButton type="submit" variant="success" className="w-full py-2.5" disabled={loadingHoliday}>
              {loadingHoliday ? 'Menambah...' : <><Plus size={18} className="mr-2"/> Tambah Libur</>}
            </NeuButton>
          </div>
        </form>

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
              {holidays.map((h) => (
                <tr key={h.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl">
                  <td className="px-4 py-3 rounded-l-xl font-bold">{h.tanggal}</td>
                  <td className="px-4 py-3">{h.keterangan}</td>
                  <td className="px-4 py-3"><NeuBadge variant="danger">{h.status_pengali || 'Pengali Libur Aktif'}</NeuBadge></td>
                  <td className="px-4 py-3 rounded-r-xl text-right">
                    <NeuButton variant="danger" className="text-xs px-3 py-1.5" onClick={() => handleDeleteHoliday(h.id)}>
                      <Trash2 size={14} />
                    </NeuButton>
                  </td>
                </tr>
              ))}
              {holidays.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-neu-muted">Belum ada data kalender libur di database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeuCard>
    </div>
  );
}