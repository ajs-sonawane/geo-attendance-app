const Membership = require("../models/membershipModel");
const mongoose = require("mongoose");

exports.get_all_membership_schemes = function (req, res, next) {

    Membership.find()
        .select("_id membership_name membership_amt validity")
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

exports.add_new_membership = function (req, res, next) {
    let mName = req.body.membership_name;
    let mAmt = req.body.membership_amt;
    let mVal = req.body.validity;

    const membership = Membership(
        {
            membership_name: mName,
            membership_amt: mAmt,
            validity: mVal
        }
    );

    membership.save()
        // .select("_id first_name last_name")
        // .exec()
        .then(result => {
            res.status(200).json({
                code: 1,
                message: "membership added",
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
};