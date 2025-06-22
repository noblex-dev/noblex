import fs from "fs";
import path from "path";

/**
 * Recursively find files matching any of the given patterns in a directory tree,
 * while excluding files matching any ignore pattern.
 *
 * @param dir Root directory to search.
 * @param patterns Array of RegExp patterns to match against file paths.
 * @param ignorePatterns Array of RegExp patterns to exclude matching file paths.
 * @returns List of matching file paths or empty array.
 */
function findFiles(
  dir: string,
  patterns: RegExp[],
  ignorePatterns: RegExp[] = []
): string[] {
  const result: string[] = [];

  function search(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        search(fullPath);
      } else {
        const isIgnored = ignorePatterns.some((re) => re.test(fullPath));
        const isMatched = patterns.some((re) => re.test(fullPath));
        if (!isIgnored && isMatched) {
          result.push(fullPath);
        }
      }
    }
  }

  search(dir);
  return result;
}

export default findFiles;
