import { writeFileStr } from 'https://deno.land/std@v0.24.0/fs/write_file_str.ts';
import { parse } from 'https://deno.land/std@v0.24.0/flags/mod.ts';

function datesRange(start: Date, end: Date) {
  const arr: Date[] = [];
  for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
}

async function main() {
  let outfilePath: string;
  try {
    const args = parse(Deno.args);
    const status = await Deno.permissions.query({ name: 'write' });
    if (status.state !== 'granted') {
      throw new Error('need write permission add --allow-write to the call');
    }

    if (args.h === true || args.help === true) {
      console.log(`
mock data generator

Usage:
    deno mock-data.ts [options] [path/to/outfile.csv]
Flags:
      -h --help print help and exist
      --conc adds three values (date,conc_ec,conc_ie) to the csv (default is 2 with date,value)
      -o --outfile <filepath> set the outfile path
      `);
      Deno.exit(0);
    }

    if (
      (args.o || args.outfile) &&
      (typeof args.o === 'boolean' || typeof args.outfile === 'boolean')
    ) {
      throw new Error('outfile needs to be a file path (add an argument)');
    }

    if (args.o) {
      outfilePath = args.o;
    }
    if (args.outfile) {
      outfilePath = args.outfile;
    }
    var daylist = datesRange(
      new Date('2018-05-01 00:00:01'),
      new Date('2018-07-01 00:00:01'),
    );
    const dates = daylist.map((d) => d.toISOString());
    let data;
    if (args.conc === true) {
      data = dates.map((date) => [
        date,
        (Math.random() * 1000).toFixed(2),
        (Math.random() * 1000).toFixed(2),
      ]);
    } else {
      data = dates.map((date) => [date, (Math.random() * 1000).toFixed(2)]);
    }

    const out = data
      .map(
        (elem) =>
          `${elem[0].replace(/T/g, ' ').replace(/\.000Z/g, '')},${elem[1]}${
            elem[2] ? `,${elem[2]}` : ''
          }`,
      )
      .join('\n');

    await writeFileStr(
      outfilePath
        ? outfilePath
        : `../../__test-files/MOCK_DATA-${Date.now()}.csv`,
      `${args.conc ? 'date,conc_ie,conc_ec' : 'date,value'}\n${out}\n`,
    );
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
