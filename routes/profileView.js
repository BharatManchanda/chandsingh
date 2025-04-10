const express = require("express");
const ProfileViewController = require("../controllers/ProfileViewController");
const router = express.Router();

router.post('/profile-view/mark', ProfileViewController.viewMark);
router.post('/profile-view/list', ProfileViewController.viewdProfile);

module.exports = router;