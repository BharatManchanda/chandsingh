const express = require("express");
const router = express.Router();
const PartnerPreferenceController = require("../controllers/PartnerPreferenceController");

router.post('/prefer-partner/save', PartnerPreferenceController.create);

module.exports = router;