const express = require("express");
const ProfileViewController = require("../controllers/ProfileViewController");
const { profileViewMarkValidator } = require("../validators/profileViewValidator");
const { Validate } = require("../middleware/Validate");
const router = express.Router();

router.post('/profile-view/mark', profileViewMarkValidator, Validate, ProfileViewController.viewMark);
router.post('/profile-view/list', ProfileViewController.viewdProfile);

module.exports = router;