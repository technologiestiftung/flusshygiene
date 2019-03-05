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
const app = express_1.default();
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
module.exports = app;
