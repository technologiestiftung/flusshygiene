// //  ██████╗ ███████╗████████╗
// // ██╔════╝ ██╔════╝╚══██╔══╝
// // ██║  ███╗█████╗     ██║
// // ██║   ██║██╔══╝     ██║
// // ╚██████╔╝███████╗   ██║
// //  ╚═════╝ ╚══════╝   ╚═╝



// export const getUsers: getResponse = async (_request, response) => {
//   let users: User[];

//   try {
//     users = await getRepository(User).find();
//     responder(response, HttpCodes.success, users);

//     // response.status(HttpCodes.success).json(users);
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));


//   }
// }

// export const getUser: getResponse = async (request, response) => {
//   let user: User | undefined;
//   try {
//     if (request.params.userId === undefined) {
//       responderMissingId(response);
//       // throw new Error('mssing id paramter');
//     }
//     user = await getRepository(User).findOne(request.params.userId);
//     if (user === undefined) {
//       responderWrongId(response, request.params.userId);

//     } else {
//       responder(response, HttpCodes.success, [user]);
//     }
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));
//   }
// }




// //  █████╗ ██████╗ ██████╗
// // ██╔══██╗██╔══██╗██╔══██╗
// // ███████║██║  ██║██║  ██║
// // ██╔══██║██║  ██║██║  ██║
// // ██║  ██║██████╔╝██████╔╝
// // ╚═╝  ╚═╝╚═════╝ ╚═════╝



// export const addUser: postResponse = async (request, response) => {
//   const user: User = new User();
//   try {
//     if (request.body.role === undefined) {
//       responderMissingBodyValue(response, 'User "role" is not defined');
//     }
//     if (!(request.body.role in UserRole)) {
//       const types = Object.values(UserRole).filter((v: any) => typeof v === 'string');
//       responderMissingBodyValue(response, `User "role" is none of type: ${types}`);
//     }

//     if (request.body.firstName === undefined) {
//       responderMissingBodyValue(response, 'User "firstName" is not defined');
//     }
//     if (request.body.lastName === undefined) {
//       responderMissingBodyValue(response, 'User "lastName" is not defined');
//     }
//     if (request.body.email === undefined) {
//       responderMissingBodyValue(response, 'User "email" is not defined');
//     }
//     user.firstName = request.body.firstName;
//     user.lastName = request.body.lastName;
//     user.role = request.body.role;
//     user.email = request.body.email;
//     const errors = await validate(user);
//     if (errors.length > 0) {
//       throw new Error(`User validation failed ${JSON.stringify(errors)}`)
//     }
//     // could also be the below create event
//     // but then we can't do the validation beforehand
//     // const res = await getRepository(User).create(request.body);
//     const res = await getRepository(User).save(user);// .save(user);
//     responderSuccessCreated(response, 'User was created', res);
//     // response.status(201).json(successResponse('User was created'));
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));

//     // response.status(HttpCodes.internalError).json(errorResponse(e));
//   }
// }




// // ██████╗ ██╗   ██╗████████╗
// // ██╔══██╗██║   ██║╚══██╔══╝
// // ██████╔╝██║   ██║   ██║
// // ██╔═══╝ ██║   ██║   ██║
// // ██║     ╚██████╔╝   ██║
// // ╚═╝      ╚═════╝    ╚═╝




// export const updateUser: putResponse = async (request, response) => {
//   try {
//     if (request.params.userId === undefined) {
//       responderMissingId(response);
//       // responder(
//       //   response,
//       //   HttpCodes.badRequest,
//       //   errorResponse(new Error('Missing ID paramter'))
//       // );
//       // throw new Error('Missing id paramater');
//     }
//     const user: User | undefined = await getRepository(User).findOne(request.params.userId);
//     if (user === undefined) {

//       responderWrongId(response, request.params.userId);

//     } else {
//       const userRepository = getRepository(User);
//       userRepository.merge(user, request.body);
//       userRepository.save(user);
//       responderSuccessCreated(response, 'updated user');
//     }
//   } catch (e) {
//     response.status(HttpCodes.internalError).json(errorResponse(e));
//   }
// };





// // ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// // ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// // ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// // ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// // ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// // ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝




// export const deleteUser: deleteResponse = async (request, response) => {
//   try {
//     // console.log('req id value',request.params.userId);
//     // if (request.params.hasOwnProperty('id') === false) {
//     //   // throw new Error('Missing id paramter');
//     //   responderMissingId(response);
//     //   // responder(
//     //   //   response,
//     //   //   HttpCodes.badRequest,
//     //   //   errorResponse(new Error('Missing ID paramter'))
//     //   // );
//     // }
//     const user = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
//     if (user === undefined) {
//       responderWrongId(response, request.params.userId);

//       // responder(
//       //   response,
//       //   HttpCodes.badRequestNotFound,
//       //   userIDErrorResponse(request.params.userId)
//       // );
//     } else {
//       if (user.protected === true) {
//         responder(response, HttpCodes.badRequestForbidden, errorResponse(new Error('You cannot delete a protected User')));
//       } else {
//         if (user.bathingspots.length !== 0) {
//           const protectedUser = await getRepository(User).findOne({ where: { protected: true }, relations: ['bathingspots'] });
//           if (protectedUser === undefined) {
//             throw new Error('No protected user found!');
//           } else {
//             const spots: Bathingspot[] = [];
//             user.bathingspots.forEach((spot) => {
//               // we must retain all the public bathingspots
//               // or not?
//               if (spot.isPublic === true) {
//                 spot.isPublic = false; // keep them for moderation
//                 spots.push(spot);
//               }
//             });
//             protectedUser.bathingspots = protectedUser.bathingspots.concat(spots);
//             const manager = getManager();
//             await manager.save(protectedUser);
//             // if (process.env.NODE_ENV === 'development') {
//             //   process.stdout.write(JSON.stringify(res));
//             //   process.stdout.write('\n');
//             // }
//           }
//         }
//         await getRepository(User).remove(user);
//         responderSuccess(response, 'deleted user');
//       }
//     }

