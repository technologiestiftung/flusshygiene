"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cors_1 = __importDefault(require("cors"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const typeorm_1 = require("typeorm");
const User_1 = require("../orm/entity/User");
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
            // gneerate some default data here
            let user = new User_1.User();
            user.firstName = 'James';
            user.lastName = 'Bond';
            user.role = 'creator';
            await connection.manager.save(user);
        }
    }
    catch (error) {
        throw error;
    }
})();
module.exports = app;
