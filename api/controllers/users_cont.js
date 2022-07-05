const User = require("../models/userModel");
const Company = require("../models/companyModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');

exports.employees_by_compid = function (req, res, next) {

    User.find({ company: req.params.comp_id })
        // .select("_id role name mobile email")
        .populate("company shift")
        .exec()
       
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs
                    // .map(doc => {
                    //     return {
                    //         user_id: doc._id,
                    //         role: doc.role,
                    //         name: doc.name,
                    //         mobile: doc.mobile,
                    //         email: doc.email
                    //     }
                    // })
                };
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    code: 0,
                    message: "No enries found",
                    result: docs
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.employee_by_id = function (req, res, next) {

    User.find({ _id: req.params.id })
        // .select("_id role name mobile email")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs
                    // .map(doc => {
                    //     return {
                    //         user_id: doc._id,
                    //         role: doc.role,
                    //         name: doc.name,
                    //         mobile: doc.mobile,
                    //         email: doc.email
                    //     }
                    // })
                };
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    code: 0,
                    message: "No enries found",
                    result: docs
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};


exports.employees_get_all = function (req, res, next) {

    User.find({ role: req.body.role, mobile: req.body.mobile })
        .select("_id role name mobile email")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    data: docs
                    // .map(doc => {
                    //     return {
                    //         user_id: doc._id,
                    //         role: doc.role,
                    //         name: doc.name,
                    //         mobile: doc.mobile,
                    //         email: doc.email
                    //     }
                    // })
                };
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    code: 0,
                    message: "No enries found",
                    data: docs
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.user_signin = function (req, res, next) {

    let key = req.body.key;
    let pwd = req.body.pwd;

    let split = key.split(".");

    if (split[split.length - 1] === "company") {
        //// COMPANY LOGIN >>

        Company.find({ company_key: key })
            // .exec()
            .then(doc => {
                if (doc.length < 1) {

                    return res.status(401).json({
                        code: 0,
                        message: "Company not registered!",
                        token: null
                    });
                }
                bcrypt.compare(pwd, doc[0].company_pwd, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            code: 0,
                            message: "Auth Failed! ONE",
                            token: null
                        });
                    }
                    if (result) {
                        // get token >>
                        const token = jwt.sign({
                            company_key: doc[0].company_key,
                            _id: doc[0]._id
                        }, "secret", {
                            expiresIn: "1h"
                        });
                        console.log("----------------------------------------------");
                        console.log(doc);

                        return res.status(200).json({
                            code: 1,
                            message: "Auth success",
                            token: token,
                            result: doc
                        });
                    }
                    res.status(401).json({
                        code: 0,
                        message: "Auth Failed! TWO",
                        token: result
                    });
                });
            }).catch(err => {
                res.status(500).json({
                    code: 0,
                    message: "ERROR",
                    error: err
                });
            });



    } else {
        /// USER LOGIN >>>


        User.find({ key: key })
            // .exec()
            .then(doc => {
                if (doc.length < 1) {
                    return res.status(401).json({
                        code: 0,
                        message: "User not registered!",
                        token: null
                    });
                }
                bcrypt.compare(pwd, doc[0].passcode, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            code: 0,
                            message: "Auth Failed! ONE",
                            token: null
                        });
                    }
                    if (result) {
                        // get token >>
                        const token = jwt.sign({
                            mobile: doc[0].mobile,
                            user_id: doc[0]._id
                        }, "secret", {
                            expiresIn: "1h"
                        });

                        return res.status(200).json({
                            code: 1,
                            message: "Auth success",
                            token: token,
                            result: doc
                        });
                    }
                    res.status(401).json({
                        code: 0,
                        message: "Auth Failed! TWO",
                        token: doc
                    });
                });
            }).catch(err => {
                res.status(500).json({
                    code: 0,
                    message: "ERROR",
                    error: err
                });
            });







    }



};

