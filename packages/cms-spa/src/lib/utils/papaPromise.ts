import Papa from "papaparse";

export function papaPromise(file: any, opts: any): Promise<Papa.ParseResult> {
  return new Promise((complete, error) => {
    Papa.parse(file, { ...opts, complete, error });
  });
}
