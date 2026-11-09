import { supabase } from '../lib/supabase';
import { uploadFileToSupabase } from './storage';

// ==========================================
// 1. SERVICE KARYAWAN (EMPLOYEES)
// ==========================================
export async function fetchEmployees() {
  const { data, error } = await supabase
    .from('karyawan')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching employees:', error.message);
    return [];
  }
  return data || [];
}

export async function createEmployee(employeeData: {
  nik: string;
  nama: string;
  jabatan: string;
  status_karyawan: string;
  stasiun: string;
  bagian: string;
  email?: string;
  no_hp?: string;
}) {
  const { data, error } = await supabase
    .from('karyawan')
    .insert([employeeData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Mutasi Stasiun / PG & Insert log riwayat_mutasi
export async function executeEmployeeMutation(mutationData: {
  nik: string;
  stasiun_lama: string;
  stasiun_baru: string;
  bagian_baru: string;
  alasan: string;
  created_by?: string;
}) {
  const { error: updateError } = await supabase
    .from('karyawan')
    .update({
      stasiun: mutationData.stasiun_baru,
      bagian: mutationData.bagian_baru,
    })
    .eq('nik', mutationData.nik);

  if (updateError) throw updateError;

  const { data, error: insertError } = await supabase
    .from('riwayat_mutasi')
    .insert([{
      nik: mutationData.nik,
      stasiun_lama: mutationData.stasiun_lama,
      stasiun_baru: mutationData.stasiun_baru,
      bagian_baru: mutationData.bagian_baru,
      alasan: mutationData.alasan,
      created_by: mutationData.created_by || 'system'
    }])
    .select()
    .single();

  if (insertError) throw insertError;
  return data;
}

// Ubah Status Keaktifan Karyawan
export async function updateEmployeeStatus(nik: string, newStatus: string, catatan: string) {
  const { data, error } = await supabase
    .from('karyawan')
    .update({ status: newStatus })
    .eq('nik', nik)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Insert Surat Peringatan (SP) + Upload File SP ke Storage
export async function insertDisciplinarySP(spData: {
  nik: string;
  tingkat_sp: string;
  alasan: string;
  berlaku_sampai: string;
  file?: File;
  created_by?: string;
}) {
  let fileUrl = '';
  
  if (spData.file) {
    const uploadRes = await uploadFileToSupabase(spData.file, 'employee-docs', `sp/${spData.nik}`);
    if ('error' in uploadRes) {
      throw new Error(uploadRes.error);
    }
    fileUrl = uploadRes.publicUrl;
  }

  const { data, error: insertError } = await supabase
    .from('riwayat_sp')
    .insert([{
      nik: spData.nik,
      tingkat_sp: spData.tingkat_sp,
      alasan: spData.alasan,
      berlaku_sampai: spData.berlaku_sampai,
      file_url: fileUrl,
      created_by: spData.created_by || 'system'
    }])
    .select()
    .single();

  if (insertError) throw insertError;

  await supabase
    .from('karyawan')
    .update({ sp: spData.tingkat_sp })
    .eq('nik', spData.nik);

  return data;
}

// Upload Dokumen Utama / Dokumen Lain ke Storage & riwayat_dokumen
export async function uploadEmployeeDocument(docData: {
  nik: string;
  jenis_dokumen: string;
  keterangan_lain?: string;
  expired_date?: string;
  file: File;
}) {
  const uploadRes = await uploadFileToSupabase(docData.file, 'employee-docs', `documents/${docData.nik}`);
  if ('error' in uploadRes) {
    throw new Error(uploadRes.error);
  }

  const { data, error: insertError } = await supabase
    .from('riwayat_dokumen')
    .insert([{
      nik: docData.nik,
      jenis_dokumen: docData.jenis_dokumen,
      keterangan_lain: docData.keterangan_lain || null,
      file_url: uploadRes.publicUrl,
      expired_date: docData.expired_date || null
    }])
    .select()
    .single();

  if (insertError) throw insertError;
  return data;
}

// ==========================================
// 2. SERVICE LEMBUR & SPL (OVERTIME)
// ==========================================
export async function fetchOvertimeRequests() {
  const { data, error } = await supabase
    .from('spl_lembur')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching overtime:', error.message);
    return [];
  }
  return data || [];
}

export async function createOvertimeRequest(splData: {
  id_spl: string;
  nik: string;
  nama: string;
  stasiun: string;
  tipe_hari: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  durasi_jam: number;
  estimasi_biaya: number;
  alasan: string;
  skor_risiko: string;
}) {
  const { data, error } = await supabase
    .from('spl_lembur')
    .insert([splData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOvertimeStep(id: string, newStep: number, statusText: string) {
  const { data, error } = await supabase
    .from('spl_lembur')
    .update({ step: newStep, status: statusText })
    .eq('id_spl', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==========================================
// 3. SERVICE PENGAJUAN CUTI (LEAVE)
// ==========================================
export async function fetchLeaveRequests() {
  const { data, error } = await supabase
    .from('pengajuan_cuti')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leave:', error.message);
    return [];
  }
  return data || [];
}

export async function createLeaveRequest(leaveData: {
  id_cuti: string;
  nik: string;
  nama: string;
  jenis_cuti: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan: string;
}) {
  const { data, error } = await supabase
    .from('pengajuan_cuti')
    .insert([leaveData])
    .select()
    .single();

  if (error) throw error;
  return data;
}
// ==========================================
// 4. SERVICE KEBIJAKAN & KALENDER LEMBUR (OVERTIME POLICY)
// ==========================================
export async function fetchUnitConfiguration() {
  const { data, error } = await supabase
    .from('konfigurasi_unit')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching unit config:', error.message);
    return { gaji_pokok_minimum: 4350000, divisor: 173 };
  }
  return data || { gaji_pokok_minimum: 4350000, divisor: 173 };
}

export async function updateUnitConfiguration(config: { gaji_pokok_minimum: number; divisor: number }) {
  const { data: existingList, error: fetchError } = await supabase
    .from('konfigurasi_unit')
    .select('id')
    .limit(1);

  if (fetchError) {
    throw fetchError;
  }

  if (existingList && existingList.length > 0) {
    const existingId = existingList[0].id;
    const { data, error } = await supabase
      .from('konfigurasi_unit')
      .update({
        gaji_pokok_minimum: config.gaji_pokok_minimum,
        divisor: config.divisor,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('konfigurasi_unit')
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function fetchHolidays() {
  const { data, error } = await supabase
    .from('kalender_libur')
    .select('*')
    .order('tanggal', { ascending: true });

  if (error) {
    console.error('Error fetching holidays:', error.message);
    return [];
  }
  return data || [];
}

export async function addHoliday(holiday: { tanggal: string; keterangan: string }) {
  const { data, error } = await supabase
    .from('kalender_libur')
    .insert([holiday])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHoliday(id: string) {
  const { error } = await supabase
    .from('kalender_libur')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
// ==========================================
// 5. SERVICE DOSSIER & CUTI (LEAVE & DOSSIER)
// ==========================================
export async function fetchEmployeeDossier(nik: string) {
  try {
    // 1. Ambil data utama karyawan
    const { data: karyawan, error: empError } = await supabase
      .from('karyawan')
      .select('*')
      .eq('nik', nik)
      .single();

    if (empError) throw empError;

    // 2. Ambil riwayat mutasi
    const { data: mutasi } = await supabase
      .from('riwayat_mutasi')
      .select('*')
      .eq('nik', nik)
      .order('created_at', { ascending: false });

    // 3. Ambil riwayat SP
    const { data: sp } = await supabase
      .from('riwayat_sp')
      .select('*')
      .eq('nik', nik)
      .order('created_at', { ascending: false });

    // 4. Ambil riwayat dokumen
    const { data: dokumen } = await supabase
      .from('riwayat_dokumen')
      .select('*')
      .eq('nik', nik)
      .order('created_at', { ascending: false });

    return {
      karyawan,
      mutasi: mutasi || [],
      sp: sp || [],
      dokumen: dokumen || []
    };
  } catch (err: any) {
    console.error('Gagal mengambil dossier karyawan:', err.message);
    return null;
  }
}

export async function updateLeaveStatus(id: string, newStatus: 'Disetujui' | 'Ditolak') {
  const { data, error } = await supabase
    .from('pengajuan_cuti')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}