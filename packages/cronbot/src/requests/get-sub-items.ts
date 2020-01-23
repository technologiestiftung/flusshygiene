// import { API_URL } from "../common/env";
// import { IUserCollection, IApiResponse } from "../common/interfaces";
// import { gotOptionsFactory } from "../utils/got";
// import got from "got/dist/source";
// interface ISubitem {
//   id: number;
//   name: string;
//   url: string;
//   data?: any[];
// }

// export const getSubItemsRequest: (
//   url: string,
// ) => Promise<IApiResponse> = async (url) => {
//   try {
//     const opts = await gotOptionsFactory({
//       url,
//     });
//     const res = await got(opts).json();
//     // const json = JSON.parse(res.body);
//     return res;
//   } catch (error) {
//     return error;
//   }
// };

// export const getSubitems: (
//   collection: IUserCollection,
//   kind: "purificationPlants" | "genericInputs",
// ) => Promise<IUserCollection> = async (collection, kind) => {
//   try {
//     const tasks: Promise<void>[] = [];
//     collection.users.forEach((user, i) => {
//       user.spots.forEach((spot, j) => {
//         tasks.push(
//           new Promise(async (resolve, reject) => {
//             try {
//               // const opts = await gotOptionsFactory({
//               //   url: `${API_URL}/users/${user.id}/bathingspots/${spot.id}/${kind}`,
//               // });
//               // const res = await got(opts);
//               const url = `${API_URL}/users/${user.id}/bathingspots/${spot.id}/${kind}`;
//               const json = await getSubItemsRequest(url); //JSON.parse(res.body);
//               // console.log(json, "<-- subitems");
//               // console.log(json);
//               const data = json.data.map((gi: ISubitem) => {
//                 if (gi.url.length !== 0) {
//                   return { name: gi.name, id: gi.id, url: gi.url };
//                 }
//                 return undefined;
//               });
//               const cleandata: ISubitem[] = [];
//               for (const item of data) {
//                 if (item !== undefined) {
//                   cleandata.push(item);
//                 }
//               }
//               if (kind === "genericInputs") {
//                 collection.users[i].spots[j].genericInputs = [
//                   ...collection.users[i].spots[j].genericInputs,
//                   ...cleandata,
//                 ];
//               } else if (kind === "purificationPlants") {
//                 collection.users[i].spots[j].purificationPlants = [
//                   ...collection.users[i].spots[j].purificationPlants,
//                   ...cleandata,
//                 ];
//               } else {
//                 throw new Error("This kind does not exists");
//               }
//               resolve();
//             } catch (error) {
//               reject(error);
//             }
//           }),
//         );
//       });
//     });
//     await Promise.all(tasks).catch((err) => {
//       throw err;
//     });
//     for (let i = collection.users.length - 1; i >= 0; i--) {
//       for (let j = collection.users[i].spots.length - 1; j >= 0; j--) {
//         //  celan up apiEndpoints
//         if (collection.users[i].spots[j].apiEndpoints === null) {
//           delete collection.users[i].spots[j].apiEndpoints;
//         }
//         //  clean up generic inputs
//         if (collection.users[i].spots[j].genericInputs.length !== 0) {
//           for (
//             let k = collection.users[i].spots[j].genericInputs.length - 1;
//             k >= 0;
//             k--
//           ) {
//             if (collection.users[i].spots[j].genericInputs[k] === null) {
//               collection.users[i].spots[j].genericInputs.splice(k, 1);
//             }
//           }
//           if (collection.users[i].spots[j].genericInputs.length === 0) {
//             delete collection.users[i].spots[j].genericInputs;
//           }
//         } else {
//           delete collection.users[i].spots[j].genericInputs;
//         }
//         if (collection.users[i].spots[j].purificationPlants.length !== 0) {
//           for (
//             let k = collection.users[i].spots[j].purificationPlants.length - 1;
//             k >= 0;
//             k--
//           ) {
//             if (collection.users[i].spots[j].purificationPlants[k] === null) {
//               collection.users[i].spots[j].purificationPlants.splice(k, 1);
//             }
//           }
//           if (collection.users[i].spots[j].purificationPlants.length === 0) {
//             delete collection.users[i].spots[j].purificationPlants;
//           }
//         } else {
//           delete collection.users[i].spots[j].purificationPlants;
//         }
//         if (
//           collection.users[i].spots[j].apiEndpoints === undefined &&
//           collection.users[i].spots[j].purificationPlants === undefined &&
//           collection.users[i].spots[j].genericInputs === undefined
//         ) {
//           collection.users[i].spots.splice(j, 1);
//         }
//       }
//     }
//     for (let i = collection.users.length - 1; i >= 0; i--) {
//       if (collection.users[i].spots.length === 0) {
//         collection.users.splice(i, 1);
//       }
//     }
//     return collection;
//   } catch (error) {
//     return error;
//   }
// };
