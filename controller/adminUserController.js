const bcrypt = require("bcrypt");
const adminUserModel = require('../model/adminUserModel');

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

// const signin = async (req, res, next) => {
//     console.log("hello");
//     console.log(req.body);
//     await saveLogInfo(req, MESSAGE.SIGN_IN_ATTEMPT, LOG_TYPE.SIGN_IN, LEVEL.INFO);

//     try {
//         const { email, password } = req.body;
//         console.log(req.body);
//         const existingAdminUser = await adminUserModel.findOne({
//             email: { $eq: email },
//         });
//         console.log(existingAdminUser);
//         if (!existingAdminUser) {
//             await saveLogInfo(req, MESSAGE.INCORRECT_EMAIL, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
//             return res.status(404).json({
//                 message: "Invalid credentials",
//             });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, existingAdminUser.password);

//         console.log(isPasswordCorrect);

//         if (!isPasswordCorrect) {
//             await saveLogInfo(req, MESSAGE.INCORRECT_PASSWORD, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
//             return res.status(400).json({
//                 message: "Invalid credentials",
//             });
//         }

//         const payload = {
//             id: existingAdminUser._id,
//             email: existingAdminUser.email,
//         };

//         console.log("testing...1");

//         const accessToken = jwt.sign(payload, process.env.SECRET, {
//             expiresIn: "30m",
//         });

//         const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
//             expiresIn: "7d",
//         });

//         console.log("testing...2");

//         try {
//             const existingToken = await AdminUserToken
//                 .findOne({
//                     adminUser: { $eq: existingAdminUser._id.toString() },
//                 });

//             if (existingToken?.adminUser) {
//                 await AdminUserToken.deleteOne({ _id: existingToken._id });
//             }
//         } catch (err) {
//             console.error(err);
//         }

//         const newRefreshToken = new AdminUserToken({
//             adminUser: existingAdminUser._id,
//             refreshToken,
//             accessToken,
//         });
//         await newRefreshToken.save();

//         res.status(200).json({
//             accessToken,
//             refreshToken,
//             accessTokenUpdatedAt: new Date().toLocaleString(),
//             adminUser: {
//                 _id: existingAdminUser._id,
//                 name: existingAdminUser.name,
//                 email: existingAdminUser.email,
//             },
//         });
//     } catch (err) {
//         await saveLogInfo(req, MESSAGE.SIGN_IN_ERROR + err.message, LOG_TYPE.SIGN_IN, LEVEL.ERROR);

//         res.status(500).json({
//             message: "Something went wrong",
//         });
//     }
// };


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
      adminUser: {
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
        const userData = { ...req.body };
        console.log(userData);

        const existingUser = await adminUserModel.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        console.log("Password hashed");

        const emailDomain = userData.email.split("@")[1];
        const role = emailDomain === "mod.Parkar.com" ? "moderator" : userData.role;

        const newUser = new adminUserModel({
            ...userData,
            role: role,
            password: hashedPassword,
        });

        await newUser.save();

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
    logout

};
