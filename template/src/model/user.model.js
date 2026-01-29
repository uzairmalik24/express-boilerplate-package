
// Use models if you are not using MongoDB, remove this file and remove mongoose package from dependencies


import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);