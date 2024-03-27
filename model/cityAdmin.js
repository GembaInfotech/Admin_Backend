import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cityAdminSchema = new Schema({
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
    address: {
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
    regionCode: {
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

export const CityAdmin = mongoose.model("CityAdmin", cityAdminSchema);