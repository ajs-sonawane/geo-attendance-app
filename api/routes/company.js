const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company_cont");
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


router.get("/get_companies", CompanyController.get_all_companies);

router.get("/get_company_byid", CompanyController.company_get_byid);

router.post("/add_new_company", upload.single('company_image'), CompanyController.company_save);

router.post("/login_company", CompanyController.company_login);
// router.post("/delete_company_byid", CompanyController.company_delete_byid);


module.exports = router;