import express from "express";
const QueriesRoute = express.Router();

import { sayHello } from "../controller/queryController.js";
QueriesRoute.get("/hello", sayHello);

export { QueriesRoute };
