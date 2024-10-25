const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },  
  discountValue: { type: Number, required: true, min: 0 },  
  validFrom: { type: Date, required: true },
  validTill: { type: Date, required: true },
  isGlobal: { type: Boolean, default: false },  
  applicableParkings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingModel' }],  
  usageLimitPerUser: { type: Number, default: 2 },
  usedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      usageCount: { type: Number, default: 0 },
    }
  ],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

couponSchema.pre('save', function(next) {
  if (this.validFrom >= this.validTill) {
    return next(new Error('validFrom must be before validTill'));
  }
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
