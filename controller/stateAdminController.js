
import { StateAdmin } from "../model/stateAdmin.js";
// import nodemailer from "nodemailer";
// import { generateToken } from "../config/jwtTokens.js";
// import { generateRefreshToken } from "../config/refreshToken.js";
// import crypto from "crypto";
// import { request } from "http";
// import { log } from "console";


import bcrypt from 'bcryptjs';

const registerStateAdmin = async (req, res) => {
    try {
        // Extract registration data from request
        console.log(req.body);

        const { name, mob, mail, add,city, state,  pc, region, regionCode, status, role, password } = req.body.values

        // console.log(name, mob, mail, add,city, state,  pc, region, regionCode, status, role, password);

        // Check if required fields are provided
        if (!name || !mob || !mail || !add  ||!city || !state || !pc || !region || !regionCode || !status || !role || !password) {

          console.log("testing.......1");
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user with the same email already exists
        const existingStateAdmin = await StateAdmin.findOne({ mail });
        
        if (existingStateAdmin) {
          
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new state admin
        const newStateAdmin = new StateAdmin({
            name,
            mob,
            mail,
            add,
            city,
            state,
            pc,
            region,
            regionCode,
            status,
            role,
            password: hashedPassword // Save hashed password
        });

        // Save the state admin to the database
        await newStateAdmin.save();

        // Respond with success message
        res.status(201).json({ message: 'State admin registered successfully', newStateAdmin });
    } catch (error) {
        // Handle any errors
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

const getAllStateAdmins = async (req, res) => {
  try {
      const stateAdmins = await StateAdmin.find();
      res.status(200).json(stateAdmins);
  } catch (error) {
      console.error('Error fetching state admins:', error);
      res.status(500).json({ error: 'An error occurred while fetching state admins' });
  }
};

export { registerStateAdmin,getAllStateAdmins };
