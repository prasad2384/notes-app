import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    Otp: {
        require: true,
        type: Number,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        require: true,
        get: (timestamp) => timestamp.getTime(),
        set: (timestamp) => new Date(timestamp)
    }
});

export default mongoose.model('Otp', OtpSchema);