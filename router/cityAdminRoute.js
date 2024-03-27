import express from "express";
const cityAdminRoute = express.Router();

import { cityAdmin } from "../controller/cityAdminController.js";
cityAdminRoute.get("/cityAdmin", cityAdmin);

export { cityAdminRoute };
