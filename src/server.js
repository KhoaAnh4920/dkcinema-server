var express = require('express')
var cors = require('cors')
var app = express()
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
require('dotenv').config();





// enable CROS // 
app.use(cors({ credentials: true, origin: true }));
// Add headers before the routes are defined
// app.use(function (req, res, next) {

//     const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }

//     // Website you wish to allow to connect
//     // res.setHeader('Access-Control-Allow-Origin', 'https://spotifakeplus.herokuapp.com');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, authorization');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// config app //

// Khai báo bodyParser and fix PayloadTooLargeError: request entity too large //
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

viewEngine(app);
initWebRoutes(app);
// conncect db //
connectDB();

let port = process.env.PORT || 8000;

app.listen(port, () => {
    // callback //
    console.log("Backend Nodejs is runing")
})