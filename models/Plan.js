const mongoose = require("mongoose");

const PlanSchema = mongoose.Schema({
    type:  {
        type: String,
        required: true,
    },
    symbol:  {
        type: String,
        required: true,
    },
    mrp:  {
        type: Number,
        required: true,
    },
    price:  {
        type: Number,
        required: true,
    },
    messages:{
        type: Array,
        required: true,
    },
    valid_till: {
        type: Number,
        required: true,
    },
    contact_view_limit: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;