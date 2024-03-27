import bcrypt from 'bcrypt';
import SuperAdmin from '../model/superAdmin.js';

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

    res.status(200).json({ message: 'Superadmin login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const superAdminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await SuperAdmin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new super admin user
    const newSuperAdmin = new SuperAdmin({
      email,
      password: hashedPassword
    });

    // Save the new super admin user
    await newSuperAdmin.save();

    res.status(201).json({ message: 'Superadmin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { superAdminLogin, superAdminRegister };
