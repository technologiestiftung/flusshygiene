"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Bathingspot_1 = require("./../orm/entity/Bathingspot");
const cors_1 = __importDefault(require("cors"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const typeorm_1 = require("typeorm");
const User_1 = require("../orm/entity/User");
const types_interfaces_1 = require("./types-interfaces");
const Region_1 = require("../orm/entity/Region");
const create_protected_user_1 = require("../orm/fixtures/create-protected-user");
const app = express_1.default();
// let connection: Connection;
app.use(cors_1.default());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan_1.default('dev'));
}
else {
    app.use(helmet_1.default());
    app.use(morgan_1.default('tiny'));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (request, response) => {
    response.send(`Server is running. You called ${request.url}`);
});
app.use('/api/v1', routes_1.default);
// app.use('/api/v1', router);
if (process.env.NODE_ENV === 'development') {
    // In Express an error handler,
    // always has to be the last line before starting the server.
    app.use(errorhandler_1.default());
}
(async () => {
    try {
        const connection = await typeorm_1.createConnection();
        // const db = await connection.connect();
        // process.stdout.write(db.name);
        let databaseEmpty = true;
        const users = await typeorm_1.getRepository(User_1.User).find();
        process.stdout.write(`${users.length}\n`);
        if (users.length !== 0) {
            databaseEmpty = false;
        }
        // process.stdout.write(`Users ${JSON.stringify(users)}\n`);
        if (databaseEmpty === true && process.env.NODE_ENV === 'development') {
            // the first user we create is a special user
            // it is protected and cannot be deletet through the API easily
            // it is for stashing data of deleted users
            // because what should we do when we have to delete a user but maintain the bathingspots?
            await connection.manager.save(create_protected_user_1.createProtectedUser());
            // generate some default data here
            let user = new User_1.User();
            user.firstName = 'James';
            user.lastName = 'Bond';
            user.role = types_interfaces_1.UserRole.creator;
            user.email = 'faker@fake.com';
            const spot = new Bathingspot_1.Bathingspot();
            const region = new Region_1.Region();
            region.name = types_interfaces_1.Regions.berlinbrandenburg;
            spot.region = region;
            spot.isPublic = true;
            spot.name = 'billabong';
            user.bathingspots = [spot];
            await connection.manager.save(region);
            await connection.manager.save(spot);
            await connection.manager.save(user);
        }
        if (databaseEmpty === true && process.env.NODE_ENV === 'production') {
            // uh oh we are in production
            let protectedUser = await typeorm_1.getRepository(User_1.User).find({ where: {
                    protected: true
                } });
            if (protectedUser === undefined) {
                // uh oh no protected user,
                await connection.manager.save(create_protected_user_1.createProtectedUser());
            }
        }
    }
    catch (error) {
        throw error;
    }
})();
module.exports = app;
