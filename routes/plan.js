const PlanController = require("../controllers/PlanController");
const express = require("express");
const router = express.Router();
const role = require("../middleware/Role");
const auth = require("../middleware/Auth");


router.use(auth);
router.post('/plan', PlanController.list);

router.use(role(["admin"]));
router.post('/plan/create-or-update', PlanController.createOrUpdate);
router.delete('/plan/delete/:_id', PlanController.delete);

module.exports = router;