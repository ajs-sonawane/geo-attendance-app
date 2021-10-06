const mongoose = require("mongoose");

const Att = require("../models/attendanceModel");

exports.att_get_by_userid = function (req, res, next) {

    Att.find({ user_id: req.params.user_id })
        .select("_id user_id selfie datetime area coordinates")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs
                        .map(doc => {
                            return {
                                _id: doc._id,
                                user_id: doc.user_id,
                                selfie: "https://geo-attendance-app.herokuapp.com" + "/" + doc.selfie,
                                datetime: doc.datetime,
                                area: doc.area,
                                coordinates: doc.coordinates
                                // request: {
                                //     type: "GET",
                                //     url: "http://localhost:3000/companies/" + doc._id
                                // }
                            }
                        })
                }
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
}

exports.att_save_or_update = function (req, res, next) {
    let userID = req.body.user_id;
    let selfie = req.file.path;
    let datetime = req.body.datetime;
    let area = req.body.area;
    let coordinates = req.body.coordinates;


    Att.find({ datetime: datetime })
        // .select("_id user_id full_name designation location objective profile_image")
        .exec()
        .then(docs => {
            if (docs.length > 0) {

                res.status(200).json(response);

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
            } else {

                const att = Att(
                    {
                        _id: mongoose.Types.ObjectId(),
                        user_id: userID,
                        selfie: selfie,
                        datetime: datetime,
                        area: area,
                        coordinates: coordinates
                    }
                );
                att.save()
                    .then(result => {
                        res.status(200).json({
                            code: 1,
                            message: "Saved!",
                            result: {
                                _id: result._id,
                                user_id: result.user_id,
                                selfie: result.selfie,
                                datetime: result.datetime,
                                area: result.area,
                                coordinates: result.coordinates
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

        })
        .catch(err => {
            res.status(500).json({
                code: 0,
                error: err
            });
        });


}