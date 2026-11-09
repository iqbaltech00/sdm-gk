import React, { useState, useEffect } from 'react';
import { Bot, Send, AlertTriangle, X } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';
import { NeuBadge } from '../ui/NeuBadge';
import { calculateOvertimeHours, calculateProgressiveMultiplier } from '../../utils/overtimeCalculator';
import { formatRupiah } from '../../utils/format';

interface OvertimeFormModalProps {
  onClose: () => void;
}

export function OvertimeFormModal({ onClose }: OvertimeFormModalProps) {
  const [formData, setFormData] = useState({
    nik: '', nama: '', stasiun: '', tipeHari: 'Hari Kerja',
    tanggal: '', mulai: '', selesai: '', alasan: ''
  });

  const [calc, setCalc] = useState({
    hours: 0, text: '0 Jam', cost: 0, showWarning: false, riskScore: 'Low Risk (15%)', riskVariant: 'success' as 'success'|'warning'|'danger'
  });

  useEffect(() => {
    if (formData.mulai && formData.selesai) {
      const hours = calculateOvertimeHours(formData.mulai, formData.selesai);
      const isHoliday = formData.tipeHari === 'Hari Libur';
      const result = calculateProgressiveMultiplier(hours, isHoliday);
      
      let rScore = 'Low Risk (15%)';
      let rVar: 'success'|'warning'|'danger' = 'success';
      if (hours > 4 && isHoliday) { rScore = 'High Risk (85%)'; rVar = 'danger'; }
      else if (hours > 4 || isHoliday) { rScore = 'Medium Risk (52%)'; rVar = 'warning'; }

      setCalc({
        hours, text: result.breakdownText, cost: result.estimatedCost,
        showWarning: hours > 4, riskScore: rScore, riskVariant: rVar
      });
    }
  }, [formData.mulai, formData.selesai, formData.tipeHari]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Simulasi SPL Berhasil Diajukan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10600] flex items-center justify-center p-4 bg-neu-bg/80 backdrop-blur-sm">
      <NeuCard className="w-full max-w-3xl bg-neu-bg max-h-[90vh] overflow-y-auto p-0 border border-white">
        <div className="p-4 border-b border-black/10 flex justify-between items-center sticky top-0 bg-neu-bg z-10">
          <h5 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Bot size={20} /></span>
            Form SPL & Kalkulator Progresif
          </h5>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/50 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">NIK</label>
                <NeuInput name="nik" onChange={handleChange} required placeholder="SGN001"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Nama</label>
                <NeuInput name="nama" onChange={handleChange} required placeholder="Nama Lengkap"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Tanggal</label>
                <NeuInput type="date" name="tanggal" onChange={handleChange} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Tipe Hari</label>
                <NeuSelect name="tipeHari" onChange={handleChange}>
                  <option value="Hari Kerja">Hari Kerja Normal</option>
                  <option value="Hari Libur">Hari Libur / Tanggal Merah</option>
                </NeuSelect>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Mulai</label>
                <NeuInput type="time" name="mulai" onChange={handleChange} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Selesai</label>
                <NeuInput type="time" name="selesai" onChange={handleChange} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-neu-muted mb-1">Durasi</label>
                <NeuInput type="text" value={`${calc.hours} Jam`} readOnly className="font-bold text-blue-600 bg-white/20"/>
              </div>
            </div>

            <NeuInset className="p-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-neu-muted">Rincian Pengali Progresif Depnaker:</span>
                <NeuBadge variant={formData.tipeHari === 'Hari Libur' ? 'danger' : 'primary'}>{formData.tipeHari}</NeuBadge>
              </div>
              <div className="text-sm text-gray-900 font-bold mb-2">{calc.hours} Jam → {calc.text}</div>
              <div className="flex justify-between items-center border-t border-black/5 pt-2">
                <small className="text-neu-muted">Estimasi Upah Lembur:</small>
                <strong className="text-lg text-emerald-600">{formatRupiah(calc.cost)}</strong>
              </div>
            </NeuInset>

            {calc.showWarning && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                <AlertTriangle size={18} /> Peringatan Fatigue Rule: Durasi {'>'} 4 jam! Butuh verifikasi K3.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Deskripsi Pekerjaan</label>
              <textarea name="alasan" onChange={handleChange as any} className="w-full bg-neu-bg border border-white/30 rounded-xl text-gray-900 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]" rows={2} required></textarea>
            </div>

            <NeuCard className="p-3 flex justify-between items-center">
              <div>
                <h6 className="font-bold text-gray-900 text-sm m-0">Skor Risiko AI</h6>
                <small className="text-neu-muted text-xs">Dianalisis otomatis oleh sistem</small>
              </div>
              <NeuBadge variant={calc.riskVariant} className="text-sm px-3 py-1.5">{calc.riskScore}</NeuBadge>
            </NeuCard>

            <NeuButton type="submit" variant="primary" className="py-3 mt-2"><Send size={18} className="mr-2" /> Ajukan SPL</NeuButton>
          </form>
        </div>
      </NeuCard>
    </div>
  );
}