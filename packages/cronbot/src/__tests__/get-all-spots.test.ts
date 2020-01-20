import { getSpots } from "../requests/get-data";

describe("getting spots", () => {
  test("get all existing spots", async () => {
    const res = await getSpots();
    // console.log(JSON.stringify(res, null, 2));
    expect(res).toBeDefined();
  });
});
