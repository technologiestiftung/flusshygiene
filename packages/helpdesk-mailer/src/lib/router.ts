import express from "express";
import { checkJwt } from "./auth";
import { getHandler, postHandler } from "./handlers";
export const router = express.Router();

router.get("/messages", getHandler);
router.post("/messages", checkJwt, postHandler);
