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
    },
    password: {
        type: String,
        required: true
    },
    gteRef: {
        type: Schema.Types.ObjectId,
        ref: 'GTE' // Reference to the GTE schema
    }
});

export const CityAdmin = model("CityAdmin", cityAdminSchema);
