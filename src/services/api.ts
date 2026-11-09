import { supabase } from '../lib/supabase';

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