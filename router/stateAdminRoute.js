import express from "express";
const stateAdminRoute = express.Router();

import { registerStateAdmin, getAllStateAdmins, getStateAdminById, updateStateAdmin, deleteStateAdmin } from "../controller/stateAdminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

stateAdminRoute.post("/register", registerStateAdmin);
stateAdminRoute.get("/getStateAdmin", authMiddleware, getAllStateAdmins);
stateAdminRoute.put("/updateStateAdmin", updateStateAdmin);
stateAdminRoute.delete("/deleteStateAdmin/:mail", deleteStateAdmin);
stateAdminRoute.get("/:stateAdminId", getStateAdminById);

export { stateAdminRoute };