const bcrypt = require("bcrypt");
const adminUserModel = require('../model/adminUserModel');
const bodyParser = require('body-parser');
const axios = require('axios');
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
    const { name, contact, email, address, city, state, pincode, country, regionCode, status, role, password, createdBy } = req.body;

    console.log("req.body:", req.body);

    const existingUser = await adminUserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

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
      createdBy
    });

    await newUser.save();
    console.log("User saved");

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

const VENDOR_API_URL = 'http://localhost:3456/v1/api/vendor/get-all-vendors';

const getVendorsForAdmins = async (req, res) => {
  console.log("Testing...123")
  const adminId = req.params.adminId;

  const admin = await adminUserModel.find({ _id: adminId })
  const adminRole = admin[0].role

  if (adminRole === 'superAdmin') {
    try {
      const stateAdmins = await adminUserModel.find({ createdBy: adminId, role: 'stateAdmin' });
      console.log(stateAdmins);
      const stateAdminIds = stateAdmins.map(stateAdmin => stateAdmin._id);

      const cityAdmins = await adminUserModel.find({ createdBy: { $in: stateAdminIds }, role: 'cityAdmin' });
      console.log(cityAdmins);
      const cityAdminIds = cityAdmins.map(cityAdmin => cityAdmin._id);

      const gtes = await adminUserModel.find({ createdBy: { $in: cityAdminIds }, role: 'gte' });
      console.log(gtes);
      const gteIds = gtes.map(gte => gte._id);

      const vendorPromises = gteIds.map(gteId =>
        axios.get(VENDOR_API_URL, { params: { createdBy: gteId } })
      );

      const vendorResponses = await Promise.all(vendorPromises);
      const vendors = vendorResponses.flatMap(response => response.data);

      res.json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (adminRole === 'stateAdmin') {
    try {
      const cityAdmins = await adminUserModel.find({ createdBy: adminId, role: 'cityAdmin' });
      console.log(cityAdmins);
      const cityAdminIds = cityAdmins.map(cityAdmin => cityAdmin._id);

      const gtes = await adminUserModel.find({ createdBy: { $in: cityAdminIds }, role: 'gte' });
      console.log(gtes);
      const gteIds = gtes.map(gte => gte._id);

      const vendorPromises = gteIds.map(gteId =>
        axios.get(VENDOR_API_URL, { params: { createdBy: gteId } })
      );

      const vendorResponses = await Promise.all(vendorPromises);
      const vendors = vendorResponses.flatMap(response => response.data);

      res.json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (adminRole === 'cityAdmin') {
    try {
      const gtes = await adminUserModel.find({ createdBy: adminId, role: 'gte' });
      console.log(gtes);
      const gteIds = gtes.map(gte => gte._id);

      const vendorPromises = gteIds.map(gteId =>
        axios.get(VENDOR_API_URL, { params: { createdBy: gteId } })
      );

      const vendorResponses = await Promise.all(vendorPromises);
      const vendors = vendorResponses.flatMap(response => response.data);

      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const PARKING_API_URL = 'http://localhost:3456/v1/api/parking/getParkingByVendorIdAndStatus';

const getParkingsForAdmins = async (req, res) => {
  const { adminId, status } = req.params;
console.log(adminId);
  try {
    const admin = await adminUserModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const adminRole = admin.role;

    let gteIds = [];

    switch (adminRole) {
      case 'superAdmin':
        const stateAdmins = await adminUserModel.find({ createdBy: adminId, role: 'stateAdmin' });
        const stateAdminIds = stateAdmins.map(stateAdmin => stateAdmin._id);

        const cityAdmins = await adminUserModel.find({ createdBy: { $in: stateAdminIds }, role: 'cityAdmin' });
        const cityAdminIds = cityAdmins.map(cityAdmin => cityAdmin._id);

        const gtes = await adminUserModel.find({ createdBy: { $in: cityAdminIds }, role: 'gte' });
        gteIds = gtes.map(gte => gte._id);
        break;
      case 'stateAdmin':
        const cityAdminsState = await adminUserModel.find({ createdBy: adminId, role: 'cityAdmin' });
        const cityAdminIdsState = cityAdminsState.map(cityAdmin => cityAdmin._id);

        const gtesState = await adminUserModel.find({ createdBy: { $in: cityAdminIdsState }, role: 'gte' });
        gteIds = gtesState.map(gte => gte._id);
        break;
      case 'cityAdmin':
        const gtesCity = await adminUserModel.find({ createdBy: adminId, role: 'gte' });
        gteIds = gtesCity.map(gte => gte._id);
        break;
      case 'gte':
        gteIds = [adminId];
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported admin role'
        });
    }

    const vendorPromises = gteIds.map(gteId =>
      axios.get(VENDOR_API_URL, { params: { createdBy: gteId } })
    );

    const vendorResponses = await Promise.all(vendorPromises);
    const vendorIds = vendorResponses.flatMap(response => response.data.map(vendor => vendor._id));
    console.log("vendorid....", vendorIds);

    const parkingPromises = vendorIds.map(vendorId =>
      axios.get(PARKING_API_URL, { params: { vendor_id: vendorId, status } })
    );

    const parkingResponses = await Promise.all(parkingPromises);
    const parkings = parkingResponses.flatMap(response => response.data);

    console.log(parkings);
    

    res.json(parkings);
  } catch (error) {
    console.error('Error fetching parkings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parkings',
      error: error.message
    });
  }
};
const BOOKING_API_URL = "http://localhost:3456/v1/api/booking/getBookingsByParkingId"

const getBookingsByParkingId = async (req, res) => {
  const { parkingId } = req.params;
  console.log(parkingId); 
  try {
    const response = await axios.get(BOOKING_API_URL, { params: { parking: parkingId } });
    console.log(response.data);
    
    res.json(response.data);

  } catch (error) {
    console.error('Error fetching Bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Bookings',
      error: error.message
    });
  }
};

const getAdminUser = async (req, res) => {
  try {
    const role = req.params.role;
    const id = req.params.id;
    const admin = await adminUserModel.find({ _id: id })
    const adminRole = admin[0].role
    console.log(adminRole);

    if (adminRole === "superAdmin" && role === "cityAdmin") {
      const adminUsers = await adminUserModel.find({ role });
      res.status(200).json({
        adminUsers
      });
    }

    if (adminRole === "superAdmin" && role === "gte") {
      const adminUsers = await adminUserModel.find({ role });
      res.status(200).json({
        adminUsers
      });
    }

    if (adminRole === "stateAdmin" && role === "gte") {
      try {
        const cityAdmins = await adminUserModel.find({ createdBy: id, role: 'cityAdmin' });
        console.log(cityAdmins);
        const cityAdminIds = cityAdmins.map(cityAdmin => cityAdmin._id);

        const adminUsers = await adminUserModel.find({ createdBy: { $in: cityAdminIds }, role: role });

        res.status(200).json({
          adminUsers
        });
      } catch (error) {
        console.error('Error fetching GTEs:', error);
        res.status(500).json({ error: error.message });
      }
    }

    if ((adminRole === "superAdmin" && role === "stateAdmin") || (adminRole === "stateAdmin" && role === "cityAdmin") || (adminRole === "cityAdmin" && role === "gte")) {
      console.log("hello");
      const adminUsers = await adminUserModel.find({ role, createdBy: id });
      res.status(200).json({
        adminUsers
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch admin users",
    });
  }
};

const getAdminUserById = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const adminUser = await adminUserModel.find({ _id: adminId });
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

    const stateAdmin = await adminUserModel.find({ role: "stateAdmin" }).count();
    const cityAdmin = await adminUserModel.find({ role: "cityAdmin" }).count();
    const gte = await adminUserModel.find({ role: "gte" }).count();

    const data = {
      gte: gte,
      cityadmin: cityAdmin,
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
    const existingUser = await adminUserModel.findById({ _id: adminId });
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
  getVendorsForAdmins,
  getParkingsForAdmins,
  getBookingsByParkingId,
  updateAdminUser,
  getUser,
  getdata,
  getAdminUserById,
  logout

};
