import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';


const startServer = () => {
    try {
        // connectDB(); Remove this line if you don't want to connect to MongoDB or if you're not using MongoDB
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('===============================');
            console.log(`Server running on port ${PORT}`);
            console.log('===============================');
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();
