const express = require('express')
const mongodbConnect = require('./config/connect/db')

const app = express()
const port = 8080
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const planRoutes = require("./routes/plan")
const friendRequestRoutes = require("./routes/friendRequest")
const profileViewRoutes = require("./routes/profileView")
const partnerPreference = require("./routes/partnerPreference")
const path = require('path')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.send("API Working Properly");
})

// Client Routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', friendRequestRoutes)
app.use('/api', profileViewRoutes)
app.use('/api', partnerPreference)

// Admin Routes
app.use('/api', planRoutes)

app.listen(port, () => {
    mongodbConnect();
    console.log(`🚀 Server is up and running on http://localhost:${port}`);
})