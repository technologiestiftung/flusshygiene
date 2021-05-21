import { logger } from "./logger";
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    logger.info(`sleep for ${ms}`);
    return setTimeout(resolve, ms);
  });
}
