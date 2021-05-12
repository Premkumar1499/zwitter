const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log(`Mongodb connected to ${conn.connection.host}`);
    } catch (error) {
        throw new Error(error.message)
    }

}

module.exports = connectDB