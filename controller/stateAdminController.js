
import { StateAdmin } from "../model/stateAdmin.js";
import bcrypt from 'bcryptjs';
import crypto from "crypto";

import nodemailer from "nodemailer";
// import { generateToken } from "../config/jwtTokens.js";
// import { generateRefreshToken } from "../config/refreshToken.js";
// import crypto from "crypto";


const verify = async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    user.verified = true;
    user.save();
    // res.redirect("http://localhost:5173/login");
  };

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ayushguptass14@gmail.com",
      pass: "itcyffmwyptpjhbt",
    },
  });

function sendVerificationEmail(newStateAdmin) {
    // console.log("", newStateAdmin )
    const mailOptions = {
      from: "ayushguptass14@gmail.com",
      to: newStateAdmin.mail,
      subject: "Parkar-Verify Your Email",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      
      <body class="bg-gray-100">
          <div class="max-w-screen-lg mx-auto mt-8">
              <!-- Content Section -->
              <div class="bg-white shadow-md rounded-lg px-8 py-6 mt-8">
                  <h1 class="text-gray-800 text-lg font-semibold">Hello ${newStateAdmin.name},</h1>
                  <p class="text-gray-700 mt-2">Thank you for registering on our application. To ensure the security of your account, please click the link below to verify your email address:</p>
                  <a href="http://localhost:7001/v1/api/User/token/${newStateAdmin.verificationToken}" class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Verify Account</a>
                  <p class="text-gray-700 mt-2">If the above button does not work, you can copy and paste the following URL into your browser:</p>
                  <p class="text-gray-700 mt-2">${"http://localhost:7002/v1/api/User/token/" + newStateAdmin.verificationToken}</p>
                  <p class="text-gray-700 mt-2">Thank you for choosing to be a part of our community.</p>
              </div>
          </div>
      </body>
      
      </html>
        `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

const registerStateAdmin = async (req, res) => {
    try {
        const { name, mob, mail, add, city, state, pc, region, regionCode, status, role, password } = req.body.values;
        if (!name || !mob || !mail || !add || !city || !state || !pc || !region || !regionCode || !status || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const normalizedEmail = mail.toLowerCase();
        const existingStateAdminWithEmail = await StateAdmin.findOne({ mail: normalizedEmail });
        if (existingStateAdminWithEmail) {
            return res.json({ email: 'User with this email already exists' });
        }
        const normalizedState = state.toLowerCase();
        const existingStateAdminInState = await StateAdmin.findOne({ state: normalizedState });
        if (existingStateAdminInState) {
            return res.json({ error:true });
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStateAdmin = new StateAdmin({
            name,
            mob,
            mail: normalizedEmail,
            add,
            city,
            state: normalizedState,
            pc,
            region,
            regionCode,
            status,
            role,
            password: hashedPassword,
            verificationToken
        });

        sendVerificationEmail(newStateAdmin);

        await newStateAdmin.save();
        res.status(201).json({ message: 'State admin registered successfully', newStateAdmin });
    } catch (error) {
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

const getStateAdminById = async (req, res) => {
    const { stateAdminId } = req.params;
    console.log(stateAdminId);
    try {
      const stateAdmin = await StateAdmin.findById(stateAdminId);
      console.log(stateAdmin);
      if (!stateAdmin) {
        return res.status(404).json({ error: 'State admin not found' });
      }
      console.log("test......");
      res.status(200).json(stateAdmin); 
    } catch (error) {
      console.error('Error fetching state admin by ID:', error);
      res.status(500).json({ error: 'An error occurred while fetching state admin' });
    }
  };


const updateStateAdmin = async (req, res) => {
    try {
        const { name, mob, mail, add, city, state, pc, region, regionCode, status, role, password } = req.body.data;
        if (!name || !mob || !mail || !add || !city || !state || !pc || !region || !regionCode || !status || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const stateAdmin = await StateAdmin.findOne({ mail });
        if (!stateAdmin) {
            return res.status(404).json({ error: 'State admin not found' });
        }

        stateAdmin.name = name;
        stateAdmin.mob = mob;
        stateAdmin.mail = mail;
        stateAdmin.add = add;
        stateAdmin.city = city;
        stateAdmin.state = state;
        stateAdmin.pc = pc;
        stateAdmin.region = region;
        stateAdmin.regionCode = regionCode;
        stateAdmin.status = status;
        stateAdmin.role = role

        if (password) {
            stateAdmin.password = await bcrypt.hash(password, 10);
        }
        await stateAdmin.save();
        res.status(200).json({ message: 'State admin updated successfully', stateAdmin });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'An error occurred during update' });
    }
};

const deleteStateAdmin = async (req, res) => {
    try {
        console.log("dwdedd");
        console.log(req.params);
        const { mail } = req.params;
        if (!mail) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const deletedStateAdmin = await StateAdmin.deleteOne({ mail });
        if (deletedStateAdmin.deletedCount === 0) {
            return res.status(404).json({ error: 'State admin not found' });
        }
        res.status(200).json({ message: 'State admin deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'An error occurred during delete' });
    }
};

export { registerStateAdmin,getAllStateAdmins,getStateAdminById, updateStateAdmin, deleteStateAdmin};
