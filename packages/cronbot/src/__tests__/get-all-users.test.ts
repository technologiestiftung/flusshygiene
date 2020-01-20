import { getAllUsers } from "./../requests/get-data";
describe("get all users from API", () => {
  test("Getting all users", async () => {
    const usersRes = await getAllUsers();
    expect(usersRes).toBeDefined();
    expect(usersRes.data).toBeDefined();
    expect(usersRes.apiVersion).toBeDefined();
    expect(usersRes.success).toBeDefined();
  });
});
