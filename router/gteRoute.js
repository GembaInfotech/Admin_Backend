import express from "express";
const gteRoute = express.Router();

import { registerGTE, getAllGTEs, getGTEById, updateGTE, deleteGTE } from "../controller/gteController.js";

gteRoute.post("/register", registerGTE);
gteRoute.get("/getAllGTEs", getAllGTEs);
gteRoute.put("/updateGTE", updateGTE);
gteRoute.delete("/deleteGTE/:mail", deleteGTE);
gteRoute.get("/:gteId", getGTEById);

export { gteRoute };
