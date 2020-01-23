// import { IDataCollection, ISpotData } from "../common/interfaces";
// import got from "got";
// import { IUserCollection } from "../common/interfaces";
// export const getApiEndpointsData: (
//   collection: IUserCollection,
// ) => Promise<IDataCollection> = async (collection) => {
//   try {
//     const tasks: Promise<void>[] = [];
//     const data: IDataCollection = { users: [] };
//     collection.users.forEach((user, userIndex) => {
//       data.users.push({ ...collection.users[userIndex], spots: [] });
//       user.spots.forEach((spot, spotIndex) => {
//         const spotData: ISpotData = {
//           ...spot,
//           apiEndpointsData: {
//             dischargesData: [],
//             globalIrradianceData: [],
//             measurementsData: [],
//           },
//           purificationPlantsData: [],
//           genericInputsData: [],
//         };
//         data.users[userIndex].spots.push(spotData);
//         Object.keys(spot.apiEndpoints).forEach((key) => {
//           // console.log(key); // eslint-disable-line
//           // console.log((spot.apiEndpoints as any)[key]); // eslint-disable-line
//           const task: Promise<void> = new Promise(async (resolve, reject) => {
//             try {
//               const reqUrl = (spot.apiEndpoints as any)[key] as string;
//               const res = await got(reqUrl);
//               const json = JSON.parse(res.body);
//               data.users[userIndex].spots[spotIndex].apiEndpointsData[
//                 key.replace("Url", "Data")
//               ] = json.data;
//               resolve();
//             } catch (e) {
//               reject(e);
//             }
//           });
//           tasks.push(task);
//         });
//         // spot.genericInputs.forEach((gi) => {
//         //   console.log(gi);
//         // });
//         //   const task: Promise<void> = new Promise(async (resolve, reject) => {
//         //     try {
//         //       const reqUrl = gi.url;
//         //       const res = await got(reqUrl);
//         //       const json = JSON.parse(res.body);
//         //       // console.log(JSON.stringify(json));
//         //       const gid: IGenericInputData = {
//         //         name: gi.name,
//         //         url: gi.url,
//         //         id: gi.id,
//         //         data: json.data,
//         //       };
//         //       console.log(gid);
//         //       // data.users[userIndex].spots[spotIndex].genericInputsData.push(
//         //       //   gid,
//         //       // );
//         //       resolve();
//         //     } catch (e) {
//         //       reject(e);
//         //     }
//         //   });
//         //   tasks.push(task);
//         // });
//       });
//     });
//     await Promise.all(tasks).catch((err) => {
//       console.error(err);
//       throw err;
//     });
//     // console.log("data", JSON.stringify(data, null, 2));
//     return data;
//   } catch (error) {
//     return error;
//   }
// };
