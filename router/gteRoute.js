import express from "express";
const gteRoute = express.Router();

import { gte } from "../controller/gteController.js";
gteRoute.get("/gte", gte);

export { gteRoute };