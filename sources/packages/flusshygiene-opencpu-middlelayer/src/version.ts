import fs from 'fs';
import path from 'path';

interface Ipkg {
  version: string;
}

const version: () => string = () => {
  try {
    const pkg: Ipkg = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf8'),
    );
    return pkg.version;
  } catch (error) {
    throw error;
  }
};

export { version };
