import express from "express";
const stateAdminRoute = express.Router();

import { stateAdmin } from "../controller/stateAdminController.js";
stateAdminRoute.get("/stateAdmin", stateAdmin);

export { stateAdminRoute };