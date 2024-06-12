'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const adminUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    contact: {
      type: Number,
      required: false
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Inactive'],
      default: 'Pending'
    },
    role: {
      type: String,
      enum: ['gte', 'cityAdmin', 'stateAdmin', 'superAdmin'],
      required: true
    },
    password: {
      type: String,
      required: true
    },
    regionCode: {
      type: String,
      required: false
    },
    createdBy: {
      // id: {
        type: String
        //   required:true
      // },
      // role: {
      //   type: String,
      //   enum: ['GTE', 'CityAdmin', 'StateAdmin', 'SuperAdmin'],
      //   // required:true
      // }
    },
    tokens: [{
      reftoken: {
        type: String
      },
      timeStamp: {
        type: String
      }
    }]
  },
  { timestamps: true }
);

adminUserSchema.methods.generateRefreshToken = async function () {
  try {
    let reftoken = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    let timeStamp = new Date().toISOString();
    this.tokens = this.tokens.concat({ reftoken, timeStamp });
    await this.save();
    return reftoken;
  } catch (err) {
    console.log("Error generating refresh token:", err);
  }
}

adminUserSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        expiresIn: '10m',
      }
    );
    return token;
  } catch (err) {
    console.log("Error generating auth token:", err);
  }
}

module.exports = mongoose.model('adminUserModel', adminUserSchema);
