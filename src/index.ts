import { getAvailableFiles, parseFileAsNumbers } from './parser.js';
import { reportChecker } from './red-nosed-reports.js';

function main() {
  try {
    const args = process.argv.slice(2);
    const targetFile = args.length > 0 && args[0] ? args[0] : 'input.txt';
    
    const files = getAvailableFiles();
    
    if (files.includes(targetFile)) {
      console.log(`Processing ${targetFile}\n`);
      
      const startTime = Date.now();
      const data = parseFileAsNumbers(targetFile);
      const parseTime = Date.now() - startTime;
      
      const processStart = Date.now();
      reportChecker(data, targetFile);
      const processTime = Date.now() - processStart;
      
      console.log(`Timing: Parse ${parseTime}ms | Process ${processTime}ms | Total ${parseTime + processTime}ms`);
    } else {
      console.error(`File '${targetFile}' not found.`);
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

main();