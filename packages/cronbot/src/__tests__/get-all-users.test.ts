// import { getUsers, getUsersRequest } from "../requests/get-data";
import { getUsers } from "../requests/get-data";
import nock from "nock";
const URL = "http://foo.com";
const user = { id: 1, email: "foo@bah.com" };
jest.mock("../common/env", () => {
  return {
    API_URL: "http://foo.com",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
jest.mock("../utils/got", () => {
  return {
    gotOptionsFactory: jest.fn(() => {
      return { url: `${URL}/users` };
    }),
  };
});
nock(URL)
  .get("/users")
  .reply(200, {
    data: [user],
    success: true,
    apiVersion: "0.0.0",
  });

describe("get all users from API", () => {
  test("Getting all users", async (done) => {
    const usersRes = await getUsers(`${URL}/users`);
    expect(usersRes).toBeDefined();
    expect(usersRes.data[0].id).toBe(user.id);
    expect(usersRes.data[0]).toStrictEqual(user);
    done();
    // expect(usersRes.data).toBeDefined();
    // expect(usersRes.apiVersion).toBeDefined();
    // expect(usersRes.success).toBeDefined();
  });
});
