import cors from 'cors';
import { connect } from './db.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { QueriesRoute } from './Router/QueryRoute.js';
import { cityAdminRoute } from './router/cityAdminRoute.js';
import { stateAdminRoute } from './router/stateAdminRoute.js';
import { superAdminRoute } from './router/superAdminRoute.js';
import { gteRoute } from './router/gteRoute.js';

const app = express();

const port = process.env.PORT || 3000; 

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

connect();
app.use('/v1/api/queries', QueriesRoute);
app.use('/v1/api/cityAdmin', cityAdminRoute);
app.use('/v1/api/stateAdmin', stateAdminRoute);
app.use('/v1/api', superAdminRoute);
app.use('/v1/api/gte', gteRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
