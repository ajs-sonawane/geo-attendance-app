const Company = require("../models/companyModel");
const User = require("../models/userModel");
const CompanyShifts = require("../models/companyShiftsModel");

const nodemailer = require('nodemailer');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.get_all_companies = function (req, res, next) {

    Company.find()
        .select("_id company_name company_mobile company_email comp_regd_location company_image shifts membership role")
        .populate("membership")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs

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

exports.company_get_byid = function (req, res, next) {
    let compId = req.body.comp_id;

    Company.find({ _id: compId })
        .select("_id company_name company_mobile company_email comp_regd_location company_image membership role")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs

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

exports.company_save = function (req, res, next) {
    let companyName = req.body.company_name;
    let companyMobile = req.body.company_mobile;
    let companyEmail = req.body.company_email;
    let compRegdLoc = req.body.comp_regd_location;
    let companyImage = req.body.company_image;
    let membership = req.body.membership;
    let active = req.body.active;

    Company.find({ company_mobile: companyMobile, company_email: companyEmail })
        .select("_id company_name company_mobile company_email comp_regd_location company_image membership role")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                res.status(200).json({
                    code: 1,
                    count: docs.length,
                    message: "Company Already Registered with mobile: " + docs[0].company_mobile + " & email: " + docs[0].company_email,
                    result: docs[0]
                });
            } else {

                Company.find({ company_mobile: companyMobile })
                    .select("_id company_name company_mobile company_email comp_regd_location company_image membership role")
                    .exec()
                    .then(docs => {
                        if (docs.length > 0) {
                            res.status(200).json({
                                code: 1,
                                count: docs.length,
                                message: "Company Already Registered with mobile: " + docs[0].company_mobile,
                                result: docs[0]
                            });
                        } else {
                            Company.find({ company_email: companyEmail })
                                .select("_id company_name company_mobile company_email comp_regd_location company_image membership role")
                                .exec()
                                .then(docs => {
                                    if (docs.length > 0) {
                                        res.status(200).json({
                                            code: 1,
                                            count: docs.length,
                                            message: "Company Already Registered with email: " + docs[0].company_email,
                                            result: docs[0]
                                        });
                                    } else {
                                        // save new company (register new admin) >>

                                        // generate unique LOGIN key & pwd for Company >>

                                        var key = generateKey(companyEmail);
                                        console.log(key);
                                        var pwd = generatePassword();
                                        console.log(pwd);



                                        bcrypt.hash(pwd, 10, (err, hash) => {
                                            if (err) {
                                                return res.status(500).json({
                                                    code: 0,
                                                    message: "ERROR",
                                                    error: err
                                                });
                                            } else {
                                                // save to DB >>
                                                const comp = Company(
                                                    {
                                                        _id: mongoose.Types.ObjectId(),
                                                        company_name: companyName,
                                                        company_mobile: companyMobile,
                                                        company_email: companyEmail,
                                                        comp_regd_location: compRegdLoc,
                                                        company_image: companyImage,
                                                        membership: membership,
                                                        company_key: key,
                                                        company_pwd: hash,
                                                        role: "COMPANY",
                                                        active: active,
                                                    }
                                                );

                                                // console.log(comp);

                                                comp.save()
                                                    .then(result => {

                                                        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> sending email >>
                                                        sendEmail(companyEmail, key, pwd)

                                                        res.status(200).json({
                                                            code: 1,
                                                            message: "Company registered successfully",
                                                            result: result
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.log(err)
                                                        res.status(500).json({
                                                            code: 0,
                                                            error: err
                                                        });
                                                    });
                                            }
                                        })


                                    }
                                })

                        }
                    })

            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });



    function generatePassword() {
        var length = 6,
            charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    function generateKey(email) {
        const myArray = email.split("@");
        var key = myArray[0] + "@yt.company";
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
                console.log(info);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }


}

exports.company_login = function (req, res, next) {
    let key = req.body.key;
    let pwd = req.body.pwd;

    Company.find({ company_key: key })
        // .exec()
        .then(doc => {
            if (doc.length < 1) {
                
                return res.status(401).json({
                    code: 1,
                    message: "User not registered!",
                    token: null
                });
            }
            bcrypt.compare(pwd, doc[0].company_pwd, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        code: 1,
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

}
