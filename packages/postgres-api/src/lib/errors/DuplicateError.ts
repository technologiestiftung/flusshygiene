export class DuplicateError extends Error {
  constructor(list: string[]) {
    const message = `Values could not be inserted. They already exist in the database.\n${list.join(
      '\n',
    )}`;
    super(message);
    this.name = 'DuplicateError';
    this.duplicates = list;
  }
  public duplicates: string[];
}
