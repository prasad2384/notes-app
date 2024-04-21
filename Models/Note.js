import mongoose from 'mongoose';
const notesschema = new mongoose.Schema({
    user_id: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    }
}, { timestamps: true });

export default mongoose.model('notes', notesschema);