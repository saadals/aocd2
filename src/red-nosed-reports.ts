const MIN_LEVEL_DIFFERENCE = 1;
const MAX_LEVEL_DIFFERENCE = 3;

export const isReportSafe = (levels: number[]): boolean => {
  if (levels.length < 2) return true;
  
  const firstDiff = levels[1]! - levels[0]!;
  if (Math.abs(firstDiff) < MIN_LEVEL_DIFFERENCE || Math.abs(firstDiff) > MAX_LEVEL_DIFFERENCE) {
    return false;
  }
  
  const isIncreasing = firstDiff > 0;
  
  for (let i = 1; i < levels.length - 1; i++) {
    const diff = levels[i + 1]! - levels[i]!;
    
    if (Math.abs(diff) < MIN_LEVEL_DIFFERENCE || Math.abs(diff) > MAX_LEVEL_DIFFERENCE) {
      return false;
    }
    
    if ((isIncreasing && diff <= 0) || (!isIncreasing && diff >= 0)) {
      return false;
    }
  }
  
  return true;
};

export const countSafeReports = (reports: number[][]): number => {
  return reports.filter(isReportSafe).length;
};

export const reportChecker = (reports: number[][], fileName?: string): void => {
  const fileInfo = fileName ? ` from ${fileName}` : '';
  console.log(`Loaded ${reports.length} reports${fileInfo}`);
  
  const safeCount = countSafeReports(reports);
  console.log(`Answer: ${safeCount} reports are safe`);
};
