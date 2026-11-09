import React, { useState } from 'react';
import { UserPlus, X, Save } from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';

interface EmployeeFormModalProps {
  onClose: () => void;
}

export function EmployeeFormModal({ onClose }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState({
    nik: '', nama: '', jabatan: '', statusKaryawan: 'Pelaksana', 
    stasiun: '', bagian: '', email: '', nohp: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Simulasi autofill bagian berdasarkan stasiun (bisa dipindah ke utilitas mapping)
    let newBagian = formData.bagian;
    if (e.target.name === 'stasiun') {
      const val = e.target.value;
      if (['GILINGAN', 'KETEL', 'LISTRIK', 'BESALI'].includes(val)) newBagian = 'TEKNIK';
      else if (['PEMURNIAN', 'EVAPORATOR', 'MASAKAN', 'PUTERAN'].includes(val)) newBagian = 'PENGOLAHAN';
      else if (val.includes('TANAMAN') || val === 'TMA') newBagian = 'TANAMAN';
      else newBagian = 'KEUANGAN & UMUM';
    }

    setFormData({ ...formData, [e.target.name]: e.target.value, bagian: newBagian });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Karyawan baru berhasil ditambahkan (Simulasi)!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10600] flex items-center justify-center p-4 bg-neu-bg/80 backdrop-blur-sm">
      <NeuCard className="w-full max-w-2xl bg-neu-bg max-h-[90vh] overflow-y-auto p-0 border border-white">
        <div className="p-4 border-b border-black/10 flex justify-between items-center sticky top-0 bg-neu-bg z-10">
          <h5 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><UserPlus size={20} /></span>
            Tambah Karyawan Baru
          </h5>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/50 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">NIK</label>
                <NeuInput name="nik" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Nama Lengkap</label>
                <NeuInput name="nama" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Jabatan</label>
                <NeuInput name="jabatan" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Status Karyawan</label>
                <NeuSelect name="statusKaryawan" onChange={handleChange} required>
                  <option value="Pimpinan">Pimpinan</option>
                  <option value="Pelaksana">Pelaksana</option>
                  <option value="PKWT LMG/DMG">PKWT LMG/DMG</option>
                  <option value="PKWT LMG">PKWT LMG</option>
                  <option value="OS">OS</option>
                </NeuSelect>
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Stasiun</label>
                <NeuSelect name="stasiun" onChange={handleChange} required>
                  <option value="">-- Pilih Stasiun --</option>
                  <optgroup label="TEKNIK"><option value="GILINGAN">GILINGAN</option><option value="LISTRIK">LISTRIK</option></optgroup>
                  <optgroup label="PENGOLAHAN"><option value="PEMURNIAN">PEMURNIAN</option><option value="MASAKAN">MASAKAN</option></optgroup>
                  <optgroup label="TANAMAN"><option value="TANAMAN 1">TANAMAN 1</option><option value="TMA">TMA</option></optgroup>
                  <optgroup label="KEUANGAN & UMUM"><option value="SDM">SDM</option><option value="KEUANGAN">KEUANGAN</option></optgroup>
                </NeuSelect>
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Bagian (Otomatis)</label>
                <NeuInput name="bagian" value={formData.bagian} readOnly className="bg-white/30 text-gray-500 font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Email</label>
                <NeuInput type="email" name="email" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">No HP</label>
                <NeuInput name="nohp" onChange={handleChange} />
              </div>
            </div>

            <hr className="border-black/5 my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">File KTP</label>
                <NeuInput type="file" accept=".pdf,image/*" className="py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">File KK</label>
                <NeuInput type="file" accept=".pdf,image/*" className="py-2" />
              </div>
            </div>

            <NeuButton type="submit" variant="primary" className="py-3 mt-4">
              <Save size={18} className="mr-2" /> Simpan Karyawan
            </NeuButton>
          </form>
        </div>
      </NeuCard>
    </div>
  );
}