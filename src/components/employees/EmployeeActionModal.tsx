// src/components/employees/EmployeeActionModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Shuffle, Upload, FolderPlus, AlertTriangle, Power, Download, CheckCircle, Loader2 } from 'lucide-react';
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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EmployeeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'mutasi' | 'dok_utama' | 'dok_lain' | 'sp' | 'status' | 'pdf' | null;
  employee: any;
  onSuccess?: () => void;
}

// Pemetaan standar Stasiun ke Bagian SGN (Pembaruan Terbaru)
const STASIUN_BAGIAN_MAP: Record<string, string> = {
  // Instalasi
  'GILINGAN': 'INSTALASI',
  'KETEL': 'INSTALASI',
  'LISTRIK & INSTRUMENT': 'INSTALASI',
  'BESALI': 'INSTALASI',
  
  // Pengolahan
  'PEMURNIAN': 'PENGOLAHAN',
  'PENGUAPAN': 'PENGOLAHAN',
  'MASAKAN': 'PENGOLAHAN',
  'PUTARAN': 'PENGOLAHAN',
  'SUGAR HANDLING': 'PENGOLAHAN',
  
  // Quality Assurance
  'QA ON FARM': 'QUALITY ASSURANCE',
  'QA OFF FARM': 'QUALITY ASSURANCE',
  
  // Keuangan & Umum
  'KEUANGAN & GUDANG': 'KEUANGAN & UMUM',
  'SDM&UMUM': 'KEUANGAN & UMUM',
  'AKUTANSI & ADMIN HASIL': 'KEUANGAN & UMUM',
  
  // Tanaman
  'TANAMAN WIL 1': 'TANAMAN',
  'TANAMAN WIL 2': 'TANAMAN',
  'TANAMAN WIL 3': 'TANAMAN',
  'TANAMAN WIL 4': 'TANAMAN',
  'TANAMAN WIL 5': 'TANAMAN',
  'TMA': 'TANAMAN',
  'BUDIDAYA': 'TANAMAN'
};

