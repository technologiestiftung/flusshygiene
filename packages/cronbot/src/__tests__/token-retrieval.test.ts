import { getToken, getNewToken, IToken } from "../auth/token";
jest.mock("../auth/token", () => {
  return {
    getNewToken: jest.fn(() => {
      return { token_type: "Bearer", access_token: "xyz" };
    }),
    getToken: jest.fn(() => {
      const res = "Bearer xyz";
      process.env.CRONBOT_API_TOKEN = res;
      return res;
    }),
  };
});
let TOKEN: string | undefined;

afterAll(() => {
  jest.clearAllMocks();
  delete process.env.CRONBOT_API_TOKEN;
});

describe("Getting tokens", () => {
  test.skip("token process env should exist", () => {
    expect(TOKEN).toBeDefined();
  });

  test("Getting new token", async () => {
    const res = await getNewToken();
    expect(res).toMatchObject<IToken>({
      token_type: "Bearer",
      access_token: "xyz",
    });
  });
  test("Token should not be in process.env", async () => {
    const token = await getToken();
    expect(token).toBeDefined();
    expect(token.startsWith("Bearer ")).toBe(true);
    expect(process.env.CRONBOT_API_TOKEN).toBeDefined();
    // console.log(token); // eslint-disable-line
  });
});
