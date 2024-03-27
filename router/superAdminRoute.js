import express from "express";
const superAdminRoute = express.Router();

import { superAdmin, register, getAdmin} from "../controller/superAdminController.js";
superAdminRoute.post("/register", register);
superAdminRoute.get("/getAdmin", getAdmin);

export { superAdminRoute };