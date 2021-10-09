const express = require("express");
const router = express.Router();
const AttController = require("../controllers/attendance_cont");
const multer = require("multer");


//storage strategy >>
const storage = multer.diskStorage({
    //where to store the incoming file ...
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

//filtering files you want 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        // accept file
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
};

// const upload = multer({ dest: "uploads/" });
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // }
});


router.get("/get_attendance_by_userid", AttController.att_get_by_userid);

router.post("/save_attendance", upload.single('selfie'), AttController.att_save_or_update);

// router.post("/signup", UserController.user_signup);

// router.get("/reset_password", UserController.users_reset_password);


module.exports = router;
