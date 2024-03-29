import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mob: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    add: {
        type: String,
    },
    city:{
        type:String,
    },
    state: {
        type: String,
    },
    pc: {
        type: String,
    },
    region: {
        type: String,
    },
    regionCode: {
        type: String,
    },
    status: {
        type: String,
    },
    // role: {
    //     type: String,
    // },
    password: {
        type: String,
        required: true
    },
    verificationToken: String,
    // Additional fields for differentiation
    role: {
        type: String,
        enum: ['StateAdmin', 'CityAdmin', 'GTE'], // Define the possible admin types
        required: true
    }
});

export const Admin = model("Admin", adminSchema);
