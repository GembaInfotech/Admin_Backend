import { CityAdmin } from "../model/cityAdmin.js";
import bcrypt from 'bcryptjs';
import sendVerificationEmail from "../utils/nodemailer.js";

import CityAdminTemplate from "../emailTemplate/CityAdminTemplate.js"; // Assuming you have a template for CityAdmin emails

const registerCityAdmin = async (req, res) => {
    try {
        const { name, mob, mail, add, city, state, pc, region, regionCode, status, role, password } = req.body;
        if (!name || !mob || !mail || !add || !city || !state || !pc || !region || !regionCode || !status || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const normalizedEmail = mail.toLowerCase();
        const existingCityAdminWithEmail = await CityAdmin.findOne({ mail: normalizedEmail });
        if (existingCityAdminWithEmail) {
            return res.json({ email: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCityAdmin = new CityAdmin({
            name,
            mob,
            mail: normalizedEmail,
            add,
            city,
            state,
            pc,
            region,
            regionCode,
            status,
            role,
            password: hashedPassword,
        });

        sendVerificationEmail(newCityAdmin, CityAdminTemplate.replace('%NAME%', newCityAdmin.name));

        await newCityAdmin.save();
        res.status(201).json({ message: 'City admin registered successfully', newCityAdmin });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

const getAllCityAdmins = async (req, res) => {
    try {
        const cityAdmins = await CityAdmin.find();
        res.status(200).json(cityAdmins);
    } catch (error) {
        console.error('Error fetching city admins:', error);
        res.status(500).json({ error: 'An error occurred while fetching city admins' });
    }
};

const getCityAdminById = async (req, res) => {
    const { cityAdminId } = req.params;
    try {
        const cityAdmin = await CityAdmin.findById(cityAdminId);
        if (!cityAdmin) {
            return res.status(404).json({ error: 'City admin not found' });
        }
        res.status(200).json(cityAdmin);
    } catch (error) {
        console.error('Error fetching city admin by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching city admin' });
    }
};

const updateCityAdmin = async (req, res) => {
    try {
        const { name, mob, mail, add, city, state, pc, region, regionCode, status, role, password } = req.body;
        if (!name || !mob || !mail || !add || !city || !state || !pc || !region || !regionCode || !status || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const cityAdmin = await CityAdmin.findOne({ mail });
        if (!cityAdmin) {
            return res.status(404).json({ error: 'City admin not found' });
        }

        cityAdmin.name = name;
        cityAdmin.mob = mob;
        cityAdmin.mail = mail;
        cityAdmin.add = add;
        cityAdmin.city = city;
        cityAdmin.state = state;
        cityAdmin.pc = pc;
        cityAdmin.region = region;
        cityAdmin.regionCode = regionCode;
        cityAdmin.status = status;
        cityAdmin.role = role;

        if (password) {
            cityAdmin.password = await bcrypt.hash(password, 10);
        }
        await cityAdmin.save();
        res.status(200).json({ message: 'City admin updated successfully', cityAdmin });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'An error occurred during update' });
    }
};

const deleteCityAdmin = async (req, res) => {
    try {
        const { mail } = req.params;
        if (!mail) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const deletedCityAdmin = await CityAdmin.deleteOne({ mail });
        if (deletedCityAdmin.deletedCount === 0) {
            return res.status(404).json({ error: 'City admin not found' });
        }
        res.status(200).json({ message: 'City admin deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'An error occurred during delete' });
    }
};

export { registerCityAdmin, getAllCityAdmins, getCityAdminById, updateCityAdmin, deleteCityAdmin };
