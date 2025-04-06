const Plan = require("../models/Plan")

class PlanController {

    static async createOrUpdate (request, response) {
        try {
            const {_id, type, symbol, mrp, price, messages, valid_till, status} = request.body;
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
            return response.json({
                "status": true,
                "message": "Plan saved successfully.",
                "data": plan,
            });
        } catch (error) {
            return response.status(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async delete(request, response) {
        try {
            const { _id } = request.params;
            const deletedPlan = await Plan.findByIdAndDelete(_id);
    
            if (!deletedPlan) {
                return response.status(404).json({
                    status: false,
                    message: "Plan not found.",
                });
            }
    
            return response.json({
                status: true,
                message: "Plan deleted successfully.",
            });
        } catch (error) {
            return response.status(422).json({
                status: false,
                message: error.message || error,
            });
        }
    }

    static async list (request, response) {
        try {
            let filter = null
            if (request.user.role == "client") {
                filter = {
                    status: true
                }
            } else {
                filter = {
                    
                }
            }
            const plans = await Plan.find(filter);
            return response.json({
                status: true,
                message: "Plan fetch successfully.",
                data: plans
            });
        } catch (error) {
            return response.status(422).json({
                status: false,
                message: error.message || error,
            });
        }
    }
}

module.exports = PlanController;