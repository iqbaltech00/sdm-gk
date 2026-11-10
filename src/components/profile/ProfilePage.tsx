import React, { useState } from 'react';
import { KeyRound, Shield, User, Mail, Briefcase, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { supabase } from '../../lib/supabase';
import { SignatureUploadCard } from './SignatureUploadCard';

interface ProfilePageProps {
  userProfile: any;
  onProfileUpdated: () => void;
}

export function ProfilePage({ userProfile, onProfileUpdated }: ProfilePageProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Password minimal harus 6 karakter.' });
      return;
    }

    setLoadingPass(true);
    setPassMsg({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setLoadingPass(false);
      setPassMsg({ type: 'success', text: 'Password berhasil diperbarui!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setLoadingPass(false);
      setPassMsg({ type: 'error', text: 'Gagal memperbarui password: ' + err.message });
    }
  };

  if (!userProfile) {
    return (
      <div className="p-8 text-center text-neu-muted flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={20} /> Memuat data profil...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-gray-900 m-0">Profil & Pengaturan Akun</h2>
        <p className="text-xs text-neu-muted mt-1">
          Kelola informasi identitas, keamanan sandi, dan tanda tangan digital untuk keperluan persetujuan lembur korporat.
        </p>
      </div>

      {/* Grid Informasi Identitas & Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Personal */}
        <NeuCard className="p-6 bg-neu-bg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={16} className="text-blue-600" /> Informasi Identitas
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neu-muted block font-medium">Nama Lengkap</span>
                <strong className="text-gray-900 text-sm">{userProfile.nama_lengkap}</strong>
              </div>
              <div>
                <span className="text-neu-muted block font-medium">Email Terdaftar</span>
                <span className="text-gray-800 flex items-center gap-1 font-mono">
                  <Mail size={12} /> {userProfile.email}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-black/5 text-[11px] text-neu-muted">
            * Data identitas disinkronkan langsung dengan basis data kepegawaian pabrik gula.
          </div>
        </NeuCard>

        {/* Informasi Akses & Penugasan */}
        <NeuCard className="p-6 bg-neu-bg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" /> Hak Akses & Penugasan
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neu-muted block font-medium">Role Sistem</span>
                <span className="inline-block mt-0.5 px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg uppercase">
                  {userProfile.role}
                </span>
              </div>
              <div>
                <span className="text-neu-muted block font-medium">Bagian / Departemen Utama</span>
                <span className="text-gray-800 font-bold flex items-center gap-1 mt-0.5">
                  <Briefcase size={12} /> {userProfile.bagian || 'Pusat / Lintas Bagian'}
                </span>
              </div>
              <div>
                <span className="text-neu-muted block font-medium">Stasiun Tambahan (Rangkap)</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userProfile.stasiun_tambahan && userProfile.stasiun_tambahan.length > 0 ? (
                    userProfile.stasiun_tambahan.map((st: string) => (
                      <span key={st} className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">
                        {st}
                      </span>
                    ))
                  ) : (
                    <span className="text-neu-muted italic">Tidak ada stasiun rangkap</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </NeuCard>
      </div>

      {/* Komponen Upload Tanda Tangan Digital */}
      <SignatureUploadCard userProfile={userProfile} onUpdated={onProfileUpdated} />

      {/* Ganti Password */}
      <NeuCard className="p-6 bg-neu-bg">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 m-0 flex items-center gap-2">
            <KeyRound size={18} className="text-amber-600" /> Keamanan Akun (Ubah Kata Sandi)
          </h3>
          <p className="text-xs text-neu-muted mt-0.5">
            Perbarui password akun Anda secara berkala untuk menjaga keamanan sistem operasional.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Password Baru:</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/60 border border-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neu-muted mb-1">Konfirmasi Password Baru:</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/60 border border-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {passMsg.text && (
            <div className={`flex items-center gap-2 text-xs font-bold p-3 rounded-xl ${
              passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {passMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {passMsg.text}
            </div>
          )}

          <div className="flex justify-start pt-1">
            <NeuButton variant="primary" type="submit" disabled={loadingPass || !newPassword || !confirmPassword}>
              {loadingPass ? <><Loader2 className="animate-spin mr-2" size={16}/> Memperbarui...</> : 'Perbarui Kata Sandi'}
            </NeuButton>
          </div>
        </form>
      </NeuCard>
    </div>
  );
}