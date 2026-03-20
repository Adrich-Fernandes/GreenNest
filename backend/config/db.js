const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB = () => {
    if (!process.env.DB_url) {
        console.error("Error: DB_url is not defined in .env file");
        process.exit(1);
    }
    return mongoose.connect(process.env.DB_url).then(() => {
        console.log("Connected to MongoDB:", mongoose.connection.name);
    })
        .catch((err) => {
            console.error("MongoDB Connection Error:", err.message);
            process.exit(1);
        });
};

module.exports = ConnectDB;