const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('db connection successful')
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;