interface OvertimeResult {
  hours: number;
  isHoliday: boolean;
  totalMultipliedHours: number;
  breakdownText: string;
  hourlyRate: number;
  estimatedCost: number;
}

export function calculateOvertimeHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);
  
  let t1 = h1 * 60 + m1;
  let t2 = h2 * 60 + m2;
  
  if (t2 < t1) t2 += 24 * 60; // Overnight shift
  return Number(((t2 - t1) / 60).toFixed(1));
}

export function calculateProgressiveMultiplier(hours: number, isHoliday: boolean, baseSalary: number = 4350000, divisor: number = 173): OvertimeResult {
  let totalMultiplied = 0;
  let breakdownText = '';

  if (!isHoliday) {
    // HARI KERJA NORMAL: Jam ke-1 = 1.5x, sisanya = 2.0x
    if (hours <= 1) {
      totalMultiplied = hours * 1.5;
      breakdownText = `${hours}j × 1.5x (${totalMultiplied.toFixed(1)}j setara)`;
    } else {
      const h1 = 1.5;
      const rem = hours - 1;
      const h2 = rem * 2.0;
      totalMultiplied = h1 + h2;
      breakdownText = `1j × 1.5x + ${rem.toFixed(1)}j × 2.0x (${totalMultiplied.toFixed(1)}j setara)`;
    }
  } else {
    // HARI LIBUR: Jam 1-7 = 2.0x, Jam 8 = 3.0x, Jam 9+ = 4.0x
    if (hours <= 7) {
      totalMultiplied = hours * 2.0;
      breakdownText = `${hours}j × 2.0x (${totalMultiplied.toFixed(1)}j setara)`;
    } else if (hours <= 8) {
      const h1 = 14; // 7 * 2.0
      const rem = hours - 7;
      const h2 = rem * 3.0;
      totalMultiplied = h1 + h2;
      breakdownText = `7j × 2.0x + ${rem.toFixed(1)}j × 3.0x (${totalMultiplied.toFixed(1)}j setara)`;
    } else {
      const h1 = 14; // 7 * 2.0
      const h2 = 3;  // 1 * 3.0
      const rem = hours - 8;
      const h3 = rem * 4.0;
      totalMultiplied = h1 + h2 + h3;
      breakdownText = `7j × 2.0x + 1j × 3.0x + ${rem.toFixed(1)}j × 4.0x (${totalMultiplied.toFixed(1)}j setara)`;
    }
  }

  const hourlyRate = Math.round(baseSalary / divisor);
  const estimatedCost = Math.round(totalMultiplied * hourlyRate);

  return {
    hours,
    isHoliday,
    totalMultipliedHours: totalMultiplied,
    breakdownText,
    hourlyRate,
    estimatedCost
  };
}