import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const gteSchema = new Schema({
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
    city: {
        type: String,
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
    role: {
        type: String,
        default: 'GTE' // Set default role to 'GTE'
    },
    password: {
        type: String,
        required: true
    },
    // Add any additional fields specific to GTE
});

export const GTE = model("GTE", gteSchema);
