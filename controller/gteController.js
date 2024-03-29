import { GTE } from "../model/gte.js";
import bcrypt from 'bcryptjs';
import sendVerificationEmail from "../utils/nodemailer.js";
import GteTemplate from "../emailTemplate/GteTemplate.js"; // Assuming you have a template for GTE emails

const registerGTE = async (req, res) => {
    try {
        const { name, mob, mail, add, city, state, pc, region, regionCode, status, role, password } = req.body;
        if (!name || !mob || !mail || !add || !city || !state || !pc || !region || !regionCode || !status || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const normalizedEmail = mail.toLowerCase();
        const existingGTEWithEmail = await GTE.findOne({ mail: normalizedEmail });
        if (existingGTEWithEmail) {
            return res.json({ email: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newGTE = new GTE({
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

        sendVerificationEmail(newGTE, GteTemplate.replace('%NAME%', newGTE.name));

        await newGTE.save();
        res.status(201).json({ message: 'GTE registered successfully', newGTE });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

const getAllGTEs = async (req, res) => {
    try {
        const gtes = await GTE.find();
        res.status(200).json(gtes);
    } catch (error) {
        console.error('Error fetching GTEs:', error);
        res.status(500).json({ error: 'An error occurred while fetching GTEs' });
    }
};

const getGTEById = async (req, res) => {
    const { gteId } = req.params;
    try {
        const gte = await GTE.findById(gteId);
        if (!gte) {
            return res.status(404).json({ error: 'GTE not found' });
        }
        res.status(200).json(gte);
    } catch (error) {
        console.error('Error fetching GTE by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching GTE' });
    }
};

const updateGTE = async (req, res) => {
    try {
        const { name, mob, mail, add, city, state, pc, region, regionCode, status, role, password } = req.body;
        if (!name || !mob || !mail || !add || !city || !state || !pc || !region || !regionCode || !status || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const gte = await GTE.findOne({ mail });
        if (!gte) {
            return res.status(404).json({ error: 'GTE not found' });
        }

        gte.name = name;
        gte.mob = mob;
        gte.mail = mail;
        gte.add = add;
        gte.city = city;
        gte.state = state;
        gte.pc = pc;
        gte.region = region;
        gte.regionCode = regionCode;
        gte.status = status;
        gte.role = role;

        if (password) {
            gte.password = await bcrypt.hash(password, 10);
        }
        await gte.save();
        res.status(200).json({ message: 'GTE updated successfully', gte });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'An error occurred during update' });
    }
};

const deleteGTE = async (req, res) => {
    try {
        const { mail } = req.params;
        if (!mail) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const deletedGTE = await GTE.deleteOne({ mail });
        if (deletedGTE.deletedCount === 0) {
            return res.status(404).json({ error: 'GTE not found' });
        }
        res.status(200).json({ message: 'GTE deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'An error occurred during delete' });
    }
};

export { registerGTE, getAllGTEs, getGTEById, updateGTE, deleteGTE };
