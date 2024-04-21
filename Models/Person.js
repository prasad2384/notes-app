import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true,
        trim: true
    },
    last_name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    mobile_number: {
        type: Number,
        require: true
    },
    address: {
        type: String
    },
    pincode: {
        type: Number,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    date_of_birth: {
        type: Date,
    }
}, { timestamps: true });

export default mongoose.model('user', userschema);