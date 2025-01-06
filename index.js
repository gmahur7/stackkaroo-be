require('dotenv').config();
const express = require('express');
const DbConnect = require('./config/DbConnect');
DbConnect();
const cors = require('cors');
const bodyParser = require("body-parser");

const port = process.env.PORT || 6002;

const app=express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "https://stackkaroo-ten.vercel.app",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
    credentials: true
}

app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    console.log(`${req.method} request to ${req.url}`);
    res.status(200)
    .send('<h1>Hello World</h1>')
})

// app.use((req,res,next)=>{
//     console.log(`${req.method} request to ${req.url}`);
//     next();
// })

const userRoutes = require('./routes/UserRoutes');

app.use('/api/v1/user',userRoutes);

app.listen(port,()=>{
    console.log("server is running @ ",`http://localhost:${port}`)
});