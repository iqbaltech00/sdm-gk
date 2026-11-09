import React, { useState } from 'react';
import { CalendarPlus, Send, X } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';

interface LeaveFormModalProps {
  onClose: () => void;
}

export function LeaveFormModal({ onClose }: LeaveFormModalProps) {
  const [formData, setFormData] = useState({
    nik: '', nama: '', jenisCuti: 'Cuti Tahunan', 
    mulai: '', selesai: '', alasan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengajuan Cuti berhasil dikirim (Simulasi)!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10600] flex items-center justify-center p-4 bg-neu-bg/80 backdrop-blur-sm">
      <NeuCard className="w-full max-w-lg bg-neu-bg max-h-[90vh] overflow-y-auto p-0 border border-white">
        <div className="p-4 border-b border-black/10 flex justify-between items-center sticky top-0 bg-neu-bg z-10">
          <h5 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><CalendarPlus size={20} /></span>
            Form Pengajuan Cuti Baru
          </h5>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/50 transition-colors">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">NIK Karyawan</label>
              <NeuInput name="nik" onChange={handleChange} required placeholder="Contoh: SGN001" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Nama Lengkap</label>
              <NeuInput name="nama" onChange={handleChange} required placeholder="Budi Santoso" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Jenis Cuti</label>
              <NeuSelect name="jenisCuti" onChange={handleChange} required>
                <option value="Cuti Tahunan">Cuti Tahunan</option>
                <option value="Cuti Sakit">Cuti Sakit</option>
                <option value="Izin Khusus">Izin Khusus</option>
              </NeuSelect>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Mulai Tanggal</label>
                <NeuInput type="date" name="mulai" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Selesai Tanggal</label>
                <NeuInput type="date" name="selesai" onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Alasan Cuti / Keterangan</label>
              <textarea 
                name="alasan" 
                onChange={handleChange as any} 
                className="w-full bg-neu-bg border border-white/30 rounded-xl text-gray-900 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]" 
                rows={3} 
                placeholder="Deskripsikan alasan pengajuan cuti secara singkat..."
                required
              ></textarea>
            </div>

            <NeuButton type="submit" variant="success" className="py-3 mt-4">
              <Send size={18} className="mr-2" /> Kirim Pengajuan Cuti
            </NeuButton>
          </form>
        </div>
      </NeuCard>
    </div>
  );
}