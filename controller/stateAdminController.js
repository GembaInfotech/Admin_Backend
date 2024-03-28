
import { StateAdmin } from "../model/stateAdmin.js";

import bcrypt from 'bcryptjs';

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
            password: hashedPassword 
        });

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
      
      if (!stateAdmin) {
        return res.status(404).json({ error: 'State admin not found' });
      }
      
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
