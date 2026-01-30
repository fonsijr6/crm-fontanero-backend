const mongoose = require('mongoose');
require('dotenv').config({ path: 'var.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
        })
        console.log('BD Conectada')
    } catch (err) {
        console.log(err);
        process.exit(1); // Detenemos la app
    }
}

module.exports = connectDB;