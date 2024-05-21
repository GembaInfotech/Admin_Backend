const cors = require('cors');
const { connect } = require('./db.js');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const adminUserRoute = require('./router/adminUserRoute.js')

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
app.use('/v1/api/adminUser', adminUserRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
