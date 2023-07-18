import fs from "fs";
export function isFileZeroByte(filePath): boolean {
  try {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}
