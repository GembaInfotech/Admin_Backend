const CouponModel = require('../model/CouponModel')

const createCoupon = async (req, res) => {
    try {
        console.log("hello");
      const {
        code,
        description,
        discountType,
        discountValue,
        validFrom,
        validTill,
        isGlobal,
        applicableParkings,
        usageLimitPerUser,
        status,
      } = req.body;

      console.log(req.body)
  
      if (!code || !discountType || discountValue < 0 || !validFrom || !validTill) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      const newCoupon = new CouponModel({
        code,
        description,
        discountType,
        discountValue,
        validFrom,
        validTill,
        isGlobal,
        applicableParkings,
        usageLimitPerUser,
        status: status || 'active', 
      });
  
      await newCoupon.save();
      console.log("newCoupon", newCoupon)
  
      res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
    } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  module.exports = {
    createCoupon,
  };


  
  