const mongoose = require("mongoose");

const Att = require("../models/attendanceModel");

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
            
            console.log("1st >>>>>>>>>>>>>>>>>>>>>> "+docs);



            if (docs.length > 0) {


                if (logINDateTime == "") {

                    console.log("inside logINDateTime == null");

                    var date = logOUTDateTime.split(" ", 2);
                    console.log("DATE >>>>>>> " + date[0]);
                    // const regex = new RegExp(date[0], 'i');
                    // console.log("data .....................  " + date[0] + " ---- " + regex + " ---- " + logOUTDateTime.includes(date[0]));
                    Att.find({ user: userID, logout_datetime: date[0] })
                        .exec()
                        .then(docs => {
                           
                            if (docs.length == 1) {

                                res.status(200).json({
                                    code: 0,
                                    message: "Already Logged OUT ."
                                });
                            } else {
                                Att.updateMany({ user: userID },
                                    {
                                        logout_datetime: logOUTDateTime,
                                        logout_cords: logOUTCords
                                    })
                                    .exec()
                                    .then(result => {
                                        res.status(200).json({
                                            code: 1,
                                            message: "LOGOUT success",
                                            result: result
                                        });
                                    })
                                    .catch(err => {
                                        res.status(200).json({
                                            code: 0,
                                            error: err
                                        });
                                    });
                            }

                        })





                } else {
                    console.log("inside logOUTDateTime == null");

                    var date = logINDateTime.split(" ", 2);
                    console.log("DATE >>>>>>> " + date[0]);
                    const regex = new RegExp(date[0], 'i');

                    Att.find({ user: userID, login_datetime: regex })
                        .exec()
                        .then(docs => {
                            if (docs.length == 1) {

                                res.status(200).json({
                                    code: 0,
                                    message: "Already Logged IN ."
                                });
                            } else {
                                Att.updateMany({ user: userID },
                                    {
                                        login_datetime: logINDateTime,
                                        login_cords: logINCords
                                    })
                                    .exec()
                                    .then(result => {
                                        res.status(200).json({
                                            code: 1,
                                            message: "LOGIN success",
                                            result: result
                                        });
                                    })
                                    .catch(err => {
                                        res.status(200).json({
                                            code: 0,
                                            error: err
                                        });
                                    });
                            }

                        })

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











    // var date = datetime.split(" ", 2);
    // // console.log("DATE >>>>>>> " + date[0]);
    // // console.log("datetime >>>>>>> " + datetime);
    // const regex = new RegExp(date[0], 'i');
    // Att.find({ user_id: userID, datetime: regex })
    //     .exec()
    //     .then(docs => {
    //         if (docs.length > 0) {
    //             // console.log(" >>>> datetime >> TRUE");
    //             res.status(200).json({
    //                 code: 0,
    //                 message: "Attendance for today already submitted."
    //             });

    // Profile.updateMany({ datetime: datetime },
    //     {
    //         selfie: selfie,
    //         designation: req.body.designation,
    //         location: req.body.location,
    //         objective: req.body.objective,
    //         profile_image: req.file.path
    //     })
    //     .exec()
    //     .then(result => {
    //         res.status(200).json(result);
    //     })
    //     .catch(err => {
    //         res.status(200).json({
    //             code: 0,
    //             error: err
    //         });
    //     });
    // res.status(200).json(response);
    //         } else {
    //             // console.log(" >>>> datetime >> FALSE");
    //             // console.log(">>>>> selfie <<<< " + selfie);

    //             // if (selfie == undefined) {
    //             // var split = selfie == undefined ? "" : selfie.replace(/\\/g, "/");
    //             // }

    //             // console.log("split >>> " + split);
    //             const att = Att(
    //                 {
    //                     _id: mongoose.Types.ObjectId(),
    //                     user_id: userID,
    //                     selfie: req.file == undefined ? "" : selfie.replace(/\\/g, "/"),
    //                     datetime: datetime,
    //                     area: area,
    //                     coordinates: coordinates
    //                 }
    //             );

    //             att.save()
    //                 .then(result => {
    //                     res.status(200).json({
    //                         code: 1,
    //                         message: "Saved!",
    //                         result: {
    //                             _id: result._id,
    //                             user_id: result.user_id,
    //                             selfie: result.selfie,
    //                             datetime: result.datetime,
    //                             area: result.area,
    //                             coordinates: result.coordinates
    //                         }
    //                     });
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.status(500).json({
    //                         code: 0,
    //                         error: err
    //                     });
    //                 });

    //         }

    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json({
    //             code: 0,
    //             error: err
    //         });
    //     });


}
