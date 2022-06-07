const mongoose = require("mongoose");

const Att = require("../models/attendanceModel");
const ltm = require("../models/liveTrackingModel");


exports.get_att_by_userid = function (req, res, next) {

    Att.find({ user: req.body.user })
        .select("_id user self_image_file login_datetime logout_datetime login_cords logout_cords")
        .exec()
        .then(docs => {

            if (docs.length > 0) {
                res.status(200).json({
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs
                });

            } else {
                res.status(200).json({
                    code: 0,
                    count: docs.length,
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
}

exports.att_save = function (req, res, next) {
    let userID = req.body.user;
    // let self_image = req.file == undefined ? "" : req.file.path;
    let logINDateTime = req.body.login_datetime;
    let logOUTDateTime = req.body.logout_datetime;
    let logINCords = req.body.login_cords;
    let logOUTCords = req.body.logout_cords;

    // let coordinates = req.body.coordinates;



    Att.find({ user: userID })
        .exec()
        .then(docs => {
            // console.log(docs);

            if (docs.length > 0) {

                let loginDateOnly = logINDateTime.split(" ")[0];
                let logoutDateOnly = logOUTDateTime.split(" ")[0];

                // 1. search user by user id
                // 2. user att list shown
                // 3. search login date if exists' in att list ?
                // 4. if exists > then check if logout date exists ?
                //      a. if logout date also exists > show user att already submitted for the day.
                //      b. if logout date is empty > user must logout > update logout
                // 6. 

                const op = docs.filter(function (attObj) {
                    if (logINDateTime === "") {
                        return attObj["login_datetime"].split(" ")[0] === logoutDateOnly;
                    }
                    return;

                });
                // console.log("OUTPUT >> " + op);
                if (op.length == 1) {
                    // console.log("OUTPUT >> " + op[0]["_id"]);
                    Att.updateMany({ _id: op[0]["_id"] },
                        {
                            logout_datetime: logOUTDateTime,
                            logout_cords: logOUTCords
                        })
                        .exec()
                        .then(result => {

                            // updating status in live tracking model ...
                            ltm.updateMany({ user: userID }, {
                                status: "OFFLINE"
                            }).exec().then(updateResult => {

                                res.status(200).json({
                                    code: 1,
                                    message: "LOGOUT success and updated STATUS as 'OFFLINE'",
                                    result: result
                                });

                            }).catch(err => {
                                res.status(200).json({
                                    code: 0,
                                    error: err
                                });
                            });


                        })
                        .catch(err => {
                            res.status(200).json({
                                code: 0,
                                error: err
                            });
                        });



                } else {
                    console.log("ELSE >> " + op.length);
                    // add new  att /
                    const att = Att(
                        {
                            _id: mongoose.Types.ObjectId(),
                            user: userID,
                            self_image_file: req.file == undefined ? "" : selfie.replace(/\\/g, "/"),
                            login_datetime: logINDateTime,
                            logout_datetime: logOUTDateTime,
                            login_cords: logINCords,
                            logout_cords: logOUTCords,
                        }
                    );
                    att.save()
                        .then(result => {
                            res.status(200).json({
                                code: 1,
                                message: "Saved!",
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

            } else {

                const att = Att(
                    {
                        _id: mongoose.Types.ObjectId(),
                        user: userID,
                        self_image_file: req.file == undefined ? "" : selfie.replace(/\\/g, "/"),
                        login_datetime: logINDateTime,
                        logout_datetime: logOUTDateTime,
                        login_cords: logINCords,
                        logout_cords: logOUTCords,
                    }
                );
                att.save()
                    .then(result => {
                        res.status(200).json({
                            code: 1,
                            message: "Saved!",
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
        .catch(err => {
            console.log(err)
            res.status(500).json({
                code: 0,
                error: err
            });
        });

}
