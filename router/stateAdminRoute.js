import express from "express";
const stateAdminRoute = express.Router();

import { registerStateAdmin, getAllStateAdmins, updateStateAdmin } from "../controller/stateAdminController.js";
stateAdminRoute.post("/register", registerStateAdmin);
stateAdminRoute.get("/getStateAdmin", getAllStateAdmins);
stateAdminRoute.put("/updateStateAdmin", updateStateAdmin);



export { stateAdminRoute };