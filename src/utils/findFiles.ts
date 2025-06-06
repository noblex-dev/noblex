import fs from "fs";
import path from "path";

/**
 * Recursively find files matching a pattern in a directory tree.
 * @param dir Root directory to search.
 * @param pattern RegExp to match against file paths.
 * @returns List of matching file paths or empty array.
 */
function findFiles(dir: string, pattern: RegExp): string[] {
  const result: string[] = [];

  function search(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        search(fullPath); // Recurse into subdirectory
      } else if (pattern.test(fullPath)) {
        result.push(fullPath);
      }
    }
  }

  search(dir);
  return result;
}

export default findFiles;
