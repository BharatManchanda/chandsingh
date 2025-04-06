const mongoose = require("mongoose");
require('dotenv').config()

const mongodbConnect = () => {
    mongoose.connect(process.env.MONGODB_LINK, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((res) => console.log("MongoDB connected."))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = mongodbConnect;