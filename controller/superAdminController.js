import nodemailer from "nodemailer";
import { Admin } from "../model/Admin.js";
const superAdmin = async (req, res) => {
  try {
    res.json({ data: "super admin" });
  } catch (err) {
    res.json(err);
  }
};

const register = async (req, res) => {
  try {
   console.log("j");
    const newAdmin = new Admin(req.body);
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

export { superAdmin , register , getAdmin};