export function EmployeeActionModal({ isOpen, onClose, actionType, employee, onSuccess }: EmployeeActionModalProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [stasiunBaru, setStasiunBaru] = useState('GILINGAN');
  const [bagianBaru, setBagianBaru] = useState('INSTALASI');
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
      const initialStasiun = employee.stasiun || 'GILINGAN';
      setStasiunBaru(initialStasiun);
      setBagianBaru(STASIUN_BAGIAN_MAP[initialStasiun] || employee.bagian || 'INSTALASI');
      setStatusBaru(employee.status || 'Aktif');
    }
    setSuccessMsg('');
    setErrorMsg('');
  }, [employee, actionType]);

  const handleStasiunChange = (val: string) => {
    setStasiunBaru(val);
    setBagianBaru(STASIUN_BAGIAN_MAP[val] || 'UMUM');
  };

  if (!isOpen || !employee) return null;

  const handleDownloadDossierPDF = async () => {
    setGeneratingPdf(true);
    try {
      const dossier = await fetchEmployeeDossier(employee.nik);
      setGeneratingPdf(false);

      if (!dossier) {
        alert('Gagal mengambil data dossier karyawan.');
        return;
      }

      const doc = new jsPDF();
      
      doc.setFontSize(14);
      doc.setTextColor(43, 108, 176); 
      doc.text('PT SINERGI GULA NUSANTARA', 14, 18);
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('SGN HR SUPER APP — DOSSIER & RIWAYAT PEKERJA', 14, 24);
      doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 29);

      doc.setDrawColor(43, 108, 176);
      doc.setLineWidth(0.5);
      doc.line(14, 33, 196, 33);

      doc.setFontSize(11);
      doc.setTextColor(45, 55, 72);
      doc.text('1. Informasi Profil Utama', 14, 42);

      autoTable(doc, {
        startY: 46,
        head: [['Atribut', 'Keterangan']],
        body: [
          ['NIK', dossier.karyawan.nik],
          ['Nama Lengkap', dossier.karyawan.nama],
          ['Jabatan', dossier.karyawan.jabatan || '-'],
          ['Status Karyawan', dossier.karyawan.status_karyawan],
          ['Stasiun / Bagian', `${dossier.karyawan.stasiun} / ${dossier.karyawan.bagian}`],
          ['Status Keaktifan', dossier.karyawan.status || 'Aktif']
        ],
        theme: 'grid',
        headStyles: { fillColor: [43, 108, 176] },
        styles: { fontSize: 9, cellPadding: 3 }
      });

      let finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 70;

      doc.text('2. Riwayat Mutasi Stasiun / Unit Kerja', 14, finalY);
      const mutasiBody = dossier.mutasi.length > 0 
        ? dossier.mutasi.map((m: any) => [m.stasiun_lama || '-', m.stasiun_baru, m.bagian_baru, m.alasan, new Date(m.created_at).toLocaleDateString('id-ID')])
        : [['-', 'Tidak ada riwayat mutasi', '-', '-', '-']];

      autoTable(doc, {
        startY: finalY + 4,
        head: [['Stasiun Lama', 'Stasiun Baru', 'Bagian Baru', 'Alasan', 'Tanggal']],
        body: mutasiBody,
        theme: 'grid',
        headStyles: { fillColor: [43, 108, 176] },
        styles: { fontSize: 8, cellPadding: 3 }
      });

      finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : finalY + 40;

      doc.text('3. Riwayat Disiplin (Surat Peringatan / SP)', 14, finalY);
      const spBody = dossier.sp.length > 0
        ? dossier.sp.map((s: any) => [s.tingkat_sp, s.alasan, s.berlaku_sampai, new Date(s.created_at).toLocaleDateString('id-ID')])
        : [['-', 'Bersih dari catatan Surat Peringatan', '-', '-']];

      autoTable(doc, {
        startY: finalY + 4,
        head: [['Tingkat SP', 'Alasan Pelanggaran', 'Berlaku Sampai', 'Tanggal Terbit']],
        body: spBody,
        theme: 'grid',
        headStyles: { fillColor: [229, 62, 62] }, 
        styles: { fontSize: 8, cellPadding: 3 }
      });

      finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : finalY + 40;

      doc.text('4. Rekam Jejak Dokumen & Sertifikasi', 14, finalY);
      const dokBody = dossier.dokumen.length > 0
        ? dossier.dokumen.map((d: any) => [d.jenis_dokumen, d.keterangan_lain || '-', d.expired_date || 'Selamanya', new Date(d.created_at).toLocaleDateString('id-ID')])
        : [['-', 'Belum ada dokumen tercatat', '-', '-']];

      autoTable(doc, {
        startY: finalY + 4,
        head: [['Jenis Dokumen', 'Keterangan', 'Masa Berlaku', 'Tanggal Upload']],
        body: dokBody,
        theme: 'grid',
        headStyles: { fillColor: [56, 161, 105] }, 
        styles: { fontSize: 8, cellPadding: 3 }
      });

      doc.save(`Dossier_${employee.nik}_${employee.nama.replace(/\s+/g, '_')}.pdf`);
    } catch (err: any) {
      setGeneratingPdf(false);
      alert('Gagal mengunduh file PDF Dossier: ' + err.message);
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
                  <NeuSelect value={stasiunBaru} onChange={(e) => handleStasiunChange(e.target.value)} required>
                    <optgroup label="INSTALASI">
                      <option value="GILINGAN">Gilingan</option>
                      <option value="KETEL">Ketel</option>
                      <option value="LISTRIK & INSTRUMENT">Listrik & Instrument</option>
                    </optgroup>
                    <optgroup label="PENGOLAHAN">
                      <option value="PEMURNIAN">Pemurnian</option>
                      <option value="PENGUAPAN">Penguapan</option>
                      <option value="MASAKAN">Masakan</option>
                      <option value="PUTARAN">Putaran</option>
                      <option value="SUGAR HANDLING">Sugar Handling</option>
                    </optgroup>
                    <optgroup label="QUALITY ASSURANCE">
                      <option value="QA ON FARM">QA On Farm</option>
                      <option value="QA OFF FARM">QA Off Farm</option>
                    </optgroup>
                    <optgroup label="KEUANGAN & UMUM">
                      <option value="KEUANGAN & GUDANG">Keuangan & Gudang</option>
                      <option value="SDM&UMUM">SDM & Umum</option>
                      <option value="AKUTANSI & ADMIN HASIL">Akuntansi & Admin Hasil</option>
                    </optgroup>
                    <optgroup label="TANAMAN">
                      <option value="TANAMAN WIL 1">Tanaman Wilayah 1</option>
                      <option value="TANAMAN WIL 2">Tanaman Wilayah 2</option>
                      <option value="TANAMAN WIL 3">Tanaman Wilayah 3</option>
                      <option value="TANAMAN WIL 4">Tanaman Wilayah 4</option>
                      <option value="TANAMAN WIL 5">Tanaman Wilayah 5</option>
                      <option value="TMA">TMA</option>
                      <option value="BUDIDAYA">Budidaya</option>
                    </optgroup>
                  </NeuSelect>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neu-muted mb-1">Bagian / Unit Kerja (Otomatis Mengikat Stasiun)</label>
                  <NeuInput type="text" value={bagianBaru} readOnly className="bg-gray-100 font-bold text-blue-600 cursor-not-allowed" required />
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
                <p className="text-sm text-neu-muted mb-3">Dossier lengkap riwayat karyawan <strong className="text-gray-900">{employee.nama}</strong> siap diunduh secara otomatis sebagai dokumen PDF resmi.</p>
                <NeuButton variant="primary" type="button" onClick={handleDownloadDossierPDF} disabled={generatingPdf}>
                  {generatingPdf ? <><Loader2 className="animate-spin mr-2" size={16}/> Mengunduh File PDF...</> : <><Download size={16} className="mr-2" /> Download Otomatis File PDF Dossier</>}
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