import express from "express";
const superAdminRoute = express.Router();

import {
  getSuperAdmin,
  superAdminDelete,
  superAdminLogin,
  superAdminRegister,
  superAdminUpdate,
} from "../controller/superAdminController.js";

import superAdminAuth from "../middlewares/authMiddleware.js";

superAdminRoute.post("/register", superAdminRegister);
superAdminRoute.post("/login",superAdminLogin);
superAdminRoute.put("/update/:id", superAdminUpdate);
superAdminRoute.get("/", getSuperAdmin);
superAdminRoute.delete("/delete/:id", superAdminDelete);

export { superAdminRoute };
