import { Schema } from "mongoose";
import mongoose from "mongoose";

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    add: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pc: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    region_code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});



export const Admin = mongoose.model("Admin", AdminSchema);