const router = require("express").Router();

const {createCoupon} = require("../controller/couponController");
router.post("/create-coupon", createCoupon);

module.exports = router;
