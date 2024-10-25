'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingSchema = new Schema(
  {
    code: {
      type: String,
    },
    name: {
      type: String,
      required: false,
      trim: true,
      uppercase: true
    },
    landmark: {
      type: String,
      required: false,
      trim: true,
      uppercase: true
    },
    pincode: {
      type: String,
      required: false,
      minlength: 6
    },
    address_line1: {
      type: String,
      required: false,
      uppercase: true
    },
    address_line2: {
      type: String,
      required: false,
      uppercase: true

    },
    city: {
      type: String,
      required: false,
      uppercase: true

    },
    state: {
      type: String,
      required: false,
      uppercase: true

    },
    country: {
      type: String,
      required: false,
      uppercase: true

    },
    twoWheelerCapacity: {
      type: Number,
      required: false,
      // min:10
    },
    fourWheelerCapacity: {
      type: Number,
      required: false,
      // min:10
    },
    totalCapacity: {
      type: Number,
      required: false,
      // min:20
    },
    gst:{
      type:String
    },
    registeration_no: {
      type: String,
      required: false,
      uppercase: true
    },
    validity_FromDate:{
      type:String
    },
    validity_ToDate:{
      type:String
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",

    },
    isActive: {
      type: Boolean,
      default: false
    },
    priceF: {
      type: Number,
      min: 20,
      max: 1000,
      required: false,
    },
    priceT: {
      type: Number,
      min: 20,
      max: 1000,
      required: false,
    },
    exceed_priceF: {
      type: Number,
      min: 5,
      max: 200,
      required: false,
    },
    exceed_priceT: {
      type: Number,
      min: 5,
      max: 200,
      required: false,
    },
    
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    price_for: {
      type: Number,
      min: 1,
      max: 24,
      required: false,
    },
    mobile_no: {
      type: Number,

    },
    exceed_price_for: {
      type: Number,
      enum: [10, 20, 30],
      required: false,
    },


    createdOnDate: {
      type: String,
    },

    full_day: {
      type: Boolean,

    },
    sheded: {
      type: Boolean,
    },
    description: {
      type: String,
      required: true,
    },

    image: [{
      type: String
    }],
    regiseration_doc_image: {
      type: String
    },

    uniqueId: {
      type: String,
      required: false,
    },

    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: 'VendorModel',
      required: true,
    },
    guard_id: [
      {
        type: String
      }
    ]

  },
  {
    timestamps: true

  }
);

ParkingSchema.index({ location: "2dsphere" })
const ParkingModel = mongoose.model('ParkingModel', ParkingSchema);


module.exports = ParkingModel;