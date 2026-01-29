
// Use this file to connect to MongoDB, if you are not using MongoDB, remove this file and mongoose package from dependencies

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';


const db = process.env.DATABASE_URL
const dbName = process.env.DB_NAME

const connectDB = async () => {

    if (!db || !dbName) {
        throw new Error('DATABASE_URL or DB_NAME is not defined');
    }

    try {
        await mongoose.connect(`${db}/${dbName}`);
        console.log('==== MongoDB Connected ====');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

export default connectDB;