import express from "express";
import { checkJwt } from "./auth";
import { getHandler, postHandler } from "./handlers";
import { propertyCheckMiddleware } from "./middleware";
export const router = express.Router();

router.get("/messages", getHandler);
router.post("/messages", checkJwt, propertyCheckMiddleware, postHandler);
