const router = require("express").Router();
const Auth = require('../middlewares/auth/authorizeRoles')

const {addAdminUser, signin, getAdminUser, updateAdminUser, getUser,getdata, getAdminUserById,getVendorsForAdmins,getParkingsForAdmins,getBookingsByParkingId, logout} = require("../controller/adminUserController");
router.post("/signup",addAdminUser);
router.post("/signin",signin);
router.get("/get-vendors/:adminId", getVendorsForAdmins);
router.get("/parking/getParkings/:adminId/:status", getParkingsForAdmins);

router.get("/get-admin-users/:role/:id",getAdminUser);
router.get("/get-admin-user/:adminId", getAdminUserById);
router.put("/update-admin-users/:adminId",updateAdminUser);
router.get("/get-user",Auth, getUser);
router.get("/get-data", getdata);
router.get("/getBookingByParkingId/:parkingId", getBookingsByParkingId );

router.post("/logout",logout);

module.exports = router;
