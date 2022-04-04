
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const LiveTrackingModel = require("../models/liveTrackingModel");

exports.update_location = function (req, res, next) {

    let userID = req.body.user;
    let area = req.body.area;
    let coordinates = req.body.coordinates;
    let datetime = req.body.datetime;
    let status = req.body.status;

    // LiveTrackingModel.find({ email: email }).exec().then(doc => {
    LiveTrackingModel.find({ user: userID }).exec().then(docs => {

        //
        if (docs.length > 1) {
            // deleting if exist loc ... 

            // for (let i = 0; i < docs.length; i++) {
            //     const element = docs[i];
                
            // }
            LiveTrackingModel.remove({
                user: userID
            }).exec().then(result => {
                res.status(200).json({
                    code: 1,
                    message: "Deleted !!",
                    result: result

                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            });
        } else {
            const liveTrackingModel = LiveTrackingModel(
                {
                    _id: mongoose.Types.ObjectId(),
                    user: userID,
                    area: area,
                    coordinates: coordinates,
                    datetime: datetime,
                    status: status,
                }
            );
            liveTrackingModel.save()
                // .select("_id first_name last_name")
                // .exec()
                // .populate("user")
                .then(result => {
                    res.status(200).json({
                        code: 1,
                        message: "Location Updated",
                        result: result
                    });
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        code: 0,
                        message: "Request Failed",
                        error: err
                    });
                });
        }
    });



};

exports.get_loc_list = function (req, res, next) {

    LiveTrackingModel.find()
        .populate({ path: 'user' })
        .select("user area datetime coordinates status")
        .exec()
        .then(docs => {
            // console.log(" docs >> " + docs);
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
                    count: docs.length,
                    message: "No enries found",
                    result: docs
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: [err]
            });
        });
};

exports.get_loc_by_userid = function (req, res, next) {

    let userID = req.body.user_id;

    LiveTrackingModel.find({ user: userID })
        .populate({ path: 'user' })
        .select("user area datetime coordinates status")
        .exec()
        .then(docs => {

            if (docs.length > 0) {
                const response = {
                    code: 1,
                    count: docs.length,
                    message: "success",
                    result: docs[docs.length - 1]
                };
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
                error: [err]
            });
        });
};
