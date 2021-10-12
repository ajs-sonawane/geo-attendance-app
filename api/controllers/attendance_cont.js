const mongoose = require("mongoose");

const Att = require("../models/attendanceModel");

exports.att_get_by_userid = function (req, res, next) {

    Att.find({ user_id: req.body.user_id })
        .select("_id user_id selfie datetime area coordinates")
        .exec()
        .then(docs => {
            console.log("----------------- " + docs);
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
                                name: doc.name,
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

exports.att_save_or_update = function (req, res, next) {
    let userID = req.body.user_id;
    let selfie = req.file.path;
    let datetime = req.body.datetime;
    let area = req.body.area;
    let coordinates = req.body.coordinates;

    var date = datetime.split(" ", 2);
    console.log("DATE >>>>>>> " + date[0]);
    console.log("datetime >>>>>>> " + datetime);
    const regex = new RegExp(date[0], 'i');
    Att.find({ user_id: userID, datetime: regex })
        // .select("_id user_id full_name designation location objective profile_image")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                // console.log(" >>>> datetime >> TRUE");
                res.status(200).json({
                    code: 0,
                    message: "Attendance for today already submitted."
                });

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
                // console.log(" >>>> datetime >> FALSE");
                // console.log(">>>>> selfie <<<< " + selfie);
                var split = selfie.replace(/\\/g, "/");
                // console.log("split >>> " + split);
                const att = Att(
                    {
                        _id: mongoose.Types.ObjectId(),
                        user_id: userID,
                        selfie: split,
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
