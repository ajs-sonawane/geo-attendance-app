const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users_cont");
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

//filtering files you want >>
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        // accept file
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
};

// const upload = multer({ dest: "uploads/" }); >>
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // }
});


// router.get("/get_users", UserController.users_get_all);

router.post("/get_employees", UserController.employees_get_all);

router.get("/get_employees_by_compid/:comp_id", UserController.employees_by_compid);
router.get("/get_employee_by_id/:id", UserController.employee_by_id);

router.post("/delete_user", UserController.user_delete);



router.post("/signin", UserController.user_signin);

router.post("/emp_register", upload.single('img_url'), UserController.emp_register);

router.get("/reset_password", UserController.users_reset_password);


module.exports = router;