//     // responder(
//     //   response,
//     //   HttpCodes.success,
//     //   successResponse('deleted user')
//     // );
//     // response.status(HttpCodes.success).json(successResponse('deleted user'));
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));
//     // response.status(HttpCodes.internalError).json(errorResponse(e));
//   }

// }




// ███████╗██████╗  ██████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝
// ███████╗██████╔╝██║   ██║   ██║   ███████╗
// ╚════██║██╔═══╝ ██║   ██║   ██║   ╚════██║
// ███████║██║     ╚██████╔╝   ██║   ███████║
// ╚══════╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝




// /**
//  * Gets single bathingspot of user by id
//  * @param request
//  * @param response
//  */
// export const getOneUserBathingspotById: getResponse = async (request, response) => {
//   try {
//     const user: User | undefined = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
//     if (user === undefined) {
//       // throw new Error('user undefined or 0');
//       responderWrongId(response, request.params.userId);
//     } else {
//       const spots: Bathingspot[] = user.bathingspots.filter(spot => spot.id === parseInt(request.params.spotId, 10));
//       if (spots.length > 0) {
//         responder(response, HttpCodes.success, [spots[0]]);
//       } else {
//         responderWrongId(response, 'Wrong bathingspot id');
//       }
//     }
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));
//   }
// }


// /**
//  * Gets all the bathingspots of the user
//  * @param request
//  * @param response
//  */
// export const getUserBathingspots: getResponse = async (request, response) => {
//   try {
//     const user: User | undefined = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
//     if (user === undefined) {
//       // throw new Error('user undefined or 0');
//       responderWrongId(response, request.params.userId);
//     } else {
//       responder(response, HttpCodes.success, successResponse('all bathingspots', user.bathingspots));
//     }
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));
//   }
// }


// export const addBathingspotToUser: postResponse = async (request, response) => {
//   try {
//     const user = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
//     if (user === undefined) {
//       responderWrongId(response, request.params.userId);
//     } else {
//       if (request.body.hasOwnProperty('name') !== true) {

//         responderMissingBodyValue(response, 'Bathingspot "name" is not defined');
//       }

//       if (request.body.hasOwnProperty('isPublic') !== true) {
//         responderMissingBodyValue(response, 'Bathingspot "isPublic" is not defined');
//       }
//       //
//       // get all the values we want from the request body
//       // they are all nullable s owe just fetch them.
//       // needs some typechecking though
//       // https://stackoverflow.com/a/38750895/1770432//
//       const spot = new Bathingspot();
//       const propertyNames = await getConnection().getMetadata(Bathingspot).ownColumns.map(column => column.propertyName);
//       // const propertyTypes = await getConnection().getMetadata(Bathingspot).ownColumns.map(column => column.type);
//       const propertyTypeList = await getConnection().getMetadata(Bathingspot).ownColumns.map(column => [column.propertyName, column.type]);
//       const lookupMap = new Map();
//       propertyTypeList.forEach(ele => {
//         lookupMap.set(ele[0], ele[1]);
//       })
//       // console.log(propertyTypeList);

//       const notAllowed: string[] = ['id', 'name', 'isPublic', 'user', 'region'];
//       const filteredPropNames = propertyNames.filter(ele => notAllowed.includes(ele) !== true);
//       const providedValues = Object.keys(request.body)
//         .filter(key => filteredPropNames.includes(key)).reduce((obj: any, key: string) => {
//           obj[key] = request.body[key];
//           return obj;
//         }, {});

//       try {
//         // curently silently fails needs some smarter way to set values on entities
//         if (isObject(providedValues['apiEndpoints'])) {
//           spot.apiEndpoints = providedValues['apiEndpoints'];// 'json' ]
//         }// 'json' ]
//         if (isObject(providedValues['state'])) {
//           spot.state = providedValues['state'];// 'json' ]

//         }// 'json' ]
//         if (isObject(providedValues['location'])) {
//           spot.location = providedValues['location'];// 'json' ]

//         }// 'json' ]
//         if (typeof providedValues['latitde'] === 'number') {
//           spot.latitde = providedValues['latitde'];// 'float8' ]

//         }// 'float8' ]
//         if (typeof providedValues['longitude'] === 'number') {
//           spot.longitude = providedValues['longitude'];// 'float8' ]

//         }// 'float8' ]
//         if (typeof providedValues['elevation'] === 'number') {
//           spot.elevation = providedValues['elevation'];// 'float8' ]
//         }// 'float8' ]
//       } catch (err) {
//         throw err;
//       }

//       const isPublic: boolean = request.body.isPublic;
//       const name: string = request.body.name;
//       spot.name = name;
//       spot.isPublic = isPublic;
//       user.bathingspots.push(spot);
//       await getManager().save(spot);
//       await getManager().save(user);
//       const userAgain = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
//       if (userAgain !== undefined) {

//         responder(response, HttpCodes.successCreated, successResponse('Bathingspot created', [userAgain.bathingspots[userAgain.bathingspots.length - 1]]))
//       } else {
//         throw Error('user id did change user does not exist anymore should never happen');
//       }
//     }
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));
//   }
// }
