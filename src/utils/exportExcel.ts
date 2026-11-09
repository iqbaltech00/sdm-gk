/**
 * Mengekspor data array JSON menjadi file CSV / Spreadsheet siap unduh
 * @param data Array objek data yang akan diekspor
 * @param filename Nama file unduhan (contoh: 'Laporan_Lembur_Oktober_2026.csv')
 */
export function exportToCSV(data: Record<string, any>[], filename: string = 'laporan-export.csv') {
  if (!data || data.length === 0) {
    alert('Tidak ada data yang dapat diekspor.');
    return;
  }

  // Ambil header dari kunci objek baris pertama
  const headers = Object.keys(data[0]);
  
  // Buat baris CSV
  const csvRows = [];
  csvRows.push(headers.join(',')); // Header kolom

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] !== undefined && row[header] !== null ? row[header] : '';
      // Escape tanda kutip dan koma di dalam string
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Gabungkan menjadi satu string CSV dengan BOM agar terbaca dengan baik di Excel
  const csvString = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Buat tautan unduhan sementara
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}