exports.emp_register = function (req, res, next) {

    let role = req.body.role;
    let name = req.body.name;
    let mobile = req.body.mobile;
    let desig = req.body.designation;
    let email = req.body.email;
    let password = req.body.password;
    let company = req.body.company_id;
    let shift = req.body.shift_id;
    let img = req.body.img_url;

    User.find({ mobile: mobile, email: email })
        .select("_id company shift name role designation mobile email key user_profile_image")
        .populate("company shift")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                res.status(200).json({
                    code: 1,
                    count: docs.length,
                    message: "User Already Registered with mobile: " + docs[0].mobile + " & email: " + docs[0].email,
                    result: docs[0]
                });
            } else {

                User.find({ mobile: mobile })
                    .select("_id company shift name role designation mobile email key user_profile_image")
                    .exec()
                    .then(docs => {
                        if (docs.length > 0) {
                            res.status(200).json({
                                code: 1,
                                count: docs.length,
                                message: "User Already Registered with mobile: " + docs[0].mobile,
                                result: docs[0]
                            });
                        } else {
                            User.find({ email: email })
                                .select("_id company shift name role designation mobile email key user_profile_image")
                                .exec()
                                .then(docs => {
                                    if (docs.length > 0) {
                                        res.status(200).json({
                                            code: 1,
                                            count: docs.length,
                                            message: "User Already Registered with email: " + docs[0].email,
                                            result: docs[0]
                                        });
                                    } else {
                                        bcrypt.hash(password, 10, (err, hash) => {
                                            if (err) {
                                                console.log(err + " error on pwd " + password + " " + email);
                                                return res.status(500).json({
                                                    code: 0,
                                                    message: "ERROR",
                                                    error: err
                                                });
                                            } else {
                                                console.log(password + " >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                                Company.find({ _id: company }).exec().then(doc => {
                                                    console.log(doc.length + " DOCS");
                                                    if (doc.length >= 1) {
                                                        var company_name = doc[0].company_name;


                                                        var key = generateKey(email, company_name);

                                                        const user = User(
                                                            {
                                                                _id: mongoose.Types.ObjectId(),
                                                                role: role,
                                                                name: name,
                                                                mobile: mobile,
                                                                designation: desig,
                                                                email: email,
                                                                key: key,
                                                                passcode: hash,
                                                                company: company,
                                                                shift: shift,
                                                                user_profile_image: img
                                                            }
                                                        );
                                                        user.save()
                                                            // .select("_id first_name last_name")
                                                            // .exec()
                                                            .then(result => {

                                                                /// send email to user with creds >>>>>>>>>>>
                                                                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> sending email >>
                                                                sendEmail(email, key, password);
                                                                res.status(200).json({
                                                                    code: 1,
                                                                    message: "user registered successfully",
                                                                    result: result
                                                                });
                                                            })
                                                            .catch(err => {
                                                                console.log(err + "catch on save")
                                                                res.status(500).json({
                                                                    code: 0,
                                                                    error: err
                                                                });
                                                            });


                                                    } else {
                                                        console.log("else on company find");
                                                    }

                                                });
                                            }
                                        });
                                    }
                                });

                            function generateKey(email, compName) {
                                const myArray = email.split("@");
                                var key = myArray[0] + "@yt." + compName;
                                return key;
                            }

                            function sendEmail(email, key, pwd) {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'contact.youthtechnology@gmail.com',
                                        pass: 'qumxshcutavcafgn'
                                    }
                                });

                                var mailOptions = {
                                    from: 'contact.youthtechnology@gmail.com',
                                    to: email,
                                    subject: 'Login Credentials',
                                    html: '<h1>Welcome to YOUTH TECHNOLOGY</h1><h4>part of INCRETECH PVT. LTD.</h4><p>Your login credentials:</p><p> LOGIN KEY : <h5>' + key + '</h5></p><p>LOGIN PASSWORD : <h5>' + pwd + '</h5></p>'
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                            }

                        };
                    });
            }
        });
}

exports.users_reset_password = function (req, res, next) {
};


exports.user_delete = function (req, res, next) {
    let user_id = req.body.user_id;

    User.remove({
        _id: user_id
    }).exec().then(result => {
        res.status(200).json({
            code: 1,
            message: "Deleted !!",
            result: result
            // deletedCount: result.deletedCount,

        });
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
}