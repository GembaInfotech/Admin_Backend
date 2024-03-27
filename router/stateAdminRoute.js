import express from "express";
const stateAdminRoute = express.Router();

import { registerStateAdmin, getAllStateAdmins } from "../controller/stateAdminController.js";
stateAdminRoute.post("/register", registerStateAdmin);
stateAdminRoute.get("/getStateAdmin", getAllStateAdmins);


export { stateAdminRoute };