import React, { useState, useEffect } from 'react';
import { X, Shuffle, Upload, FolderPlus, AlertTriangle, Power, Download, CheckCircle } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';

interface EmployeeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'mutasi' | 'dok_utama' | 'dok_lain' | 'sp' | 'status' | 'pdf' | null;
  employee: any;
}

export function EmployeeActionModal({ isOpen, onClose, actionType, employee }: EmployeeActionModalProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [docSubtype, setDocSubtype] = useState('SKCK');

  useEffect(() => {
    if (actionType === 'dok_lain') {
      setDocSubtype('SKCK');
    }
  }, [actionType]);

  if (!isOpen || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi proses simpan ke database / Supabase
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Aksi HR berhasil disimpan ke database!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[10600] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <NeuCard className="w-full max-w-lg p-6 bg-neu-bg relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neu-muted hover:text-gray-900 p-1.5 rounded-xl shadow-[2px_2px_5px_#b8c2d1,-2px_-2px_5px_#ffffff]"
        >
          <X size={18} />
        </button>

        <div className="mb-5 pb-3 border-b border-black/5">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{employee.nik} - {employee.nama}</span>
          <h3 className="text-lg font-bold text-gray-900 m-0 flex items-center gap-2 mt-1">
            {actionType === 'mutasi' && <><Shuffle className="text-blue-500" size={20}/> Mutasi Stasiun / Pabrik Gula</>}
            {actionType === 'dok_utama' && <><Upload className="text-emerald-500" size={20}/> Ubah Dokumen Utama</>}
            {actionType === 'dok_lain' && <><FolderPlus className="text-cyan-600" size={20}/> Input Dokumen Lain (SKCK/Narkoba)</>}
            {actionType === 'sp' && <><AlertTriangle className="text-red-500" size={20}/> Terbitkan Surat Peringatan (SP)</>}
            {actionType === 'status' && <><Power className="text-amber-500" size={20}/> Ubah Status Keaktifan Karyawan</>}
            {actionType === 'pdf' && <><Download className="text-blue-600" size={20}/> Download PDF History Dossier</>}
          </h3>
        </div>

        {successMsg ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <CheckCircle size={48} className="text-emerald-500 animate-bounce" />
            <p className="font-bold text-gray-800 m-0">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* 1. Form Mutasi */}
            {actionType === 'mutasi' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Stasiun Tujuan Baru</label>
                  <NeuSelect required>
                    <option value="GILINGAN">Stasiun Gilingan</option>
                    <option value="PEMURNIAN">Stasiun Pemurnian</option>
                    <option value="PENGUAPAN">Stasiun Penguapan</option>
                    <option value="MASAKAN">Stasiun Masakan</option>
                    <option value="PUTARAN">Stasiun Putaran</option>
                    <option value="PENYELESAIAN">Stasiun Penyelesaian & Pengantongan</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Bagian / Unit Kerja</label>
                  <NeuInput type="text" placeholder="Contoh: Bagian Teknik / Pengolahan" defaultValue={employee.bagian} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Keterangan / Alasan Mutasi</label>
                  <NeuInput type="text" placeholder="Masukkan alasan rotasi/mutasi..." required />
                </div>
              </>
            )}

            {/* 2. Form Ubah Dok Utama */}
            {actionType === 'dok_utama' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Pilih Jenis Dokumen</label>
                  <NeuSelect required>
                    <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
                    <option value="KK">Kartu Keluarga (KK)</option>
                    <option value="NPWP">NPWP</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Upload File Berkas Baru (PDF / JPG)</label>
                  <NeuInput type="file" accept=".pdf,.jpg,.jpeg,.png" required className="py-2" />
                </div>
              </>
            )}

            {/* 3. Form Input Dokumen Lain (Catatan 1: Ditambahkan opsi Dokumen Lainnya & Keterangan Nama Dokumen) */}
            {actionType === 'dok_lain' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Jenis Dokumen Musiman / Pendukung</label>
                  <NeuSelect value={docSubtype} onChange={(e) => setDocSubtype(e.target.value)} required>
                    <option value="SKCK">SKCK (Surat Keterangan Catatan Kepolisian)</option>
                    <option value="NARKOBA">Surat Bebas Narkoba</option>
                    <option value="SERTIFIKAT">Sertifikat Kompetensi / K3</option>
                    <option value="LAINNYA">Dokumen Lainnya</option>
                  </NeuSelect>
                </div>

                {docSubtype === 'LAINNYA' && (
                  <div>
                    <label className="block text-xs font-bold text-neu-muted mb-1">Keterangan Nama Dokumen Lainnya</label>
                    <NeuInput type="text" placeholder="Tuliskan nama dokumen secara spesifik..." required />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Tanggal Berlaku / Expired</label>
                  <NeuInput type="date" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">File Berkas Scan</label>
                  <NeuInput type="file" accept=".pdf,.jpg,.jpeg,.png" required className="py-2" />
                </div>
              </>
            )}

            {/* 4. Form Terbitkan SP (Catatan 2: Ditambahkan kolom Upload Surat SP) */}
            {actionType === 'sp' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Tingkatan Surat Peringatan</label>
                  <NeuSelect required>
                    <option value="SP 1">Surat Peringatan 1 (SP 1)</option>
                    <option value="SP 2">Surat Peringatan 2 (SP 2)</option>
                    <option value="SP 3">Surat Peringatan 3 (SP 3 / Terakhir)</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Alasan / Kasus Pelanggaran</label>
                  <NeuInput type="text" placeholder="Deskripsikan pelanggaran disiplin..." required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Masa Berlaku Hingga</label>
                  <NeuInput type="date" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Upload File Dokumen Surat SP (PDF / JPG)</label>
                  <NeuInput type="file" accept=".pdf,.jpg,.jpeg,.png" required className="py-2" />
                </div>
              </>
            )}

            {/* 5. Form Ubah Status Keaktifan */}
            {actionType === 'status' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Status Keaktifan Baru</label>
                  <NeuSelect defaultValue={employee.status} required>
                    <option value="Aktif">Aktif Bekerja</option>
                    <option value="Non-Aktif">Non-Aktif / Tutup Giling</option>
                    <option value="Cuti Panjang">Cuti Panjang / Diluar Tanggungan</option>
                    <option value="Berhenti">Berhenti / Kontrak Berakhir</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Catatan Perubahan Status</label>
                  <NeuInput type="text" placeholder="Masukkan catatan resmi..." required />
                </div>
              </>
            )}

            {/* 6. Aksi Download PDF History */}
            {actionType === 'pdf' && (
              <NeuInset className="p-4 text-center">
                <p className="text-sm text-neu-muted mb-3">Dossier lengkap riwayat karyawan <strong className="text-gray-900">{employee.nama}</strong> siap diunduh dalam format PDF.</p>
                <NeuButton variant="primary" type="button" onClick={() => { alert('PDF history berhasil diunduh!'); onClose(); }}>
                  <Download size={16} className="mr-2" /> Unduh Dokumen PDF Sekarang
                </NeuButton>
              </NeuInset>
            )}

            {actionType !== 'pdf' && (
              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-black/5">
                <NeuButton type="button" onClick={onClose}>Batal</NeuButton>
                <NeuButton variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </NeuButton>
              </div>
            )}
          </form>
        )}
      </NeuCard>
    </div>
  );
}