//@ts-check
const fs = require('fs');
const path = require('path');
function main() {
  try {
    console.log(process.argv);
    const args = process.argv.slice(2);
    if (args.length < 2) {
      throw new Error(`No arguments provided to ${process.argv[1]}`);
    }
    const dockerfile = args[0];
    const version = args[1];
    const filePath = path.resolve(process.cwd(), dockerfile);

    if (fs.existsSync(filePath) === false) {
      throw new Error(`${dockerfile} does not exsist`);
    }

    const content = fs.readFileSync(dockerfile, 'utf8');
    const altered = content.replace(
      /^\s*?(FROM technologiestiftung\/flusshygiene-opencpu-base):(.*?)\n/,
      `$1:${version}\n`,
    );
    fs.writeFileSync(filePath, altered, 'utf8');
  } catch (error) {}
}

main();
