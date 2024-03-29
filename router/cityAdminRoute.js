import express from "express";
const cityAdminRoute = express.Router();

import { registerCityAdmin, getAllCityAdmins, getCityAdminById, updateCityAdmin, deleteCityAdmin } from "../controller/cityAdminController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

cityAdminRoute.post("/register", registerCityAdmin);
cityAdminRoute.get("/getAllCityAdmins", getAllCityAdmins);
cityAdminRoute.put("/updateCityAdmin", updateCityAdmin);
cityAdminRoute.delete("/deleteCityAdmin/:mail", deleteCityAdmin);
cityAdminRoute.get("/:cityAdminId", getCityAdminById);

export { cityAdminRoute };

