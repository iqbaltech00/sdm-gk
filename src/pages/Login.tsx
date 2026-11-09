import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';
import { NeuCard, NeuInset } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInput, NeuSelect } from '../components/ui/NeuForms';
import { useAuthStore } from '../store/authStore';

const roleUsernames: Record<string, string> = {
  'admin_bagian': 'ADMIN_BAG_01',
  'asman_bagian': 'ASMAN_BAG_01',
  'manager_bagian': 'MGR_BAG_01',
  'asman_sdm': 'ASMAN_SDM_01',
  'admin_sdm': 'ADMIN_SDM_01',
  'manager_keuangan': 'MGR_KEU_01',
  'gm': 'GM_SGN_01'
};

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [role, setRole] = useState('asman_sdm');
  const [username, setUsername] = useState(roleUsernames['asman_sdm']);
  const [pin, setPin] = useState('12345678');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setUsername(roleUsernames[selectedRole] || 'USER_01');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi delay login
    setTimeout(() => {
      login(role as any, username);
      navigate('/');
    }, 800);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-neu-bg z-[10500] flex justify-center items-center p-5">
      <NeuCard className="w-full max-w-[440px] p-8">
        <div className="text-center mb-6">
          <NeuInset className="inline-flex p-4 mb-4 text-blue-600">
            <ShieldAlert size={40} />
          </NeuInset>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">SGN HR Super App</h3>
          <p className="text-neu-muted text-sm m-0">PT Sinergi Gula Nusantara - Unit Pabrik Gula</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-neu-muted mb-1.5">Pilih Role / Akun Akses</label>
            <NeuSelect value={role} onChange={handleRoleChange} required>
              <option value="admin_bagian">👨‍💻 Admin Bagian (Inputer)</option>
              <option value="asman_bagian">👔 Asman Bagian (Approve 1)</option>
              <option value="manager_bagian">👔 Manager Bagian (Approve 2)</option>
              <option value="asman_sdm">👨‍💼 Asman SDM (Konfigurasi & Cetak)</option>
              <option value="admin_sdm">📋 Admin SDM (HR Admin)</option>
              <option value="manager_keuangan">💰 Manager Keuangan (Cetak & Appr 4)</option>
              <option value="gm">⭐ General Manager (Approve 5)</option>
            </NeuSelect>
          </div>

          <div>
            <label className="block text-xs font-bold text-neu-muted mb-1.5">ID / Username Akun</label>
            <NeuInput 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs font-bold text-neu-muted mb-1.5">Password / PIN Akses</label>
            <NeuInput 
              type="password" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              required 
            />
          </div>

          <NeuButton type="submit" variant="primary" className="w-full py-3 text-base mt-2" disabled={isLoading}>
            {isLoading ? 'Memverifikasi...' : <><LogIn size={20} className="mr-2" /> Masuk ke Aplikasi</>}
          </NeuButton>
        </form>

        <div className="mt-8 pt-4 text-center text-neu-muted text-xs border-t border-white/40">
          <span>Soft UI Neumorphism React v1.0 (Migrated)</span>
        </div>
      </NeuCard>
    </div>
  );
}