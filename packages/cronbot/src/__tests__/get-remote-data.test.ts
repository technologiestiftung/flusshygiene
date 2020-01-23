import { getApiEndpointsData } from "../requests/get-api-endpoints-data";
import { IUserCollection } from "../common/interfaces";
const nock = require("nock"); // eslint-disable-line
const URL = "http://foo.com";

nock(URL)
  .persist()
  .get("/measurements")
  .reply(200, {
    data: [
      {
        date: "2020-01-01",
        conc_ec: Math.random() * 100,
        conc_ie: Math.random() * 100,
      },
    ],
  });

nock(URL)
  .persist()
  .get("/discharges")
  .reply(200, { data: [{ date: "2020-01-01", value: Math.random() * 100 }] });

nock(URL)
  .persist()
  .get("/globalIrradiance")
  .reply(200, { data: [{ date: "2020-01-01", value: Math.random() * 100 }] });

nock(URL)
  .persist()
  .get("/purificationPlant")
  .reply(200, { data: [{ date: "2020-01-01", value: Math.random() * 100 }] });

nock(URL)
  .persist()
  .get("/genericInput")
  .reply(200, { data: [{ date: "2020-01-01", value: Math.random() * 100 }] });

describe("get-remote-data", () => {
  test("get remote data tests", async (done) => {
    const collection: IUserCollection = {
      users: [
        {
          id: 1,
          email: "foo@bah.com",
          spots: [
            {
              id: 1,
              name: "foo",
              apiEndpoints: {
                measurementsUrl: "http://foo.com/measurements",
                dischargesUrl: "http://foo.com/discharges",
                globalIrradianceUrl: "http://foo.com/globalIrradiance",
              },
              purificationPlants: [
                { id: 1, url: "http://foo.com/purificationPlant", name: "foo" },
              ],
              genericInputs: [
                { id: 1, url: "http://foo.com/genericInput", name: "bah" },
              ],
            },
            {
              id: 23,
              name: "bah",
              apiEndpoints: {
                measurementsUrl: "http://foo.com/measurements",
                dischargesUrl: "http://foo.com/discharges",
                globalIrradianceUrl: "http://foo.com/globalIrradiance",
              },
              purificationPlants: [
                { id: 1, url: "http://foo.com/purificationPlant", name: "foo" },
              ],
              genericInputs: [
                { id: 1, url: "http://foo.com/genericInput", name: "bah" },
              ],
            },
          ],
        },
      ],
    };
    // await expect(getRemoteData(collection)).resolves.toStrictEqual({
    //   users: [],
    // });
    const res = await getApiEndpointsData(collection);
    // console.log(JSON.stringify(res, null, 2));
    expect(res).toBeDefined();
    expect(res.users[0].email).toBe(collection.users[0].email);
    expect(res.users[0].id).toBe(collection.users[0].id);
    expect(res.users[0].spots[0].id).toBe(res.users[0].spots[0].id);
    expect(res.users[0].spots[0].apiEndpoints.dischargesUrl).toBe(
      res.users[0].spots[0].apiEndpoints.dischargesUrl,
    );

    done();
  });
});
