const router = require("express").Router();
const Auth = require('../middlewares/auth/authorizeRoles')

const {addAdminUser, signin, getAdminUser, updateAdminUser, getUser,getdata, getAdminUserById, logout} = require("../controller/adminUserController");
router.post("/signup",addAdminUser);
router.post("/signin",signin);
router.get("/get-admin-users/:role",getAdminUser);
router.get("/get-admin-user/:adminId", getAdminUserById);
router.put("/update-admin-users/:adminId",updateAdminUser);
router.get("/get-user",Auth, getUser);
router.get("/get-data", getdata);




router.post("/logout",logout);



module.exports = router;
