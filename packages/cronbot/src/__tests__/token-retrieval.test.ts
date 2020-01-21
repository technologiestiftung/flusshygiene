jest.mock("../auth/token", () => {
  return {
    getToken: jest.fn(() => {
      const res = "Bearer xyz";
      process.env.CRONBOT_API_TOKEN = res;
      return res;
    }),
  };
});
let TOKEN: string | undefined;

// afterAll(() => {
//   jest.clearAllMocks();
//   delete process.env.CRONBOT_API_TOKEN;
// });

describe("Getting tokens", () => {
  test.skip("token process env should exist", () => {
    expect(TOKEN).toBeDefined();
  });
});
