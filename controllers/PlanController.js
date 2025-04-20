const Plan = require("../models/Plan")

class PlanController {

    static async createOrUpdate (reqse) {
        try {
            const {_id, type, symbol, mrp, price, messages, valid_till, status} = reqy;
            let plan;

            if (_id) {
                plan = await Plan.findByIdAndUpdate(
                    _id,
                    { type, symbol, mrp, price, messages, valid_till, status },
                    { new: true }
                );
            } else {
                const newPlan = new Plan({ type, symbol, mrp, price, messages, valid_till });
                plan = await newPlan.save();
            }
            return res.json({
                "status": true,
                "message": "Plan saved successfully.",
                "data": plan,
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async delete(req, res) {
        try {
            const { _id } = req.params;
            const deletedPlan = await Plan.findByIdAndDelete(_id);
    
            if (!deletedPlan) {
                return res.status(404).json({
                    status: false,
                    message: "Plan not found.",
                });
            }
    
            return res.json({
                status: true,
                message: "Plan deleted successfully.",
            });
        } catch (error) {
            return res.status(422).json({
                status: false,
                message: error.message || error,
            });
        }
    }

    static async list (req, res) {
        try {
            let filter = null
            if (req.user.role == "client") {
                filter = {
                    status: true
                }
            } else {
                filter = {
                    
                }
            }
            const plans = await Plan.find(filter);
            return res.json({
                status: true,
                message: "Plan fetch successfully.",
                data: plans
            });
        } catch (error) {
            return res.status(422).json({
                status: false,
                message: error.message || error,
            });
        }
    }
}

module.exports = PlanController;