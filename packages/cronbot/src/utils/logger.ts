export const logger = {
  err: (...args: any[]) => {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      console.error(...args);
    }
  },
};
