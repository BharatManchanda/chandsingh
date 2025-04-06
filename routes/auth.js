const AuthSessionController = require("../controllers/Auth/AuthSessionController");
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/Auth");

router.post('/login', AuthSessionController.login);
router.post('/register', AuthSessionController.register);

router.use(auth);
router.post('/logout', AuthSessionController.logout);
router.post('/get-me', AuthSessionController.getMe);

module.exports = router;