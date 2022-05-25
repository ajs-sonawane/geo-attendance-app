const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const profileRoute = require("./api/routes/profile");
const userRoutes = require("./api/routes/user");
const attRoutes = require("./api/routes/attendance");
const liveTrackingRoutes = require("./api/routes/live_tracking");
const companyRoutes = require("./api/routes/company");
const membershipRoutes = require("./api/routes/membership");
const shiftsRoutes = require("./api/routes/shifts");


////////////////////////////////////////////////////// mongoose CONNECT ////////////////////
mongoose.connect(
    // "mongodb+srv://incretech:incretech@cluster0.pdiry.mongodb.net/incSAP",
    "mongodb+srv://dbUser:incretech@cluster0.pdiry.mongodb.net/geo-attendance-app?retryWrites=true&w=majority",
    { useNewUrlParser: true },
    { useMongoClient: true },
    { useUnifiedTopology: true });

mongoose.Promise = global.Promise;

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

////////////////////////////////////////////////////// CORS ERRORS HANDLING /////////////////////////
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    //browser makes OPTIONS req before POST req.
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Headers", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

//////////////////////////////////////////////// ROUTES WHICH HANDLE REQUESTS ////////////////////////////////
// app.use("/profile", profileRoute);
app.use("/user", userRoutes);
app.use("/att", attRoutes);
app.use("/livetrackin", liveTrackingRoutes);
app.use("/comp", companyRoutes);
app.use("/mem", membershipRoutes);
app.use("/shifts", shiftsRoutes);
app.use(express.static('routes'));


app.get("/", function (req, res, next) {
    res.sendFile(__dirname + "/initialroute.html");
})
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(function (req, res, next) {
    const error = Error("Not Found");
    error.status = 404;
    next(error);
});
app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    console.log("error >>>>>> >>> sss " + error.message);
    res.json({
        error: {
            code: 0,
            message: error.message
        }
    });
});

/// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> nodemailer >>

// var nodemailer = require('nodemailer');


// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'contact.youthtechnology@gmail.com',
//     pass: 'admin12345@'
//   }
// });

// var mailOptions = {
//   from: 'contact.youthtechnology@gmail.com',
//   to: 'abhijeet126007@gmail.com',
//   subject: 'Sending Email using Node.js',
//   html: '<h1>Welcome</h1><p>That was easy!</p>'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


/// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> >> random pswd generator >>

// function generatePassword() {
//   var length = 8,
//       charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//       retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//       retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// }

module.exports = app;
