import mongoose from 'mongoose';

const superAdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin'], // Example role options
    default: 'superadmin' // Default role for new users
  }
});

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

export default SuperAdmin;
