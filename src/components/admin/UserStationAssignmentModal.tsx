import React, { useState, useEffect } from 'react';
import { X, Settings, CheckCircle, Loader2, Shield } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { updateUserStasiunTambahan } from '../../services/api';

interface UserStationAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onSuccess: () => void;
}

const ALL_STATIONS = [
  'GILINGAN', 'KETEL', 'LISTRIK & INSTRUMENT', 'BESALI',
  'PEMURNIAN', 'PENGUAPAN', 'MASAKAN', 'PUTARAN', 'SUGAR HANDLING',
  'QA ON FARM', 'QA OFF FARM',
  'KEUANGAN & GUDANG', 'SDM&UMUM', 'AKUTANSI & ADMIN HASIL',
  'TANAMAN WIL 1', 'TANAMAN WIL 2', 'TANAMAN WIL 3', 'TANAMAN WIL 4', 'TANAMAN WIL 5', 'TMA', 'BUDIDAYA'
];

export function UserStationAssignmentModal({ isOpen, onClose, userProfile, onSuccess }: UserStationAssignmentModalProps) {
  const [selectedStasiun, setSelectedStasiun] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (userProfile && userProfile.stasiun_tambahan) {
      setSelectedStasiun(userProfile.stasiun_tambahan);
    } else {
      setSelectedStasiun([]);
    }
    setSuccessMsg('');
  }, [userProfile]);

  if (!isOpen || !userProfile) return null;

  const handleCheckboxChange = (station: string) => {
    if (selectedStasiun.includes(station)) {
      setSelectedStasiun(selectedStasiun.filter(s => s !== station));
    } else {
      setSelectedStasiun([...selectedStasiun, station]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserStasiunTambahan(userProfile.id, selectedStasiun);
      setLoading(false);
      setSuccessMsg('Penugasan rangkap stasiun berhasil disimpan!');
      onSuccess();
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      alert('Gagal menyimpan penugasan rangkap: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[10700] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <NeuCard className="w-full max-w-xl p-6 bg-neu-bg relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neu-muted hover:text-gray-900 p-1.5 rounded-xl shadow-[2px_2px_5px_#b8c2d1,-2px_-2px_5px_#ffffff]"
        >
          <X size={18} />
        </button>

        <div className="mb-4 pb-3 border-b border-black/5">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <Shield size={14} /> Kontrol Akses SDM Pusat
          </span>
          <h3 className="text-lg font-bold text-gray-900 m-0 mt-1">
            Atur Penugasan Rangkap Stasiun
          </h3>
          <p className="text-xs text-neu-muted mt-0.5">
            Pengguna: <strong className="text-gray-800">{userProfile.nama_lengkap}</strong> ({userProfile.email}) — Role: <span className="uppercase text-blue-600 font-bold">{userProfile.role}</span>
          </p>
        </div>

        {successMsg ? (
          <div className="py-10 text-center flex flex-col items-center gap-3">
            <CheckCircle size={48} className="text-emerald-500 animate-bounce" />
            <p className="font-bold text-gray-800 m-0">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-2">
                Pilih Stasiun Tambahan (Rangkap) untuk Hak Akses Approval Lembur:
              </label>
              <NeuInset className="p-4 max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                {ALL_STATIONS.map((station) => {
                  const isChecked = selectedStasiun.includes(station);
                  return (
                    <label 
                      key={station} 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-medium transition-all ${
                        isChecked ? 'bg-blue-100/70 text-blue-900 font-bold' : 'hover:bg-white/50 text-gray-700'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(station)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {station}
                    </label>
                  );
                })}
              </NeuInset>
              <small className="text-neu-muted block mt-1.5 text-[11px]">
                * Pengguna akan otomatis memiliki hak melihat dan menyetujui SPL dari stasiun yang dicentang di atas meskipun berada di luar departemen utamanya.
              </small>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-black/5 mt-2">
              <NeuButton type="button" onClick={onClose}>Batal</NeuButton>
              <NeuButton variant="primary" type="submit" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2" size={16}/> Menyimpan...</> : 'Simpan Penugasan Rangkap'}
              </NeuButton>
            </div>
          </form>
        )}
      </NeuCard>
    </div>
  );
}