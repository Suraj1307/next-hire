
import Application from "../models/application.model.js";
import buildEmailPrompt from "../utils/aiPrompt.js";
import generateFromAI from "../utils/geminiMail.js";

export const generateEmail = async (req, res) => {
    try {
        const {
            emailType,
            applicationId,
            customContext,
            manualCompany,
            manualRole
        } = req.body;

        // Validate email type
        if (!emailType) {
            return res.status(400).json({
                message: "emailType is required"
            });
        }

        // Step 1: Get application details
        let jobData = {};

        if (applicationId) {
            const application = await Application.findOne({
                _id: applicationId,
                user: req.user._id
            });

            if (!application) {
                return res.status(404).json({
                    message: "Application not found"
                });
            }

            jobData = {
                company: application.company,
                role: application.role,
                status: application.status
            };

        } else {
            jobData = {
                company: manualCompany,
                role: manualRole,
                status: "Not provided"
            };
        }

        // Step 2: Get applicant profile details
        const applicantData = {
            name: req.user.name,
            email: req.user.email
        };

        // Step 3: Build personalized AI prompt
        const prompt = await buildEmailPrompt({
            emailType,
            jobData,
            customContext,
            applicantData
        });

        // Step 4: Generate email using Gemini
        const aiResult = await generateFromAI(prompt);

        return res.status(200).json({
            emailBody: aiResult.emailBody
        });

    } catch (error) {
        console.error("AI Email Generation Error:", error);

        return res.status(500).json({
            message: "Failed to generate email",
            error: error.message
        });
    }
};
