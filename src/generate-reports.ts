import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUTS_DIR = path.join(__dirname, '..', 'inputs');

const MIN_LEVEL_DIFFERENCE = 1;
const MAX_LEVEL_DIFFERENCE = 3;
const MIN_REPORT_LENGTH = 3;
const MAX_REPORT_LENGTH = 20;


const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateReportWithLargeDifference = (length: number): number[] => {
  const report: number[] = [];
  let currentValue = randomInt(1, 90);
  report.push(currentValue);
  
  for (let i = 1; i < length; i++) {
    if (i === 1) {
      const largeDiff = randomInt(MAX_LEVEL_DIFFERENCE + 1, Math.min(10, 100 - currentValue));
      currentValue += largeDiff;
    } else {
      const diff = randomInt(MIN_LEVEL_DIFFERENCE, MAX_LEVEL_DIFFERENCE);
      currentValue += diff;
    }
    report.push(Math.min(currentValue, 100));
  }
  
  return report;
};

const generateReportWithZeroDifference = (length: number): number[] => {
  const report: number[] = [];
  let currentValue = randomInt(1, 100);
  report.push(currentValue);
  
  for (let i = 1; i < length; i++) {
    if (i === Math.floor(length / 2)) {
      report.push(currentValue);
    } else {
      const diff = randomInt(MIN_LEVEL_DIFFERENCE, MAX_LEVEL_DIFFERENCE);
      currentValue += Math.random() > 0.5 ? diff : -diff;
      report.push(Math.max(1, Math.min(currentValue, 100)));
    }
  }
  
  return report;
};

const generateReportWithMixedDirections = (length: number): number[] => {
  const report: number[] = [];
  let currentValue = randomInt(11, 90);
  report.push(currentValue);
  
  let isIncreasing = true;
  
  for (let i = 1; i < length; i++) {
    if (Math.random() > 0.7) {
      isIncreasing = !isIncreasing;
    }
    
    const diff = randomInt(MIN_LEVEL_DIFFERENCE, MAX_LEVEL_DIFFERENCE);
    currentValue += isIncreasing ? diff : -diff;
    
    currentValue = Math.max(1, Math.min(currentValue, 100));
    report.push(currentValue);
  }
  
  return report;
};

const generateReportWithMultipleViolations = (length: number): number[] => {
  const report: number[] = [];
  let currentValue = randomInt(1, 100);
  report.push(currentValue);
  
  for (let i = 1; i < length; i++) {
    if (Math.random() > 0.6) {
      report.push(currentValue);
    } else if (Math.random() > 0.7) {
      const largeDiff = randomInt(MAX_LEVEL_DIFFERENCE + 1, 8);
      currentValue += Math.random() > 0.5 ? largeDiff : -largeDiff;
      report.push(Math.max(1, Math.min(currentValue, 100)));
    } else {
      const diff = randomInt(MIN_LEVEL_DIFFERENCE, MAX_LEVEL_DIFFERENCE);
      currentValue += Math.random() > 0.5 ? diff : -diff;
      report.push(Math.max(1, Math.min(currentValue, 100)));
    }
  }
  
  return report;
};

const generateSafeReport = (): number[] => {
  const length = randomInt(MIN_REPORT_LENGTH, MAX_REPORT_LENGTH);
  const isIncreasing = Math.random() > 0.5;
  
  const report: number[] = [];
  let currentValue = randomInt(1, 100);
  report.push(currentValue);
  
  for (let i = 1; i < length; i++) {
    const diff = randomInt(MIN_LEVEL_DIFFERENCE, MAX_LEVEL_DIFFERENCE);
    currentValue += isIncreasing ? diff : -diff;
    
    if (currentValue < 1 || currentValue > 100) {
      const smallerDiff = randomInt(MIN_LEVEL_DIFFERENCE, Math.min(MAX_LEVEL_DIFFERENCE, 2));
      const previousValue = report[i - 1];
      if (previousValue !== undefined) {
        currentValue = previousValue + (isIncreasing ? -smallerDiff : smallerDiff);
      }
    }
    
    report.push(currentValue);
  }
  
  return report;
};

const generateUnsafeReport = (): number[] => {
  const length = randomInt(MIN_REPORT_LENGTH, MAX_REPORT_LENGTH);
  const violationType = randomInt(1, 4);
  
  switch (violationType) {
    case 1:
      return generateReportWithLargeDifference(length);
    
    case 2:
      return generateReportWithZeroDifference(length);
    
    case 3:
      return generateReportWithMixedDirections(length);
    
    case 4:
    default:
      return generateReportWithMultipleViolations(length);
  }
};

export const generateRandomReports = (count: number, safeReportProbability: number = 0.5): number[][] => {
  const reports: number[][] = [];
  
  for (let i = 0; i < count; i++) {
    const shouldBeSafe = Math.random() < safeReportProbability;

    reports.push(shouldBeSafe 
      ? generateSafeReport()
      : generateUnsafeReport());
  }
  
  return reports;
};

export const saveReportsToFile = (reports: number[][], fileName: string): void => {
  const content = reports.map(report => report.join(' ')).join('\n');
  const filePath = path.join(INPUTS_DIR, fileName);
  
  fs.writeFileSync(filePath, content, 'utf-8');
};

export const generateTestData = (
  count: number = 50, 
  fileName: string = 'input.txt',
  safeReportProbability: number = 0.5
): void => {
  const reports = generateRandomReports(count, safeReportProbability);
  saveReportsToFile(reports, fileName);
};

function main() {
  const args = process.argv.slice(2);
  const reportCount = args.length > 0 && args[0] ? parseInt(args[0]) : 20;
  
  let fileName = 'input.txt';
  let safeProbability = 0.5;
  
  if (args.length > 1 && args[1]) {
    const secondArg = args[1];
    const asNumber = parseFloat(secondArg);
    
    if (!isNaN(asNumber) && asNumber >= 0 && asNumber <= 1) {
      safeProbability = asNumber;
    } else {
      fileName = secondArg;
    }
  }
  
  if (args.length > 2 && args[2]) {
    const thirdArg = parseFloat(args[2]);
    if (!isNaN(thirdArg) && thirdArg >= 0 && thirdArg <= 1) {
      safeProbability = thirdArg;
    }
  }

  if (isNaN(reportCount) || reportCount <= 0) {
    console.error('Error: Please provide a valid positive number of reports to generate.');
    process.exit(1);
  }

  if (isNaN(safeProbability) || safeProbability < 0 || safeProbability > 1) {
    console.error('Error: Safe probability must be a number between 0 and 1.');
    process.exit(1);
  }

  console.log(`Generating ${reportCount} random reports...\n`);
  generateTestData(reportCount, fileName, safeProbability);
  console.log(`Generated ${reportCount} random reports and saved to ${fileName}`);
}

main();
