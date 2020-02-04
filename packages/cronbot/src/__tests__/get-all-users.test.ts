const URL = "http://foo.com";
jest.mock("../common/env", () => {
  return {
    API_URL: "http://foo.com",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
jest.mock("../utils/got-util", () => {
  return {
    gotOptionsFactory: () => {
      return { url: "http://foo.com/users" };
    },
  };
});
import { getUsersRequest } from "../lib/requests/get-users";
// import { getUsers, getUsersRequest } from "../requests/get-data";
import { getUsers } from "../lib/requests/get-users";
import nock from "nock";
const user = { id: 1, email: "foo@bah.com" };

describe("get all users from API", () => {
  test("Getting all users", async (done) => {
    nock(URL)
      .get("/users")
      .reply(200, {
        data: [user],
        success: true,
        apiVersion: "0.0.0",
      });
    const usersRes = await getUsers(`${URL}/users`);
    expect(usersRes).toBeDefined();
    expect(usersRes.data[0].id).toBe(user.id);
    expect(usersRes.data[0]).toStrictEqual(user);
    done();
    // expect(usersRes.data).toBeDefined();
    // expect(usersRes.apiVersion).toBeDefined();
    // expect(usersRes.success).toBeDefined();
  });
  test.skip("error", async (done) => {
    nock(URL)
      .get(/.*?$/)
      .reply(500, "error");
    await expect(getUsersRequest(`${URL}/users`)).rejects.toThrow();
    done();
  });
});
