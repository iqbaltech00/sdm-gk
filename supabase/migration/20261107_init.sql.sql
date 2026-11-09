-- Migrasi Skema: SGN HR Super App (Init)
-- Membuat tabel utama dan kebijakan RLS (Row Level Security)

CREATE TYPE user_role AS ENUM ('admin_bagian', 'asman_bagian', 'manager_bagian', 'asman_sdm', 'admin_sdm', 'manager_keuangan', 'gm');

-- 1. Profiles (Terkait dengan auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'admin_bagian',
  full_name TEXT,
  station TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Employees (Database Karyawan)
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nik TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  station TEXT,
  employment_status TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Overtime Requests (SPL)
CREATE TABLE public.overtime_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  overtime_date DATE NOT NULL,
  day_type TEXT NOT NULL, 
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_hours NUMERIC(4,2),
  progressive_multiplier_hours NUMERIC(4,2),
  estimated_cost NUMERIC(14,2),
  task_description TEXT,
  risk_score TEXT,
  current_step INTEGER DEFAULT 1, 
  status TEXT DEFAULT 'Menunggu Approve Asman Bagian',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_requests ENABLE ROW LEVEL SECURITY;

-- Policies untuk Profiles
CREATE POLICY "Semua pengguna login bisa melihat profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Policies untuk Employees
CREATE POLICY "Semua pengguna login bisa melihat karyawan" ON public.employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Hanya SDM & Admin Bagian yang bisa menambah/ubah karyawan" ON public.employees FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin_bagian', 'asman_sdm', 'admin_sdm'))
);

-- Policies untuk Overtime
CREATE POLICY "Semua pengguna login bisa melihat SPL" ON public.overtime_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Semua pengguna login bisa membuat SPL" ON public.overtime_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Update SPL berdasarkan step approval" ON public.overtime_requests FOR UPDATE USING (auth.role() = 'authenticated');