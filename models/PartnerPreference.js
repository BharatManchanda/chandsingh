const mongoose = require("mongoose");

const PartnerPreferenceSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    age_range:{
        min: {
            type: Number,
            required: false,
        },
        max: {
            type: Number,
            required: false,
        },
    },
    height_range:{
        min: {
            type: Number,
            required: false,
        },
        max: {
            type: Number,
            required: false,
        },
    },
    marital_status: {
        type: String,
        required: false
    },
    community:{
        type: String,
        required: false    
    },
    location: {
        type: String,
        required: false
    },
    eductional: {
        type: String,
        required: false
    },
    profession: {
        type: String,
        required: false
    },
    annual_income_range: {
        min: {
            type: Number,
            required: false
        },
        max: {
            type: Number,
            required: false
        }
    },
    profile_created_by: {
        type: String,
        required: false
    },
    diet: {
        type: String,
        required: false
    },
    mother_status: {
        type: String,
        required: false
    },
    father_status: {
        type: String,
        required: false
    },
    no_of_sisters: {
        type: Number,
        required: false
    },
    no_of_brothers: {
        type: Number,
        required: false
    },
    family_financial_status: {
        type: String,
        required: false
    },
    live_with_your_family: {
        type: String,
        required: false
    }
})

const PartnerPreference = mongoose.model('PartnerPreference', PartnerPreferenceSchema);
module.exports = PartnerPreference;