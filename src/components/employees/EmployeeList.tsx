import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Settings, ArrowUpDown, FileText, Loader2, 
  Shuffle, Upload, FolderPlus, AlertTriangle, Power, Download 
} from 'lucide-react';
import { NeuCard } from '../ui/NeuCard';
import { NeuBadge } from '../ui/NeuBadge';
import { NeuInput } from '../ui/NeuForms';
import { NeuButton } from '../ui/NeuButton';
import { fetchEmployees } from '../../services/api';
import { EmployeeActionModal } from './EmployeeActionModal';

export function EmployeeList() {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [openDropdownNik, setOpenDropdownNik] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'mutasi' | 'dok_utama' | 'dok_lain' | 'sp' | 'status' | 'pdf' | null;
    employee: any;
  }>({ isOpen: false, actionType: null, employee: null });

  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    loadEmployees();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownNik(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    const data = await fetchEmployees();
    if (data.length === 0) {
      setEmployees([
        { nik: 'SGN001', nama: 'Budi Santoso', jabatan: 'Supervisor', stasiun: 'GILINGAN', bagian: 'TEKNIK', status_karyawan: 'Pelaksana', status: 'Aktif', sp: '-' },
        { nik: 'SGN002', nama: 'Siti Aminah', jabatan: 'Operator Pemurnian', stasiun: 'PEMURNIAN', bagian: 'PENGOLAHAN', status_karyawan: 'PKWT LMG', status: 'Non-Aktif', sp: 'SP 1' },
      ]);
    } else {
      setEmployees(data);
    }
    setIsLoading(false);
  };

  const filteredData = employees.filter(emp => 
    (emp.nama?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (emp.nik?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleActionClick = (actionName: 'mutasi' | 'dok_utama' | 'dok_lain' | 'sp' | 'status' | 'pdf', emp: any) => {
    setOpenDropdownNik(null);
    setModalState({
      isOpen: true,
      actionType: actionName,
      employee: emp
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-4 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-neu-muted" />
        </div>
        <NeuInput 
          type="text" 
          placeholder="Cari NIK atau Nama..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <NeuCard className="p-4 overflow-x-visible">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center gap-2 text-neu-muted">
            <Loader2 className="animate-spin" size={24} /> Memuat data dari Supabase...
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-neu-muted uppercase font-bold text-xs">
                  <th className="px-3 py-2">NIK</th>
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Jabatan & Status</th>
                  <th className="px-3 py-2">Bagian & Stasiun</th>
                  <th className="px-3 py-2">Dokumen</th>
                  <th className="px-3 py-2">Keaktifan & SP</th>
                  <th className="px-3 py-2 text-center">Aksi HR</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((emp) => {
                  const isDropdownOpen = openDropdownNik === emp.nik;
                  return (
                    <tr key={emp.nik || emp.id} className="bg-neu-bg shadow-[2px_2px_6px_#b8c2d1,-2px_-2px_6px_#ffffff] rounded-xl relative">
                      <td className="px-3 py-3 rounded-l-xl font-bold">{emp.nik}</td>
                      <td className="px-3 py-3 font-semibold">{emp.nama}</td>
                      <td className="px-3 py-3">
                        {emp.jabatan || emp.jabatan_karyawan}<br/>
                        <NeuBadge variant="dark" className="mt-1">{emp.status_karyawan}</NeuBadge>
                      </td>
                      <td className="px-3 py-3">
                        <strong>{emp.bagian}</strong><br/>
                        <span className="text-blue-600 font-bold text-xs">{emp.stasiun}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1 flex-wrap">
                          <NeuBadge variant="info" className="px-2 py-0.5 text-[10px]"><FileText size={10} className="inline mr-1"/>KTP</NeuBadge>
                          <NeuBadge variant="info" className="px-2 py-0.5 text-[10px]"><FileText size={10} className="inline mr-1"/>KK</NeuBadge>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <NeuBadge variant={emp.status === 'Aktif' ? 'success' : 'danger'}>{emp.status || 'Aktif'}</NeuBadge><br/>
                        <small className="text-neu-muted font-bold block mt-1">SP: {emp.sp && emp.sp !== '-' ? <span className="text-red-500">{emp.sp}</span> : '-'}</small>
                      </td>
                      
                      <td 
                        className="px-3 py-3 rounded-r-xl text-center relative" 
                        ref={(node) => {
                          if (isDropdownOpen) {
                            dropdownRef.current = node;
                          }
                        }}
                      >
                        <NeuButton 
                          variant="primary" 
                          className="px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 shadow-md"
                          onClick={() => setOpenDropdownNik(isDropdownOpen ? null : emp.nik)}
                        >
                          <Settings size={14} /> Aksi HR ▾
                        </NeuButton>

                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-60 bg-neu-bg rounded-2xl shadow-[6px_6px_16px_#b8c2d1,-6px_-6px_16px_#ffffff] border border-white/80 z-[999] py-2 text-left animate-in fade-in zoom-in-95 duration-150">
                            <button onClick={() => handleActionClick('mutasi', emp)} className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors">
                              <Shuffle size={15} className="text-blue-500" /> Mutasi Stasiun/PG
                            </button>
                            <button onClick={() => handleActionClick('dok_utama', emp)} className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors">
                              <Upload size={15} className="text-emerald-500" /> Ubah Dok Utama
                            </button>
                            <button onClick={() => handleActionClick('dok_lain', emp)} className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors">
                              <FolderPlus size={15} className="text-cyan-600" /> Input Dokumen Lain
                            </button>
                            <button onClick={() => handleActionClick('sp', emp)} className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors">
                              <AlertTriangle size={15} className="text-red-500" /> Terbitkan SP
                            </button>
                            <button onClick={() => handleActionClick('status', emp)} className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors">
                              <Power size={15} className="text-amber-500" /> Ubah Status Keaktifan
                            </button>
                            <div className="my-1.5 border-t border-gray-300/60 mx-3"></div>
                            <button onClick={() => handleActionClick('pdf', emp)} className="w-full px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white flex items-center gap-3 transition-colors rounded-b-xl">
                              <Download size={15} className="text-blue-600" /> Download PDF History
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </NeuCard>

      <EmployeeActionModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, actionType: null, employee: null })}
        actionType={modalState.actionType}
        employee={modalState.employee}
        onSuccess={loadEmployees}
      />
    </div>
  );
}