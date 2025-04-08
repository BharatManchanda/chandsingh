const express = require('express')
const mongodbConnect = require('./config/connect/db')
const app = express()
const port = 8080
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const planRoutes = require("./routes/plan")
const friendRequestRoutes = require("./routes/friendRequest")
// app.use(bodyParser.json()) // for parsing application/json
// console.log(bodyParser,"::bodyParser");

// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// Middleware to parse URL-encoded request body (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON request body
app.use(express.json());

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', friendRequestRoutes)
app.use('/api', planRoutes)
app.get('/', function (request, response) {
    response.send("API Working Properly");
})
// app.get('/api/register', function (request, response){
//     const {first_name, last_name, email, password} = request.body;
//     console.log(first_name, last_name, email, password,"::first_name-last_name");
    
//     return response.json({
//         "name": "bharat",
//     });
// });
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.post('/test', (req, res) => {
//     const { name, email } = req?.body;
//     return res.json({
//         success: true,
//         message: "Data fetched successfully",
//         data: {
//             id: 1,
//             name: "John Doe",
//             email: "john@example.com"
//         }
//     });
// })

app.listen(port, () => {
    mongodbConnect();
    console.log(`Example app listening on port ${port}`)
})