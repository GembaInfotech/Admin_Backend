import bcrypt from 'bcrypt';
import SuperAdmin from '../model/superAdmin.js';
import { generateToken } from '../config/jwtTokens.js';

const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const superAdminUser = await SuperAdmin.findOne({ email });

    if (!superAdminUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordMatched = await bcrypt.compare(password, superAdminUser.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Debugging: Log retrieved user object
    console.log('Retrieved user:', superAdminUser);

    // Check user role
    console.log('User role:', superAdminUser.role); // Make sure role is correct
    if (superAdminUser.role !== 'superadmin') {
      console.log('Unauthorized access:', superAdminUser.role);
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const data = {
    
      token: generateToken(superAdminUser._id, superAdminUser.role),
    };
    console.log(data);

    // At this point, login is successful
    res.status(200).json({ message: 'Superadmin login successful',token:data.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const superAdminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a super admin with the same email already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email });

    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // If no super admin exists with the same email, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSuperAdmin = new SuperAdmin({
      email,
      password: hashedPassword,
      role: 'superadmin'
    });

    await newSuperAdmin.save();

    res.status(201).json({ message: 'Superadmin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





const superAdminUpdate = async (req, res) => {
  const { email, password } = req.body;
  const { id } = req.params;

  try {
    // Check if the super admin exists
    const superAdminUser = await SuperAdmin.findById(id);
    if (!superAdminUser) {
      return res.status(404).json({ error: 'Superadmin not found or invalid ID' });
    }

    // Update email if provided
    if (email) {
      superAdminUser.email = email;
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      superAdminUser.password = hashedPassword;
    }

    // Save the updated super admin user
    await superAdminUser.save();

    res.status(200).json({ message: 'Superadmin updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getSuperAdmin = async (req, res) => {
  try {
    // Find the super admin user
    const superAdminUser = await SuperAdmin.findOne({ role: 'superadmin' });
    
    if (!superAdminUser) {
      return res.status(404).json({ error: 'Superadmin not found' });
    }
    
    // If found, return the details
    res.status(200).json(superAdminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const superAdminDelete = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the super admin exists
    const superAdminUser = await SuperAdmin.findById(id);
    if (!superAdminUser) {
      return res.status(404).json({ error: 'Superadmin not found or invalid ID' });
    }

    // Remove the super admin user from the database
    await SuperAdmin.deleteOne({ _id: id });

    res.status(200).json({ message: 'Superadmin deleted successfully' });
  } catch (error) {
    console.error('Error deleting super admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { superAdminLogin, superAdminRegister, superAdminUpdate ,getSuperAdmin, superAdminDelete};