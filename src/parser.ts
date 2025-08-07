import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUTS_DIR = path.join(__dirname, '..', 'inputs');

export const parseFile = (fileName: string): string[][] => {
  const filePath = path.join(INPUTS_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${fileName} not found in inputs directory`);
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  return content
    .trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .filter(row => row.length > 0 && row[0] !== '');
};

export const parseFileAsNumbers = (fileName: string): number[][] => 
  parseFile(fileName).map(row => row.map(Number));

export const getAvailableFiles = (): string[] => {
  if (!fs.existsSync(INPUTS_DIR)) {
    throw new Error('Inputs directory not found');
  }
  
  return fs.readdirSync(INPUTS_DIR)
    .filter(file => fs.statSync(path.join(INPUTS_DIR, file)).isFile());
};