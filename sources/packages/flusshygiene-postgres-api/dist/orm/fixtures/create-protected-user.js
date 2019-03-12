"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entity/User");
const types_interfaces_1 = require("../../lib/types-interfaces");
exports.createProtectedUser = () => {
    let protectedUser = new User_1.User();
    protectedUser.firstName = 'Conan';
    protectedUser.lastName = 'the Barbarian';
    protectedUser.role = types_interfaces_1.UserRole.admin;
    protectedUser.email = 'moron-zirfas@technologiestiftung-berlin.de'; // for now
    protectedUser.protected = true;
    return protectedUser;
};
