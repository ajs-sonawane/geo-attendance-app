const CompShifts = require("../models/companyShiftsModel");
const mongoose = require("mongoose");

exports.get_shifts_by_company_id = function (req, res, next) {
    let compId = req.body.company;

    CompShifts.find({ company: compId })
        .select("_id shift_name shift_time company")
        .populate("company")
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
};

exports.add_new_shift = function (req, res, next) {
    let compId = req.body.company_id;
    let shiftName = req.body.shift_name;
    let shiftTime = req.body.shift_time;

    const compShifts = CompShifts(
        {
            shift_name: shiftName,
            shift_time: shiftTime,
            company: compId
        }
    );

    compShifts.save()
        // .select("_id first_name last_name")
        // .exec()
        .then(result => {
            res.status(200).json({
                code: 1,
                message: "new shift added",
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

exports.delete_shift = function (req, res, next) {
    let compId = req.body.company_id;

    CompShifts.remove({
        company: compId
    }).exec().then(result => {
        res.status(200).json({
            code: 1,
            message: "shift removed!",
            result: result
            // deletedCount: result.deletedCount,

        });
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
}