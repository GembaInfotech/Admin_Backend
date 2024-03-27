import express from "express";
const superAdminRoute = express.Router();

import { superAdminLogin, superAdminRegister} from "../controller/superAdminController.js";
superAdminRoute.post("/register", superAdminRegister);
superAdminRoute.post("/login", superAdminLogin);

export { superAdminRoute };