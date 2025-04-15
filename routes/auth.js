const AuthSessionController = require("../controllers/Auth/AuthSessionController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { loginValidator, registerValidator } = require("../validators/authValidator");
const {Validate} = require("../middleware/Validate");

router.post('/login', loginValidator, Validate, AuthSessionController.login);
router.post('/register', registerValidator,  Validate, AuthSessionController.register);

router.use(auth);
router.post('/logout', AuthSessionController.logout);
router.post('/get-me', AuthSessionController.getMe);

module.exports = router;