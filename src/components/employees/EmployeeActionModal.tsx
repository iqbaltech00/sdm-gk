import React, { useState, useEffect } from 'react';
import { X, Shuffle, Upload, FolderPlus, AlertTriangle, Power, Download, CheckCircle, Loader2, FileText } from 'lucide-react';
import { NeuCard, NeuInset } from '../ui/NeuCard';
import { NeuButton } from '../ui/NeuButton';
import { NeuInput, NeuSelect } from '../ui/NeuForms';
import { 
  executeEmployeeMutation, 
  uploadEmployeeDocument, 
  insertDisciplinarySP, 
  updateEmployeeStatus,
  fetchEmployeeDossier 
} from '../../services/api';

interface EmployeeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'mutasi' | 'dok_utama' | 'dok_lain' | 'sp' | 'status' | 'pdf' | null;
  employee: any;
  onSuccess?: () => void;
}

export function EmployeeActionModal({ isOpen, onClose, actionType, employee, onSuccess }: EmployeeActionModalProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [stasiunBaru, setStasiunBaru] = useState('GILINGAN');
  const [bagianBaru, setBagianBaru] = useState('');
  const [alasanMutasi, setAlasanMutasi] = useState('');

  const [jenisDokUtama, setJenisDokUtama] = useState('KTP');
  const [fileDokUtama, setFileDokUtama] = useState<File | null>(null);

  const [docSubtype, setDocSubtype] = useState('SKCK');
  const [namaDokLainnya, setNamaDokLainnya] = useState('');
  const [expiredDokLain, setExpiredDokLain] = useState('');
  const [fileDokLain, setFileDokLain] = useState<File | null>(null);

  const [tingkatSp, setTingkatSp] = useState('SP 1');
  const [alasanSp, setAlasanSp] = useState('');
  const [berlakuSampaiSp, setBerlakuSampaiSp] = useState('');
  const [fileSp, setFileSp] = useState<File | null>(null);

  const [statusBaru, setStatusBaru] = useState('Aktif');
  const [catatanStatus, setCatatanStatus] = useState('');

  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (employee) {
      setBagianBaru(employee.bagian || '');
      setStasiunBaru(employee.stasiun || 'GILINGAN');
      setStatusBaru(employee.status || 'Aktif');
    }
    setSuccessMsg('');
    setErrorMsg('');
  }, [employee, actionType]);

  if (!isOpen || !employee) return null;

  const handleGenerateDossierPDF = async () => {
    setGeneratingPdf(true);
    try {
      const dossier = await fetchEmployeeDossier(employee.nik);
      setGeneratingPdf(false);

      if (!dossier) {
        alert('Gagal mengambil data dossier karyawan.');
        return;
      }

      // Buat jendela cetak laporan resmi korporat
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Pop-up diblokir oleh browser. Harap izinkan pop-up untuk mencetak PDF.');
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        html>
        <head>
          <title>Dossier Karyawan - ${employee.nik} - ${employee.nama}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #2b6cb0; }
            .header p { margin: 2px 0; font-size: 12px; color: #666; }
            .section { margin-bottom: 20px; }
            .section h4 { background: #edf2f7; padding: 8px; margin: 0 0 10px 0; border-left: 4px solid #2b6cb0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
            th, td { border: 1px solid #cbd5e0; padding: 6px 8px; text-align: left; }
            th { background: #f7fafc; }
            .footer { margin-top: 40px; text-align: right; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>PT SINERGI GULA NUSANTARA</h2>
            <p>SGN HR SUPER APP — DOSSIER & RIWAYAT PEKERJA</p>
            <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
          </div>

          <div class="section">
            <h4>1. Informasi Profil Utama</h4>
            <table>
              <tr><th>NIK</th><td>${dossier.karyawan.nik}</td><th>Nama Lengkap</th><td>${dossier.karyawan.nama}</td></tr>
              <tr><th>Jabatan</th><td>${dossier.karyawan.jabatan || '-'}</td><th>Status Karyawan</th><td>${dossier.karyawan.status_karyawan}</td></tr>
              <tr><th>Bagian / Stasiun</th><td>${dossier.karyawan.bagian} / ${dossier.karyawan.stasiun}</td><th>Status Keaktifan</th><td>${dossier.karyawan.status || 'Aktif'}</td></tr>
            </table>
          </div>

          <div class="section">
            <h4>2. Riwayat Mutasi Stasiun / Unit Kerja</h4>
            <table>
              <tr><th>Stasiun Lama</th><th>Stasiun Baru</th><th>Bagian Baru</th><th>Alasan</th><th>Tanggal</th></tr>
              ${dossier.mutasi.length > 0 ? dossier.mutasi.map((m: any) => `<tr><td>${m.stasiun_lama || '-'}</td><td>${m.stasiun_baru}</td><td>${m.bagian_baru}</td><td>${m.alasan}</td><td>${new Date(m.created_at).toLocaleDateString('id-ID')}</td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center;">Tidak ada riwayat mutasi.</td></tr>'}
            </table>
          </div>

          <div class="section">
            <h4>3. Riwayat Disiplin (Surat Peringatan / SP)</h4>
            <table>
              <tr><th>Tingkat SP</th><th>Alasan Pelanggaran</th><th>Berlaku Sampai</th><th>Tanggal Terbit</th></tr>
              ${dossier.sp.length > 0 ? dossier.sp.map((s: any) => `<tr><td>${s.tingkat_sp}</td><td>${s.alasan}</td><td>${s.berlaku_sampai}</td><td>${new Date(s.created_at).toLocaleDateString('id-ID')}</td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center;">Bersih dari catatan Surat Peringatan.</td></tr>'}
            </table>
          </div>

          <div class="section">
            <h4>4. Rekam Jejak Dokumen & Sertifikasi</h4>
            <table>
              <tr><th>Jenis Dokumen</th><th>Keterangan</th><th>Masa Berlaku</th><th>Tanggal Upload</th></tr>
              ${dossier.dokumen.length > 0 ? dossier.dokumen.map((d: any) => `<tr><td>${d.jenis_dokumen}</td><td>${d.keterangan_lain || '-'}</td><td>${d.expired_date || 'Selamanya'}</td><td>${new Date(d.created_at).toLocaleDateString('id-ID')}</td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center;">Belum ada dokumen tercatat.</td></tr>'}
            </table>
          </div>

          <div class="footer">
            <p>Departemen Sumber Daya Manusia (SDM)</p>
            <br/><br/>
            <p><strong>( __________________________ )</strong></p>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (err: any) {
      setGeneratingPdf(false);
      alert('Gagal mencetak PDF Dossier: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (actionType === 'mutasi') {
        await executeEmployeeMutation({
          nik: employee.nik,
          stasiun_lama: employee.stasiun || 'UMUM',
          stasiun_baru: stasiunBaru,
          bagian_baru: bagianBaru,
          alasan: alasanMutasi,
          created_by: 'HR Admin'
        });
      } else if (actionType === 'dok_utama') {
        if (!fileDokUtama) throw new Error('File berkas dokumen utama wajib diunggah.');
        await uploadEmployeeDocument({
          nik: employee.nik,
          jenis_dokumen: jenisDokUtama,
          file: fileDokUtama
        });
      } else if (actionType === 'dok_lain') {
        if (!fileDokLain) throw new Error('File berkas dokumen pendukung wajib diunggah.');
        const jenisFinal = docSubtype === 'LAINNYA' ? (namaDokLainnya || 'Dokumen Lainnya') : docSubtype;
        await uploadEmployeeDocument({
          nik: employee.nik,
          jenis_dokumen: jenisFinal,
          expired_date: expiredDokLain || undefined,
          file: fileDokLain
        });
      } else if (actionType === 'sp') {
        if (!fileSp) throw new Error('File surat SP wajib diunggah.');
        await insertDisciplinarySP({
          nik: employee.nik,
          tingkat_sp: tingkatSp,
          alasan: alasanSp,
          berlaku_sampai: berlakuSampaiSp,
          file: fileSp,
          created_by: 'Asman SDM'
        });
      } else if (actionType === 'status') {
        await updateEmployeeStatus(employee.nik, statusBaru, catatanStatus);
      }

      setLoading(false);
      setSuccessMsg('Aksi HR berhasil disimpan ke database Supabase!');
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
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

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <CheckCircle size={48} className="text-emerald-500 animate-bounce" />
            <p className="font-bold text-gray-800 m-0">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {actionType === 'mutasi' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Stasiun Tujuan Baru</label>
                  <NeuSelect value={stasiunBaru} onChange={(e) => setStasiunBaru(e.target.value)} required>
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
                  <NeuInput type="text" value={bagianBaru} onChange={(e) => setBagianBaru(e.target.value)} placeholder="Contoh: Bagian Teknik / Pengolahan" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Keterangan / Alasan Mutasi</label>
                  <NeuInput type="text" value={alasanMutasi} onChange={(e) => setAlasanMutasi(e.target.value)} placeholder="Masukkan alasan rotasi/mutasi..." required />
                </div>
              </>
            )}

            {actionType === 'dok_utama' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Pilih Jenis Dokumen</label>
                  <NeuSelect value={jenisDokUtama} onChange={(e) => setJenisDokUtama(e.target.value)} required>
                    <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
                    <option value="KK">Kartu Keluarga (KK)</option>
                    <option value="NPWP">NPWP</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Upload File Berkas Baru (PDF / JPG)</label>
                  <NeuInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFileDokUtama(e.target.files?.[0] || null)} required className="py-2" />
                </div>
              </>
            )}

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
                    <NeuInput type="text" value={namaDokLainnya} onChange={(e) => setNamaDokLainnya(e.target.value)} placeholder="Tuliskan nama dokumen secara spesifik..." required />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Tanggal Berlaku / Expired</label>
                  <NeuInput type="date" value={expiredDokLain} onChange={(e) => setExpiredDokLain(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">File Berkas Scan</label>
                  <NeuInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFileDokLain(e.target.files?.[0] || null)} required className="py-2" />
                </div>
              </>
            )}

            {actionType === 'sp' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Tingkatan Surat Peringatan</label>
                  <NeuSelect value={tingkatSp} onChange={(e) => setTingkatSp(e.target.value)} required>
                    <option value="SP 1">Surat Peringatan 1 (SP 1)</option>
                    <option value="SP 2">Surat Peringatan 2 (SP 2)</option>
                    <option value="SP 3">Surat Peringatan 3 (SP 3 / Terakhir)</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Alasan / Kasus Pelanggaran</label>
                  <NeuInput type="text" value={alasanSp} onChange={(e) => setAlasanSp(e.target.value)} placeholder="Deskripsikan pelanggaran disiplin..." required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Masa Berlaku Hingga</label>
                  <NeuInput type="date" value={berlakuSampaiSp} onChange={(e) => setBerlakuSampaiSp(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Upload File Dokumen Surat SP (PDF / JPG)</label>
                  <NeuInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFileSp(e.target.files?.[0] || null)} required className="py-2" />
                </div>
              </>
            )}

            {actionType === 'status' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Status Keaktifan Baru</label>
                  <NeuSelect value={statusBaru} onChange={(e) => setStatusBaru(e.target.value)} required>
                    <option value="Aktif">Aktif Bekerja</option>
                    <option value="Non-Aktif">Non-Aktif / Tutup Giling</option>
                    <option value="Cuti Panjang">Cuti Panjang / Diluar Tanggungan</option>
                    <option value="Berhenti">Berhenti / Kontrak Berakhir</option>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Catatan Perubahan Status</label>
                  <NeuInput type="text" value={catatanStatus} onChange={(e) => setCatatanStatus(e.target.value)} placeholder="Masukkan catatan resmi..." required />
                </div>
              </>
            )}

            {actionType === 'pdf' && (
              <NeuInset className="p-4 text-center">
                <p className="text-sm text-neu-muted mb-3">Dossier lengkap riwayat karyawan <strong className="text-gray-900">{employee.nama}</strong> siap diunduh dan dicetak dalam format laporan resmi.</p>
                <NeuButton variant="primary" type="button" onClick={handleGenerateDossierPDF} disabled={generatingPdf}>
                  {generatingPdf ? <><Loader2 className="animate-spin mr-2" size={16}/> Memuat Data Dossier...</> : <><Download size={16} className="mr-2" /> Cetak / Download PDF Dossier</>}
                </NeuButton>
              </NeuInset>
            )}

            {actionType !== 'pdf' && (
              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-black/5">
                <NeuButton type="button" onClick={onClose}>Batal</NeuButton>
                <NeuButton variant="primary" type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="animate-spin mr-2" size={16}/> Menyimpan...</> : 'Simpan Perubahan'}
                </NeuButton>
              </div>
            )}
          </form>
        )}
      </NeuCard>
    </div>
  );
}