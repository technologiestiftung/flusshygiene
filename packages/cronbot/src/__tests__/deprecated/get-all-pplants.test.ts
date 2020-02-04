// import { IUserCollection, IPurificationPlant } from "./../common/interfaces";
// import { getSubitems } from "../requests/get-sub-items";
import nock from "nock";
const URL = "http://foo.com";
// const plant: IPurificationPlant = {
//   id: 1,
//   url: "http://foobah.com",
//   name: "foo",
// };
// jest.mock("../common/env", () => {
//   return {
//     API_URL: "http://foo.com",
//     getApiToken: jest.fn(() => {
//       return "Bearer xyz";
//     }),
//   };
// });

// jest.mock("../utils/got", () => {
//   return {
//     gotOptionsFactory: jest.fn(() => {
//       return { url: `${URL}/users/1/bathingspots/1/purificationPlants` };
//     }),
//   };
// });
nock(URL)
  // .log(console.log)
  .get("/users/1/bathingspots/1/purificationPlants")
  .reply(200, {
    // data: [plant],
    success: true,
    apiVersion: "0.0.0",
  });
describe.skip("Get all Purification plants", () => {
  test("getPPlants", async (done) => {
    // const collection: IUserCollection = {
    //   users: [
    //     {
    //       id: 1,
    //       email: "foo@bah",
    //       spots: [
    //         {
    //           id: 1,
    //           name: "foo",
    //           apiEndpoints: {},
    //           purificationPlants: [],
    //           genericInputs: [],
    //         },
    //       ],
    //     },
    //   ],
    // };
    // const res = await getSubitems(collection, "purificationPlants");
    // console.log(JSON.stringify(res, null, 2));
    // expect(res.users[0].spots[0].purificationPlants[0]).toStrictEqual(plant);
    // expect(res.users[0].spots[0].genericInputs).toBeUndefined();
    done();
  });
});
