// import got from "got";
// import { IDataCollection } from "../common/interfaces";
// export const getGenricInputData: (
//   collection: IDataCollection,
// ) => Promise<IDataCollection> = async (collection) => {
//   try {
//     const tasks: Promise<string>[] = [];
//     const data: IDataCollection = {
//       users: [],
//     };
//     // collection.users.forEach((user, _userIndex) => {
//     //   // console.log(userIndex, user);
//     //   // data.users[userIndex] = { ...user };
//     //   user.spots.forEach((spot, _spotIndex) => {
//     //     // console.log(spotIndex, spot);
//     //     spot.genericInputs.forEach((_gi, __giIndex) => {});
//     //   });
//     // });
//     // console.log("tasks", tasks);
//     // console.log(collection);
//     for (let i = 0; i < collection.users.length; i++) {
//       const userData = { ...collection.users[i] };
//       for (let j = 0; j < collection.users[i].spots.length; j++) {
//         const spotData = { ...collection.users[i].spots[j] };
//         for (
//           let k = 0;
//           k < collection.users[i].spots[j].genericInputs.length;
//           k++
//         ) {
//           const giData = { ...collection.users[i].spots[j].genericInputs[k] };
//           tasks.push(
//             new Promise(async (resolve, reject) => {
//               try {
//                 // console.log(gi);
//                 console.log("resolve " + i + " " + j);
//                 console.log(collection.users[i].spots[j].genericInputs[k]);
//                 const res = await got(
//                   collection.users[i].spots[j].genericInputs[k].url,
//                 );
//                 const json = JSON.parse(res.body);
//                 spotData.genericInputsData.push({ ...giData, data: json.data });

//                 resolve();
//               } catch (e) {
//                 reject(e);
//               }
//             }),
//           );
//         }

//         // console.log("spot", collection.users[i].spots[j]);
//         // const user = collection.users[i];
//         // data.users.push({ ...user });
//         // for (const spot of user.spots) {
//         //   data.users;
//         //   for (const gi of spot.genericInputs) {

//         // }
//         // console.log("tasks 1", tasks);
//         userData.spots.push({ ...spotData });
//       }
//       data.users.push({ ...userData });
//       console.log(data);
//     }
//     await Promise.all(tasks).catch((err) => {
//       console.error(err);
//       throw err;
//     });
//     // }

//     console.log(data);
//     return data;
//   } catch (error) {
//     return error;
//   }
// };
