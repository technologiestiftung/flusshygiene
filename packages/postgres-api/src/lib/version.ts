import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve(__dirname, '../../package.json');
const fileContent = fs.readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(fileContent);
export const version = pkg.version;
