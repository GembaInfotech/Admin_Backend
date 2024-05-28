const router = require("express").Router();
const Auth = require('../middlewares/auth/authorizeRoles')

const {addAdminUser, signin, getAdminUser, updateAdminUser, getUser,logout} = require("../controller/adminUserController");
router.post("/signup",addAdminUser);
router.post("/signin",signin);
router.get("/get-admin-users/:role",getAdminUser);
router.put("/update-admin-users/:adminId",updateAdminUser);
router.get("/get-user",Auth, getUser);



router.post("/logout",logout);



module.exports = router;
