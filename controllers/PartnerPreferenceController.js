const PartnerPreference = require("../models/PartnerPreference")

class PartnerPreferenceController {
    static async create(req, res) {
        try {
            const userId = req.user._id;
            const { age_range, height_range, marital_status, community, location, eductional, profession, annual_income_range, profile_created_by, diet, mother_status, father_status, no_of_sisters, no_of_brothers, family_financial_status, live_with_your_family } = req.body;
            let partnerPreference = await PartnerPreference.findOne({ userId });
            let savedPreference = null;
            if (partnerPreference) {
                savedPreference = await PartnerPreference.findOneAndUpdate({ userId }, {
                    $set: {
                        age_range,
                        height_range,
                        marital_status,
                        community,
                        location,
                        eductional,
                        profession,
                        annual_income_range,
                        profile_created_by,
                        diet,
                        mother_status,
                        father_status,
                        no_of_sisters,
                        no_of_brothers,
                        family_financial_status,
                        live_with_your_family
                    }
                });

            } else {
                const preference = new PartnerPreference({
                    userId,
                    age_range,
                    height_range,
                    marital_status,
                    community,
                    location,
                    eductional,
                    profession,
                    annual_income_range,
                    profile_created_by,
                    diet,
                    mother_status,
                    father_status,
                    no_of_sisters,
                    no_of_brothers,
                    family_financial_status,
                    live_with_your_family
                });
                savedPreference = await preference.save();
            }
            return res.json({
                status: true,
                message: "Perference partner fetched successfully.",
                data: savedPreference,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }
}

module.exports = PartnerPreferenceController;