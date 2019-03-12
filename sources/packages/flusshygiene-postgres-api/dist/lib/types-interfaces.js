"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var UserRole;
(function (UserRole) {
    UserRole["admin"] = "admin";
    UserRole["creator"] = "creator";
    UserRole["reporter"] = "reporter";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["success"] = 200] = "success";
    HttpCodes[HttpCodes["successCreated"] = 201] = "successCreated";
    HttpCodes[HttpCodes["suceessNoContent"] = 204] = "suceessNoContent";
    HttpCodes[HttpCodes["badRequest"] = 400] = "badRequest";
    HttpCodes[HttpCodes["badRequestUnAuthorized"] = 401] = "badRequestUnAuthorized";
    HttpCodes[HttpCodes["badRequestForbidden"] = 403] = "badRequestForbidden";
    HttpCodes[HttpCodes["badRequestNotFound"] = 404] = "badRequestNotFound";
    HttpCodes[HttpCodes["badRequestNotAllowed"] = 405] = "badRequestNotAllowed";
    HttpCodes[HttpCodes["badRequestConflict"] = 409] = "badRequestConflict";
    HttpCodes[HttpCodes["internalError"] = 500] = "internalError";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
;
var Regions;
(function (Regions) {
    Regions["berlinbrandenburg"] = "berlinbrandenburg";
})(Regions = exports.Regions || (exports.Regions = {}));
;
