const PlanController = require("../controllers/PlanController");
const express = require("express");
const router = express.Router();
const role = require("../middleware/Role");
const auth = require("../middleware/Auth");
const { planCreateOrEditValidator, planDeleteValidator } = require("../validators/planValidator");
const { Validate } = require("../middleware/Validate");

router.use(auth);
router.post('/plan', PlanController.list);

router.use(role(["admin"]));
router.post('/plan/create-or-update', planCreateOrEditValidator, Validate, PlanController.createOrUpdate);
router.delete('/plan/delete/:_id', planDeleteValidator, Validate, PlanController.delete);

module.exports = router;