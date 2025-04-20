const AuthSessionController = require("../controllers/Auth/AuthSessionController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { loginValidator, registerValidator } = require("../validators/authValidator");
const {Validate} = require("../middleware/Validate");
const path = require('path');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, 'uploads/profile')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
})


router.post('/login', loginValidator, Validate, AuthSessionController.login);
router.post('/register', upload.single('image'), registerValidator,  Validate, AuthSessionController.register);

router.use(auth);
router.post('/logout', AuthSessionController.logout);
router.post('/get-me', AuthSessionController.getMe);

module.exports = router;