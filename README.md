# Red-Nosed Reports

A TypeScript solution for the Red-Nosed Reports problem with utilities for processing and generating test data.

## Usage

Run the Red-Nosed Reports solution:

```bash
npm start                    # Process input.txt (default)
npm start example.txt        # Process specific file
```

The application will:

1. Load reports from the specified file
2. Analyze each report for safety rules
3. Display the count of safe reports

**Example output:**

```
Processing input.txt

Loaded 1000 reports from input.txt
Answer: 624 reports are safe
Timing: Parse 1ms | Process 0ms | Total 1ms
```

## Generate Test Data

The project includes a test data generator for creating random report sequences:

```bash
npm run generate-test [count] [filename_or_probability] [probability]
```

Examples:

```bash
npm run generate-test 50           # 50 reports, 50% safe
npm run generate-test 50 0.8       # 50 reports, 80% safe
npm run generate-test 50 data.txt  # 50 reports to custom file
```

Generated reports are sequences of numbers that are either "safe" (properly increasing/decreasing with 1-3 differences) or "unsafe" (violating safety rules).

## Performance Optimizations

Applied algorithm optimizations achieving **4x faster processing**:

- Early exit conditions (fail fast)
- Eliminated array allocations
- Single-pass validation
- Direction determined upfront

**Results**: 10K reports now process in 1ms (down from 4ms)

```
Before: Parse 9ms | Process 4ms | Total 13ms
After:  Parse 9ms | Process 1ms | Total 10ms
```

## Implementation Assumptions

Based on the [Advent of Code Day 2](https://adventofcode.com/2024/day/2) problem description, several assumptions were made:

- **Input format**: Each line contains space-separated integers (no validation for non-numeric data)
- **File encoding**: UTF-8 text files with standard line endings
- **Memory constraints**: Input files fit reasonably in memory for parsing

## Possible Optimizations

**Future considerations:**

- **Streaming parser**: For files >100MB (constant memory usage)
- **Parallel workers**: Split the input into batches and split them across several workers
- **Compressed input**: Support for gzipped input files
