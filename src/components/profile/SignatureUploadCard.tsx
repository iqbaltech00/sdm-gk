import React, { useState } from 'react';
import { CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { uploadUserSignature } from '../../services/api';

interface SignatureUploadCardProps {
  userProfile: any;
  onUpdated: () => void;
}

export function SignatureUploadCard({ userProfile, onUpdated }: SignatureUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(userProfile?.ttd_url || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !userProfile?.id) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      await uploadUserSignature(userProfile.id, file);
      setLoading(false);
      setSuccessMsg('Tanda tangan digital berhasil diunggah!');
      onUpdated();
    } catch (err: any) {
      setLoading(false);
      alert('Gagal mengunggah TTD: ' + err.message);
    }
  };

  return (
    <NeuCard className="p-6 bg-neu-bg">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 m-0">Tanda Tangan Digital (TTD)</h3>
        <p className="text-xs text-neu-muted mt-0.5">
          Unggah berkas gambar TTD Anda (disarankan format <strong className="text-gray-700">PNG transparan</strong>). TTD ini akan otomatis disematkan ke dokumen PDF saat Anda melakukan persetujuan lembur.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <NeuInset className="w-48 h-28 flex items-center justify-center p-2 bg-white/50 relative overflow-hidden">
          {preview ? (
            <img src={preview} alt="Pratinjau TTD" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-center text-neu-muted text-xs flex flex-col items-center gap-1">
              <ImageIcon size={24} />
              <span>Belum ada TTD</span>
            </div>
          )}
        </NeuInset>

        <div className="flex-1 flex flex-col gap-3 w-full">
          <div>
            <label className="block text-xs font-bold text-neu-muted mb-1.5">Pilih Berkas TTD (PNG/JPG):</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg">
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          <div className="flex justify-start">
            <NeuButton 
              variant="primary" 
              onClick={handleUpload} 
              disabled={!file || loading}
            >
              {loading ? <><Loader2 className="animate-spin mr-2" size={16}/> Mengunggah...</> : 'Simpan Tanda Tangan'}
            </NeuButton>
          </div>
        </div>
      </div>
    </NeuCard>
  );
}