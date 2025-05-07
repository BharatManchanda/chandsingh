const AuthSessionController = require("../controllers/Auth/AuthSessionController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { loginValidator, registerValidator, profileImageCreateValidator, profileImageUpdateValidator, profileImageCreateMultipleValidator } = require("../validators/authValidator");
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
router.post('/register', registerValidator,  Validate, AuthSessionController.register);

router.use(auth);
router.post('/logout', AuthSessionController.logout);
router.post('/get-me', AuthSessionController.getMe);

router.post('/profile-image/', AuthSessionController.listImage)
router.post('/profile-image/add', upload.single('image'), profileImageCreateValidator, Validate, AuthSessionController.addImage)
router.post('/profile-image/add-multi', upload.array('image', 5), profileImageCreateMultipleValidator, Validate, AuthSessionController.addMultiImage)
router.post('/profile-image/update', upload.single('image'), profileImageUpdateValidator, Validate, AuthSessionController.updateImage)
router.post('/profile-image/delete', AuthSessionController.deleteImage)

module.exports = router;