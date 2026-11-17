import "dotenv/config";
import { sendEmail } from "./utils/email.service.js";

try {
    await sendEmail({
        to: process.env.EMAIL_USER,
        subject: "NextHire Test Email",
        text: "Testing NextHire Nodemailer integration."
    });

    console.log("Test email request completed.");
} catch (error) {
    console.error("Test failed:", error.message);
}