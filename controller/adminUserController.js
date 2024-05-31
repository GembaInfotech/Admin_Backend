const bcrypt = require("bcrypt");
const adminUserModel = require('../model/adminUserModel');
const bodyParser = require('body-parser');

const jwt = require("jsonwebtoken");
const AdminUserToken = require('../model/adminUserToken')
const { saveLogInfo } = require("../middlewares/logger/logInfo");
const duration = require("dayjs/plugin/duration");
const dayjs = require("dayjs");
dayjs.extend(duration);

const LOG_TYPE = {
    SIGN_IN: "sign in",
    LOGOUT: "logout",
};

const LEVEL = {
    INFO: "info",
    ERROR: "error",
    WARN: "warn",
};

const MESSAGE = {
    SIGN_IN_ATTEMPT: "Admin user attempting to sign in",
    SIGN_IN_ERROR: "Error occurred while signing in admin user: ",
    INCORRECT_EMAIL: "Incorrect email",
    INCORRECT_PASSWORD: "Incorrect password",
    LOGOUT_SUCCESS: "Admin user has logged out successfully",
};



const signin = async (req, res, next) => {
  console.log("hello");
  console.log(req.body);
  await saveLogInfo(req, MESSAGE.SIGN_IN_ATTEMPT, LOG_TYPE.SIGN_IN, LEVEL.INFO);

  try {
    const { email, password } = req.body;
    console.log(req.body);
    const existingAdminUser = await adminUserModel.findOne({
      email: { $eq: email },
    });
    console.log(existingAdminUser);
    if (!existingAdminUser) {
      await saveLogInfo(req, MESSAGE.INCORRECT_EMAIL, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingAdminUser.password);

    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      await saveLogInfo(req, MESSAGE.INCORRECT_PASSWORD, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: existingAdminUser._id,
      email: existingAdminUser.email,
      role: existingAdminUser.role
    };

    console.log("testing...1");

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    console.log("testing...2");

    try {
      const existingToken = await AdminUserToken.findOne({
        adminUser: { $eq: existingAdminUser._id.toString() },
      });

      if (existingToken?.adminUser) {
        await AdminUserToken.deleteOne({ _id: existingToken._id });
      }
    } catch (err) {
      console.error(err);
    }

    const newRefreshToken = new AdminUserToken({
      adminUser: existingAdminUser._id,
      refreshToken,
      accessToken,
    });
    await newRefreshToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingAdminUser._id,
        name: existingAdminUser.name,
        email: existingAdminUser.email,
        role: existingAdminUser.role
      },
    });
  } catch (err) {
    await saveLogInfo(req, MESSAGE.SIGN_IN_ERROR + err.message, LOG_TYPE.SIGN_IN, LEVEL.ERROR);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};



const addAdminUser = async (req, res, next) => {
  try {
      console.log("start");
      // Destructure the required fields directly from req.body
      const { name, contact, email, address, city, state, pincode, country, regionCode, status, role, password } = req.body;
      
      console.log("req.body:", req.body);

      // Check if the user already exists
      const existingUser = await adminUserModel.findOne({ email });
      if (existingUser) {
          return res.status(400).json({
              message: "Email already exists",
          });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed");

      // Create a new user
      const newUser = new adminUserModel({
          name,
          contact,
          email,
          address,
          city,
          state,
          pincode,
          country,
          regionCode,
          status,
          role,
          password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();
      console.log("User saved");

      // Respond with the new user data
      res.status(200).json({
          data: newUser,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: "Failed to add user",
      });
  }
};


const getAdminUser = async (req, res) => {
  try {
    const role = req.params.role;
    const adminUsers = await adminUserModel.find({ role });
    res.status(200).json({
       adminUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch admin users",
    });
  }
};

const getAdminUserById= async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const adminUser = await adminUserModel.find({_id:adminId});
    res.status(200).json({
       adminUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch admin users",
    });
  }
};


const getUser = async (req, res) => {
  try {
    
    const adminUsers = await adminUserModel.find();
    res.status(200).json({
       adminUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch admin users",
    });
  }
};


const getdata = async (req, res) => {
  try {
  
    const stateAdmin = await adminUserModel.find({role:"stateAdmin"}).count();
    const cityAdmin = await adminUserModel.find({role:"cityAdmin"}).count();
    const gte = await adminUserModel.find({role:"gte"}).count();
  
    const data ={
      gte : gte,
      cityadmin : cityAdmin,
      stateAdmin: stateAdmin
    }

   
    res.status(200).json({
       data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch admin users",
    });
  }
};

const updateAdminUser = async (req, res, next) => {
  try {
    // Get the ID from req.params
    const { adminId } = req.params;
    console.log(adminId);
    console.log(req.body);

    // Destructure the required fields directly from req.body
    const { name, contact, email, address, city, state, pincode, country, regionCode, status, role, password } = req.body;

    // Check if the user exists
    const existingUser = await adminUserModel.findById({_id:adminId});
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update user fields
    existingUser.name = name;
    existingUser.contact = contact;
    existingUser.email = email;
    existingUser.address = address;
    existingUser.city = city;
    existingUser.state = state;
    existingUser.pincode = pincode;
    existingUser.country = country;
    existingUser.regionCode = regionCode;
    existingUser.status = status;
    existingUser.role = role;

    // If password is provided, hash and update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    // Save the updated user to the database
    await existingUser.save();

    // Respond with the updated user data
    res.status(200).json({
      data: existingUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update user",
    });
  }
};



const logout = async (req, res) => {
    try {
      const refreshToken = req.headers.authorization?.split(" ")[1] ?? null;
      console.log(req.headers.authorization);
      if (refreshToken) {
        await adminUserToken.deleteOne({ refreshToken });
        await saveLogInfo(
          null,
          MESSAGE.LOGOUT_SUCCESS,
          LOG_TYPE.LOGOUT,
          LEVEL.INFO
        );
      }
      res.status(200).json({
        message: "Admin User Logout successful",
      });
    } catch (err) {
      await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
      res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };

module.exports = {
    addAdminUser,
    signin,
    getAdminUser,
    updateAdminUser,
    getUser,
    getdata,
    getAdminUserById,
    logout

};
