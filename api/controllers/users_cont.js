const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.users_get_all = function (req, res, next) {

    User.find()
        .select("_id name mobile email password")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs.map(doc => {
                        return {
                            user_id: doc._id,
                            role: doc.role,
                            name: doc.name,
                            mobile: doc.mobile,
                            email: doc.email


                        }
                    })
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

    let mobile = req.body.mobile;
    let password = req.body.password;

    User.find({ mobile: mobile })
        // .exec()
        .then(doc => {
            if (doc.length < 1) {
                return res.status(401).json({
                    code: 0,
                    message: "User not registered!",
                    token: null
                });
            }
            bcrypt.compare(password, doc[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        code: 0,
                        message: "Auth Failed!",
                        token: null
                    });
                }
                if (result) {
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
                        data: {
                            user_id: doc[0]._id,
                            role: doc[0].role,
                            name: doc[0].name,
                            mobile: doc[0].mobile,
                            email: doc[0].email
                        }
                    });
                }
                res.status(401).json({
                    code: 0,
                    message: "Auth Failed!",
                    token: null
                });
            });
        }).catch(err => {
            res.status(500).json({
                code: 1,
                message: "ERROR",
                error: err
            });
        });
};

exports.user_signup = function (req, res, next) {

    let role = req.body.role;
    let name = req.body.name;
    let mobile = req.body.mobile;
    let email = req.body.email;
    let password = req.body.password;

    User.find({ email: email }).exec().then(doc => {
        if (doc.length >= 1) {
            return res.status(200).json({
                code: 0,
                message: "E-Mail is already registered, Please Login.",
                result: {}
            });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        code: 0,
                        message: "ERROR",
                        error: err
                    });
                } else {

                    const user = User(
                        {
                            _id: mongoose.Types.ObjectId(),
                            role: role,
                            name: name,
                            mobile: mobile,
                            email: email,
                            password: hash,
                        }
                    );
                    user.save()
                        // .select("_id first_name last_name")
                        // .exec()
                        .then(result => {
                            res.status(200).json({
                                code: 1,
                                message: "user registered successfully",
                                result: {
                                    _id: result._id,
                                    role: result.role,
                                    name: result.name,
                                    mobile: result.mobile,
                                    email: result.email,
                                    password: result.password
                                }
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
            });
        }
    });



    // ProductDetail.find({
    //     company_name: companyName, particular_name: particularName, subtype_one_name: subtypeONEName,
    //     subtype_two_name: subtypeTWOName, subtype_three_name: subtypeTHREEName, subtype_four_name: subtypeFOURName,
    //     subtype_five_name: subtypeFIVEName,
    // }).exec().then(result => {
    //     if (result.length == 0) {
    //     } else {
    //         res.status(200).json({
    //             code: 1,
    //             message: "product already exists !!",
    //             result: result
    //         });
    //     }
    // }).catch(err => {
    //     console.log(err)
    //     res.status(500).json({
    //         code: 0,
    //         error: err
    //     });
    // });

};

exports.users_reset_password = function (req, res, next) {
};
