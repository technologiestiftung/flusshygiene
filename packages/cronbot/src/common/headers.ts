import { version } from "../utils/package-version";
interface Headers {
  [key: string]: string;
}
export const defaultHeaders = {
  "user-agent": `cronbot ${version}`,
};

export function buildHeaders(overrides?: Headers): Headers {
  return { ...defaultHeaders, ...overrides };
}
